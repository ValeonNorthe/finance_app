import { createSelector } from "@reduxjs/toolkit";
import { calcTaxFull } from "../engine/TaxEngine";
import {
  buildSimulationSummary,
  calcCurrentAge,
} from "../engine/SimulationEngine";
import { calcPortfolioReturn } from "../engine/InvestmentEngine";
import { ASSET_TYPES } from "../constants/appData";

// ── Base selectors ──────────────────────────────────────────

export const selectSettings = (state) => state.settings;
export const selectSimulationMeta = (state) => state.simulation;

export const selectCurrentAge = createSelector([selectSettings], (st) =>
  calcCurrentAge(st.birthDate, st.currentAge || 30)
);

export const selectEndAge = createSelector(
  [selectSettings, selectCurrentAge, selectSimulationMeta],
  (st, currentAge, meta) => {
    if (meta.horizon === "life") {
      return Math.max(
        currentAge + (st.goalYears || 30),
        st.retirementAge || 85,
        100
      );
    }
    return currentAge + (st.goalYears || 30);
  }
);

export const selectTimeline = createSelector(
  [selectCurrentAge, selectEndAge],
  (startAge, endAge) => {
    const years = [];
    let calendarYear = new Date().getFullYear();
    for (let age = startAge; age <= endAge; age++) {
      years.push({
        year: calendarYear,
        age,
        index: age - startAge,
      });
      calendarYear++;
    }
    return years;
  }
);

export const selectTaxResult = createSelector([selectSettings], (st) =>
  calcTaxFull(
    st.incomes,
    st.dependents,
    st.spouseIncome,
    st.includeSpouse,
    st.socialInsurance,
    0
  )
);

// ── Core simulation (single source of truth) ────────────────

export const selectSimulationSummary = createSelector(
  [selectSettings, selectTimeline],
  (st, timeline) => buildSimulationSummary(st, timeline)
);

export const selectSimulationData = createSelector(
  [selectSimulationSummary],
  (summary) => summary.data
);

export const selectPortfolioStats = createSelector([selectSettings], (st) =>
  calcPortfolioReturn(st.assets)
);

export const selectTotalAssets = createSelector([selectSettings], (st) => {
  const assetSum = Array.isArray(st.assets)
    ? st.assets.reduce((a, b) => a + (b.currentAmount || 0), 0)
    : 0;
  const accountSum = Array.isArray(st.accounts)
    ? st.accounts.reduce((a, b) => a + (b.balance || 0), 0)
    : 0;
  return assetSum + accountSum;
});

export const selectTotalAnnualIncome = createSelector([selectSettings], (st) => {
  if (!Array.isArray(st.incomes)) return 0;
  return st.incomes.reduce(
    (a, b) => a + (b.active !== false ? (b.amount || 0) : 0),
    0
  );
});

// ── Dashboard ───────────────────────────────────────────────

export const selectDashboardKPI = createSelector(
  [selectSettings, selectTaxResult, selectSimulationData, selectPortfolioStats, selectCurrentAge, selectTotalAssets],
  (st, taxResult, simData, { returnRate, riskRate }, currentAge, totalCurrentAssets) => {
    if (!st) {
      return {
        taxResult: { takehome: 0 },
        simData: [],
        totalCurrentAssets: 0,
        returnRate: 0,
        riskRate: 0,
        finalNominal: 0,
        finalReal: 0,
        progress: 0,
        goalAge: null,
        monthlyExp: 0,
        surplus: 0,
        currentAge: 30,
      };
    }

    const finalNominal = simData?.at(-1)?.nominal || 0;
    const finalReal = simData?.at(-1)?.real || 0;
    const progress = st.goalAmount > 0 ? Math.min(100, (totalCurrentAssets / st.goalAmount) * 100) : 0;
    const goalIdx = simData?.findIndex((d) => d.nominal >= st.goalAmount) ?? -1;
    const goalAge = goalIdx >= 0 ? simData[goalIdx]?.age : null;

    const monthlyExp =
      Object.values(st.monthlyFixed || {}).reduce((a, b) => a + (b || 0), 0) +
      Object.values(st.monthlyVariable || {}).reduce((a, b) => a + (b || 0), 0);

    const surplus = (taxResult?.takehome || 0) / 12 - monthlyExp;

    return {
      taxResult: taxResult || { takehome: 0 },
      simData: simData || [],
      totalCurrentAssets: totalCurrentAssets || 0,
      returnRate: returnRate || 0,
      riskRate: riskRate || 0,
      finalNominal,
      finalReal,
      progress,
      goalAge,
      monthlyExp,
      surplus,
      currentAge: currentAge || 30,
    };
  }
);

export const selectChartData = createSelector(
  [selectSettings, selectSimulationData],
  (st, simData) =>
    simData
      .filter(
        (_, i) =>
          i % Math.max(1, Math.floor(st.goalYears / 10)) === 0 ||
          i === simData.length - 1
      )
      .map((d) => ({
        label: `${d.age}歳`,
        名目資産: Math.round(d.nominal),
        実質資産: Math.round(d.real),
        楽観: Math.round(d.optimistic),
        悲観: Math.round(d.pessimistic),
      }))
);

