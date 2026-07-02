import { calcTaxFull } from "../../engine/TaxEngine";
import { simulateWealth } from "../../engine/SimulationEngine";
import { calcPortfolioReturn } from "../../engine/InvestmentEngine";
import { ASSET_TYPES } from "../../constants/appData";

export const selectDashboardKPI = (st) => {
  const taxResult = calcTaxFull(
    st.incomes, st.dependents, st.spouseIncome, st.includeSpouse, st.socialInsurance, 0
  );

  const simData = simulateWealth(st, st.goalYears);

  const totalCurrentAssets =
    st.assets.reduce((a, b) => a + b.currentAmount, 0) +
    st.accounts.reduce((a, b) => a + b.balance, 0);

  const { returnRate, riskRate } = calcPortfolioReturn(st.assets);

  const finalNominal = simData.at(-1)?.nominal || 0;
  const finalReal = simData.at(-1)?.real || 0;

  const progress = Math.min(100, (totalCurrentAssets / st.goalAmount) * 100);

  const goalIdx = simData.findIndex(d => d.nominal >= st.goalAmount);
  const goalAge = goalIdx >= 0 ? simData[goalIdx]?.age : null;

  const monthlyExp =
    Object.values(st.monthlyFixed).reduce((a, b) => a + b, 0) +
    Object.values(st.monthlyVariable).reduce((a, b) => a + b, 0);

  const surplus = taxResult.takehome / 12 - monthlyExp;

  const currentAge = st.birthDate
    ? new Date().getFullYear() - new Date(st.birthDate).getFullYear()
    : "−";

  return {
    taxResult,
    simData,
    totalCurrentAssets,
    returnRate,
    riskRate,
    finalNominal,
    finalReal,
    progress,
    goalAge,
    monthlyExp,
    surplus,
    currentAge
  };
};

export const selectChartData = (st, simData) => {
  return simData
    .filter((_, i) => i % Math.max(1, Math.floor(st.goalYears / 10)) === 0 || i === simData.length - 1)
    .map(d => ({
      label: `${d.age}歳`,
      名目資産: Math.round(d.nominal),
      実質資産: Math.round(d.real),
      楽観: Math.round(d.optimistic),
      悲観: Math.round(d.pessimistic),
    }));
};

export const selectPieData = (st) => {
  return st.assets.map((a, i) => ({
    name: ASSET_TYPES[i].label,
    value: a.ratio,
    color: ASSET_TYPES[i].color
  })).filter(d => d.value > 0);
};

export const selectAccChartData = (st, simData) => {
  return simData
    .filter((_, i) => i % Math.max(1, Math.floor(st.goalYears / 8)) === 0 || i === simData.length - 1)
    .map(d => ({
      label: `${d.age}歳`,
      資産: Math.round(d.nominal),
    }));
};
