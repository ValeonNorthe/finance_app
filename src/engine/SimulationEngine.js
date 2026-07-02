import { calcTaxFull } from "./TaxEngine";
import { calcPortfolioReturn } from "./InvestmentEngine";
import { calcLoanPayment } from "./LoanEngine";
import { EDU_PATTERNS } from "../constants/appData";

const getLifestageForYear = (lifestages, year) => {
 // yearは現在からの経過年数
  const ls = lifestages.filter(s => s.fromYear <= year).sort((a, b) => b.fromYear - a.fromYear);
  return ls[0] || null;
};

export const simulateWealth = (st, years) => {
  const { returnRate, riskRate } = calcPortfolioReturn(st.assets);
  const infl = (st.inflationRate / 100);
  const inflRisk = (st.inflationRiskRate / 100);
  const ret = returnRate / 100;

  let totalAssets = st.assets.reduce((a, b) => a + b.currentAmount, 0)
    + st.accounts.reduce((a, b) => a + b.balance, 0);

  const data = [];
  const birthDate = st.birthDate;
  const currentAge = birthDate
    ? new Date().getFullYear() - new Date(birthDate).getFullYear()
    : 30;

  for (let yr = 0; yr <= years; yr++) {
    const inflAdj = Math.pow(1 + infl, yr);
    const age = currentAge + yr;

    // ライフステージ収入取得
    const ls = getLifestageForYear(st.lifestages, yr);
    let takehome = 0;
    if (ls) {
      const taxResult = calcTaxFull(
        ls.incomes || st.incomes,
        st.dependents,
        st.spouseIncome,
        st.includeSpouse,
        ls.socialInsurance || st.socialInsurance,
        0
      );
      takehome = taxResult.takehome;
    } else {
      const taxResult = calcTaxFull(
        st.incomes, st.dependents, st.spouseIncome, st.includeSpouse, st.socialInsurance, 0
      );
      takehome = taxResult.takehome;
    }

    const monthlyTH = takehome / 12;

    // 月次支出
    const monthlyFixed = Object.values(st.monthlyFixed).reduce((a, b) => a + b, 0);
    const monthlyVar = Object.values(st.monthlyVariable).reduce((a, b) => a + b, 0);
    let monthlyExp = (monthlyFixed + monthlyVar) * inflAdj;

    // 住宅ローン
    if (st.housing === "loan" && yr >= st.housingYear) {
      const lp = calcLoanPayment(st.loanAmount, st.loanRate, st.loanYears);
      monthlyExp = monthlyExp - st.monthlyFixed.rent * inflAdj + lp;
    }

    // 医療費（インフレ調整）
    const annualMedical = (
      (st.medical?.regular || 0) +
      (st.medical?.emergency || 0) +
      (st.medical?.checkup || 0) +
      (st.medical?.dental || 0)
    ) * inflAdj;

    // 年金受給（退職後）
    let annualPension = 0;
    if (age >= st.pensionStartAge) {
      annualPension = st.pensionRecords.reduce((a, p) => {
        if (age >= p.startAge && age <= (p.endAge || 120)) {
          return a + p.monthlyAmount * 12;
        }
        return a;
      }, 0);
    }

    const annualSave = (monthlyTH - monthlyExp) * 12 + annualPension - annualMedical;
    const monthlyInvest = ls?.monthlyInvest ?? st.monthlyInvest;

    // 資産成長（月複利）
    for (let m = 0; m < 12; m++) {
      totalAssets = totalAssets * (1 + ret / 12) + (monthlyTH - monthlyExp) + monthlyInvest / 12;
    }

    // 年次ライフイベントコスト
    let eventCost = 0;

    // 結婚
    if (st.married && yr === st.marriageYear) {
      eventCost += st.marriageCost;
      if (st.includeSpouse && st.partnerIncomeDelta) totalAssets += st.partnerIncomeDelta;
    }

    // 子供
    (st.children || []).forEach(child => {
      if (yr === child.birthYear) eventCost += child.birthCost || 500_000;
      // 育児費用（0〜6歳）
      if (yr >= child.birthYear && yr < child.birthYear + 6) {
        eventCost += (child.annualChildcareCost || 300_000) * inflAdj;
      }
      // 教育費
      const eduPat = EDU_PATTERNS[child.eduPattern] || EDU_PATTERNS[0];
      if (yr === child.birthYear + 6)  eventCost += eduPat.cost * 10_000 * 0.25;
      if (yr === child.birthYear + 12) eventCost += eduPat.cost * 10_000 * 0.20;
      if (yr === child.birthYear + 15) eventCost += eduPat.cost * 10_000 * 0.20;
      if (yr === child.birthYear + 18) eventCost += eduPat.cost * 10_000 * 0.35;
    });

    // 住宅購入頭金
    if (st.housing === "loan" && yr === st.housingYear) {
      eventCost += st.loanAmount * 0.1;
    }

    totalAssets -= eventCost;

    const cashflow = Math.round(annualSave - eventCost + monthlyInvest * 12);

    data.push({
      year: yr,
      age,
      nominal: Math.round(totalAssets),
      real: Math.round(totalAssets / inflAdj),
      pessimistic: Math.round(totalAssets * (1 - riskRate / 100) * Math.pow(1 - inflRisk, yr)),
      optimistic: Math.round(totalAssets * (1 + riskRate / 100)),
      cashflow,
      eventCost: Math.round(eventCost),
      takehome: Math.round(takehome),
      annualExpense: Math.round(monthlyExp * 12),
    });
  }
  return data;
};