export const selectPieData = createSelector([selectSettings], (st) => {
  if (!st || !st.assets || !Array.isArray(st.assets)) {
    return [];
  }
  return st.assets
    .map((a, i) => ({
      name: ASSET_TYPES[i]?.label || 'Unknown',
      value: a.ratio || 0,
      color: ASSET_TYPES[i]?.color || '#999',
    }))
    .filter((d) => d.value > 0);
});

export const selectAssetAllocationTrend = createSelector(
  [selectSettings, selectSimulationData],
  (st, simData) => {
    if (!st || !st.assets || !Array.isArray(st.assets) || !simData || !Array.isArray(simData)) {
      return [];
    }
    return simData
      .filter((_, i) => i % Math.max(1, Math.floor(simData.length / 15)) === 0 || i === simData.length - 1)
      .map((d) => {
        const row = { label: `${d.age}歳` };
        const totalAssets = d.nominal || 1;
        
        st.assets.forEach((asset, i) => {
          const assetType = ASSET_TYPES[i];
          if (!assetType) return;
          const assetBalance = d.assetBalances?.[assetType.key] || 0;
          row[assetType.label] = totalAssets > 0 ? (assetBalance / totalAssets) * 100 : 0;
        });
        
        return row;
      });
  }
);

export const selectAccChartData = createSelector(
  [selectSettings, selectSimulationData],
  (st, simData) => {
    if (!st || !simData || !Array.isArray(simData)) {
      return [];
    }
    return simData
      .filter(
        (_, i) =>
          i % Math.max(1, Math.floor((st.goalYears || 30) / 8)) === 0 ||
          i === simData.length - 1
      )
      .map((d) => ({
        label: `${d.age}歳`,
        資産: Math.round(d.nominal || 0),
      }));
  }
);

// ── Simulation tab helpers ──────────────────────────────────

export const selectGoalAchievementAge = createSelector(
  [selectSimulationData, selectSettings],
  (simData, st) => {
    if (!simData || !Array.isArray(simData) || !st) return null;
    const idx = simData.findIndex((d) => d.nominal >= st.goalAmount);
    return idx >= 0 ? simData[idx].age : null;
  }
);

export const selectFinalNominal = createSelector(
  [selectSimulationSummary],
  (summary) => summary.finalNominal
);

export const selectScenarioValues = createSelector(
  [selectFinalNominal, selectPortfolioStats],
  (finalNominal, { riskRate }) => ({
    optimistic: finalNominal * (1 + riskRate / 100),
    base: finalNominal,
    pessimistic: finalNominal * (1 - riskRate / 100),
  })
);

// ── Accounts tab ────────────────────────────────────────────

export const selectTotalBalance = createSelector([selectSettings], (st) => {
  if (!st || !st.accounts || !Array.isArray(st.accounts)) return 0;
  return st.accounts.reduce((a, b) => a + (b.balance || 0), 0);
});

export const selectAccountChartData = createSelector(
  [selectSettings, selectSimulationData],
  (st, simData) => {
    if (!st || !st.accounts || !Array.isArray(st.accounts) || !simData || !Array.isArray(simData)) {
      return [];
    }
    return simData
      .filter((_, i) => i % Math.max(1, Math.floor(simData.length / 10)) === 0)
      .map((d) => {
        const row = { label: `${d.age}歳` };
        st.accounts.forEach((acc) => {
          row[acc.label] = Math.round(
            (acc.balance || 0) * Math.pow(1.03, d.year) + (acc.monthly || 0) * 12 * d.year
          );
        });
        return row;
      });
  }
);

export const selectMonthlyCashflowData = createSelector(
  [selectSettings, selectTaxResult],
  (st, taxResult) => {
    if (!st) {
      return [{
        name: "収入と支出のバランス",
        "手取り月収": 0,
        "固定費": 0,
        "変動費": 0,
        "医療費": 0,
        "投資額": 0,
        "貯蓄余剰": 0,
        "赤字": 0,
      }];
    }

    const monthlyTH = Math.round((taxResult?.takehome || 0) / 12);
    const fixed = Object.values(st.monthlyFixed || {}).reduce((a, b) => a + (b || 0), 0);
    const variable = Object.keys(st.monthlyVariable || {})
      .filter(key => key !== "health")
      .reduce((a, key) => a + (st.monthlyVariable[key] || 0), 0);

    const annualMedical = (
      (st.medical?.regular || 0) +
      (st.medical?.emergency || 0) +
      (st.medical?.checkup || 0) +
      (st.medical?.dental || 0)
    );
    const monthlyMedical = Math.round(annualMedical / 12);

    const invest = (st.accounts || []).reduce((sum, a) => sum + (a.monthly || 0), 0);
    const totalExpAndInvest = fixed + variable + monthlyMedical + invest;
    const surplus = monthlyTH - totalExpAndInvest;

    return [
      {
        name: "収入と支出のバランス",
        "手取り月収": monthlyTH,
        "固定費": fixed,
        "変動費": variable,
        "医療費": monthlyMedical,
        "投資額": invest,
        "貯蓄余剰": surplus > 0 ? surplus : 0,
        "赤字": surplus < 0 ? Math.abs(surplus) : 0,
      }
    ];
  }
);
