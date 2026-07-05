import { calcTaxFull } from "./TaxEngine";
import { calcPortfolioReturn } from "./InvestmentEngine";
import { calcLoanPayment } from "./LoanEngine";
import { calcPensionFactor } from "./PensionEngine";
import { EDU_PATTERNS } from "../constants/appData";

const getLifestageForYear = (lifestages, year) => {
  // yearは現在からの経過年数
  const ls = lifestages.filter(s => s.fromYear <= year).sort((a, b) => b.fromYear - a.fromYear);
  return ls[0] || null;
};

export const calcCurrentAge = (birthDate, fallback = 30) => {
  if (!birthDate) return fallback;
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export const resolveSimulationYears = (yearsOrTimeline, st) => {
  if (Array.isArray(yearsOrTimeline)) {
    return Math.max(0, yearsOrTimeline.length - 1);
  }
  if (typeof yearsOrTimeline === "number" && Number.isFinite(yearsOrTimeline)) {
    return Math.max(0, yearsOrTimeline);
  }
  return Math.max(0, st.goalYears || 30);
};

export const buildSimulationSummary = (st, yearsOrTimeline) => {
  const years = resolveSimulationYears(yearsOrTimeline, st);
  const data = simulateWealth(st, years);
  const goalIdx = data.findIndex((d) => d.nominal >= st.goalAmount);
  const last = data.at(-1);

  return {
    data,
    years,
    achievedAge: goalIdx >= 0 ? data[goalIdx].age : null,
    minWealth: data.length ? Math.min(...data.map((d) => d.nominal)) : 0,
    finalNominal: last?.nominal ?? 0,
    finalReal: last?.real ?? 0,
  };
};

export const simulateWealth = (st, years) => {
  const { returnRate, riskRate } = calcPortfolioReturn(st.assets);
  const infl = (st.inflationRate / 100);
  const inflRisk = (st.inflationRiskRate / 100);

  const sigma = st.sigmaLevel || 1;
  const retNominal = returnRate / 100;
  const retOptimistic = (returnRate + riskRate * sigma) / 100;
  const retPessimistic = (returnRate - riskRate * sigma) / 100;

  // 初期資産額
  const initialAssets = st.assets.reduce((a, b) => a + (b.currentAmount || 0), 0)
    + st.accounts.reduce((a, b) => a + (b.balance || 0), 0);

  let totalAssetsNominal = initialAssets;
  let totalAssetsOptimistic = initialAssets;
  let totalAssetsPessimistic = initialAssets;

  // 口座の初期状態のコピー (基本予測用)
  let currentAccounts = st.accounts.map(acc => ({
    ...acc,
    currentBalance: acc.balance || 0
  }));

  // アセットの初期状態のコピー (基本予測用)
  let currentAssets = st.assets.map(asset => ({
    ...asset,
    currentAmount: asset.currentAmount || 0
  }));

  const data = [];
  const currentAge = calcCurrentAge(st.birthDate, st.currentAge || 30);
  const simulationYears = resolveSimulationYears(years, st);

  for (let yr = 0; yr <= simulationYears; yr++) {
    const inflAdj = Math.pow(1 + infl, yr);
    const age = currentAge + yr;

    // ライフステージ収入取得
    const ls = getLifestageForYear(st.lifestages, yr);
    
    // 期間指定の反映された収入のフィルタリング
    const activeIncomes = (ls?.incomes || st.incomes).filter(inc => {
      if (inc.active === false) return false;
      const start = inc.startAge !== undefined ? inc.startAge : currentAge;
      const end = inc.endAge !== undefined ? inc.endAge : 120;
      return age >= start && age <= end;
    });

    let takehome = 0;
    const taxResult = calcTaxFull(
      activeIncomes,
      st.dependents,
      st.spouseIncome,
      st.includeSpouse,
      ls?.socialInsurance || st.socialInsurance,
      0
    );
    takehome = taxResult.takehome;

    const monthlyTH = takehome / 12;

    // 支出の計算（「健康・医療」の除外と二重計上防止）
    const monthlyFixed = Object.values(st.monthlyFixed).reduce((a, b) => a + b, 0);
    const monthlyVar = Object.keys(st.monthlyVariable)
      .filter(key => key !== "health")
      .reduce((a, key) => a + st.monthlyVariable[key], 0);

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

    // 年金受給
    let annualPension = 0;
    const pensionFactor = calcPensionFactor(st.pensionStartAge);
    annualPension = st.pensionRecords.reduce((a, p) => {
      const isPublic = ["kiso", "kosei"].includes(p.type);
      const start = isPublic ? st.pensionStartAge : p.startAge;
      if (age >= start && age <= (p.endAge || 120)) {
        const amt = p.monthlyAmount * (isPublic ? pensionFactor : 1.0) * 12;
        return a + amt;
      }
      return a;
    }, 0);

    // 積立投資額（口座別の積立合計と同期）
    const activeAccounts = currentAccounts.map(acc => {
      const start = acc.startAge !== undefined ? acc.startAge : currentAge;
      const end = acc.endAge !== undefined ? acc.endAge : 120;
      const isActive = age >= start && age <= end;
      return { ...acc, isAccumulating: isActive };
    });

    const monthlyInvest = activeAccounts.reduce((sum, acc) => {
      return sum + (acc.isAccumulating ? (acc.monthly || 0) : 0);
    }, 0);

    // 月次の複利計算（各シナリオ）
    for (let m = 0; m < 12; m++) {
      totalAssetsNominal = totalAssetsNominal * (1 + retNominal / 12) + (monthlyTH - monthlyExp) + monthlyInvest;
      totalAssetsOptimistic = totalAssetsOptimistic * (1 + retOptimistic / 12) + (monthlyTH - monthlyExp) + monthlyInvest;
      totalAssetsPessimistic = totalAssetsPessimistic * (1 + retPessimistic / 12) + (monthlyTH - monthlyExp) + monthlyInvest;

      // 口座別の残高更新 (基本予測ベース)
      currentAccounts = currentAccounts.map(acc => {
        let bal = acc.currentBalance;
        const start = acc.startAge !== undefined ? acc.startAge : currentAge;
        const end = acc.endAge !== undefined ? acc.endAge : 120;
        if (age >= start && age <= end) {
          // Check maxBalance limit before adding monthly contribution
          const maxBal = acc.maxBalance;
          if (maxBal === null || bal < maxBal) {
            const contribution = acc.monthly || 0;
            if (maxBal === null || bal + contribution <= maxBal) {
              bal += contribution;
            } else {
              // Only add up to the max balance
              bal = maxBal;
            }
          }
        }
        const isInvest = ["nisa", "ideco", "specific_w", "specific_r", "general"].includes(acc.type);
        const r = isInvest ? retNominal : 0.001;
        bal = bal * (1 + r / 12);
        return { ...acc, currentBalance: bal };
      });

      // 収支の配分 (基本予測ベース)
      const monthlyNet = (monthlyTH - monthlyExp);
      if (monthlyNet > 0) {
        let livingAcc = currentAccounts.find(a => a.type === "living") || currentAccounts[0];
        if (livingAcc) livingAcc.currentBalance += monthlyNet;
      } else if (monthlyNet < 0) {
        let deficit = Math.abs(monthlyNet);
        const order = ["living", "emergency", "medium", "special", "fixed", "business", "corporate", "nisa", "specific_w", "specific_r", "general", "ideco", "sme"];
        const sortedAccs = [...currentAccounts].sort((a, b) => {
          const idxA = order.indexOf(a.type);
          const idxB = order.indexOf(b.type);
          return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
        });

        for (let sa of sortedAccs) {
          const realAcc = currentAccounts.find(a => a.id === sa.id);
          if (realAcc.currentBalance >= deficit) {
            realAcc.currentBalance -= deficit;
            deficit = 0;
            break;
          } else {
            deficit -= realAcc.currentBalance;
            realAcc.currentBalance = 0;
          }
        }
        if (deficit > 0) {
          let livingAcc = currentAccounts.find(a => a.type === "living") || currentAccounts[0];
          if (livingAcc) livingAcc.currentBalance -= deficit;
        }
      }
    }

    // アセット別残高の更新 (基本予測ベース、年利で簡易計算、アセット全体の比率調整用)
    currentAssets = currentAssets.map(asset => {
      if (asset.key === "cash") {
        const cashTypes = ["living", "emergency", "medium", "special", "business", "corporate", "fixed"];
        const cashBalance = currentAccounts
          .filter(a => cashTypes.includes(a.type))
          .reduce((sum, a) => sum + a.currentBalance, 0);
        return { ...asset, currentAmount: Math.max(0, cashBalance) };
      } else {
        const r = (asset.expectedReturn || 0) / 100;
        const amt = asset.currentAmount * (1 + r);
        return { ...asset, currentAmount: amt };
      }
    });

    // 年次ライフイベントコスト
    let eventCost = 0;

    // 結婚
    if (st.married && yr === st.marriageYear) {
      eventCost += st.marriageCost;
      if (st.includeSpouse && st.partnerIncomeDelta) {
        totalAssetsNominal += st.partnerIncomeDelta;
        totalAssetsOptimistic += st.partnerIncomeDelta;
        totalAssetsPessimistic += st.partnerIncomeDelta;
      }
    }

    // 子供（自立年齢の反映）
    (st.children || []).forEach(child => {
      if (yr === child.birthYear) eventCost += child.birthCost || 500_000;
      
      const childAge = yr - child.birthYear;
      const indepAge = child.independenceAge !== undefined ? child.independenceAge : 22;

      // 育児費用（自立年齢まで発生）
      if (childAge >= 0 && childAge < indepAge) {
        if (childAge < 6) {
          eventCost += (child.annualChildcareCost || 300_000) * inflAdj;
        } else {
          eventCost += 300_000 * inflAdj;
        }
      }

      // 教育費
      const eduPat = EDU_PATTERNS[child.eduPattern] || EDU_PATTERNS[0];
      if (childAge === 6)  eventCost += eduPat.cost * 10_000 * 0.25;
      if (childAge === 12) eventCost += eduPat.cost * 10_000 * 0.20;
      if (childAge === 15) eventCost += eduPat.cost * 10_000 * 0.20;
      if (childAge === 18) eventCost += eduPat.cost * 10_000 * 0.35;
    });

    // 住宅購入頭金
    if (st.housing === "loan" && yr === st.housingYear) {
      eventCost += st.loanAmount * 0.1;
    }

    totalAssetsNominal -= eventCost;
    totalAssetsOptimistic -= eventCost;
    totalAssetsPessimistic -= eventCost;

    // 年金受給を加算 (基本予測のみ、口座への反映用)
    if (annualPension > 0) {
      let livingAcc = currentAccounts.find(a => a.type === "living") || currentAccounts[0];
      if (livingAcc) livingAcc.currentBalance += annualPension;
    }

    // ライフイベント費用を口座から引く
    if (eventCost > 0) {
      let deficit = eventCost;
      const order = ["living", "emergency", "medium", "special", "fixed", "business", "corporate", "nisa", "specific_w", "specific_r", "general", "ideco", "sme"];
      const sortedAccs = [...currentAccounts].sort((a, b) => {
        const idxA = order.indexOf(a.type);
        const idxB = order.indexOf(b.type);
        return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
      });
      for (let sa of sortedAccs) {
        const realAcc = currentAccounts.find(a => a.id === sa.id);
        if (realAcc.currentBalance >= deficit) {
          realAcc.currentBalance -= deficit;
          deficit = 0;
          break;
        } else {
          deficit -= realAcc.currentBalance;
          realAcc.currentBalance = 0;
        }
      }
      if (deficit > 0) {
        let livingAcc = currentAccounts.find(a => a.type === "living") || currentAccounts[0];
        if (livingAcc) livingAcc.currentBalance -= deficit;
      }
    }

    // 口座残高を保存
    const accBalances = {};
    currentAccounts.forEach(acc => {
      accBalances[acc.label] = Math.round(acc.currentBalance);
    });

    // アセット残高を保存
    const assetBalances = {};
    currentAssets.forEach(asset => {
      assetBalances[asset.key] = Math.round(asset.currentAmount);
    });

    const cashflow = Math.round((monthlyTH - monthlyExp) * 12 + annualPension - annualMedical - eventCost);

    // Fix optimistic/pessimistic reversal when assets are negative
    // When negative: optimistic should be less negative (closer to 0), pessimistic should be more negative
    const baseOptimistic = Math.round(totalAssetsOptimistic);
    const basePessimistic = Math.round(totalAssetsPessimistic * Math.pow(1 - inflRisk, yr));
    
    let optimistic, pessimistic;
    if (totalAssetsNominal < 0) {
      // When negative, swap so optimistic is higher (less negative)
      optimistic = Math.max(baseOptimistic, basePessimistic);
      pessimistic = Math.min(baseOptimistic, basePessimistic);
    } else {
      // When positive, optimistic is higher
      optimistic = baseOptimistic;
      pessimistic = basePessimistic;
    }

    data.push({
      year: yr,
      age,
      nominal: Math.round(totalAssetsNominal),
      real: Math.round(totalAssetsNominal / inflAdj),
      pessimistic,
      optimistic,
      cashflow,
      eventCost: Math.round(eventCost),
      takehome: Math.round(takehome),
      annualExpense: Math.round(monthlyExp * 12),
      accBalances,
      assetBalances,
    });
  }

  return data;
};
