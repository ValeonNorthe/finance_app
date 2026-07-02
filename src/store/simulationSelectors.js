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
    const finalNominal = simData.at(-1)?.nominal || 0;
    const finalReal = simData.at(-1)?.real || 0;
    const progress = Math.min(100, (totalCurrentAssets / st.goalAmount) * 100);
    const goalIdx = simData.findIndex((d) => d.nominal >= st.goalAmount);
    const goalAge = goalIdx >= 0 ? simData[goalIdx]?.age : null;

    const monthlyExp =
      Object.values(st.monthlyFixed).reduce((a, b) => a + b, 0) +
      Object.values(st.monthlyVariable).reduce((a, b) => a + b, 0);

    const surplus = taxResult.takehome / 12 - monthlyExp;

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
      currentAge,
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

export const selectPieData = createSelector([selectSettings], (st) =>
  st.assets
    .map((a, i) => ({
      name: ASSET_TYPES[i].label,
      value: a.ratio,
      color: ASSET_TYPES[i].color,
    }))
    .filter((d) => d.value > 0)
);

export const selectAccChartData = createSelector(
  [selectSettings, selectSimulationData],
  (st, simData) =>
    simData
      .filter(
        (_, i) =>
          i % Math.max(1, Math.floor(st.goalYears / 8)) === 0 ||
          i === simData.length - 1
      )
      .map((d) => ({
        label: `${d.age}歳`,
        資産: Math.round(d.nominal),
      }))
);

// ── Simulation tab helpers ──────────────────────────────────

export const selectGoalAchievementAge = createSelector(
  [selectSimulationData, selectSettings],
  (simData, st) => {
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

export const selectTotalBalance = createSelector([selectSettings], (st) =>
  st.accounts.reduce((a, b) => a + b.balance, 0)
);

export const selectAccountChartData = createSelector(
  [selectSettings, selectSimulationData],
  (st, simData) =>
    simData
      .filter((_, i) => i % Math.max(1, Math.floor(simData.length / 10)) === 0)
      .map((d) => {
        const row = { label: `${d.age}歳` };
        st.accounts.forEach((acc) => {
          row[acc.label] = Math.round(
            acc.balance * Math.pow(1.03, d.year) + acc.monthly * 12 * d.year
          );
        });
        return row;
      })
);
