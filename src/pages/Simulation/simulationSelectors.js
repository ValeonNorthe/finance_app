import { simulateWealth } from "../../engine/SimulationEngine";
import { calcPortfolioReturn } from "../../engine/InvestmentEngine";

export const selectSimulationData = (state) =>
  simulateWealth(state, state.goalYears);

export const selectGoalAchievementAge = (simData, goalAmount) => {
  const idx = simData.findIndex((d) => d.nominal >= goalAmount);
  return idx >= 0 ? simData[idx].age : null;
};

export const selectFinalNominal = (simData) =>
  simData[simData.length - 1]?.nominal || 0;

export const selectPortfolioStats = (assets) =>
  calcPortfolioReturn(assets);

export const selectScenarioValues = (finalNominal, riskRate) => ({
  optimistic: finalNominal * (1 + riskRate / 100),
  base: finalNominal,
  pessimistic: finalNominal * (1 - riskRate / 100),
});
