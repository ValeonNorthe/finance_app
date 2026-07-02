import { simulateWealth } from "../../engine/SimulationEngine";
import { ACC_TYPES } from "../../constants/appData";

export const selectTotalBalance = (st) => {
  return st.accounts.reduce((a, b) => a + b.balance, 0);
};

export const selectAccountChartData = (st) => {
  const simData = simulateWealth(st, Math.min(st.goalYears, 40));

  return simData
    .filter((_, i) => i % Math.max(1, Math.floor(simData.length / 10)) === 0)
    .map(d => {
      const row = { label: `${d.age}歳` };

      st.accounts.forEach(acc => {
        const color = ACC_TYPES.find(t => t.key === acc.type)?.color || "#2a78d6";
        row[acc.label] = Math.round(
          acc.balance * Math.pow(1.03, d.year) + acc.monthly * 12 * d.year
        );
      });

      return row;
    });
};
