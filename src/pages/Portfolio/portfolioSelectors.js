import { calcPortfolioReturn } from "../../engine/InvestmentEngine";
import { ASSET_TYPES } from "../../constants/appData";

export const selectPortfolioSummary = (st) => {
  if (!st || !st.assets || !Array.isArray(st.assets)) {
    return {
      totalRatio: 0,
      totalAmount: 0,
      returnRate: 0,
      riskRate: 0
    };
  }

  const totalRatio = st.assets.reduce((a, b) => a + (b.ratio || 0), 0);
  const totalAmount = st.assets.reduce((a, b) => a + (b.currentAmount || 0), 0);

  const { returnRate, riskRate } = calcPortfolioReturn(st.assets);

  return {
    totalRatio,
    totalAmount,
    returnRate,
    riskRate
  };
};

export const selectSortedAssetChartData = (st) => {
  if (!st || !st.assets || !Array.isArray(st.assets)) return [];
  return [...st.assets]
    .sort((a, b) => (b.currentAmount || 0) - (a.currentAmount || 0))
    .map(a => ({
      name: ASSET_TYPES.find(x => x.key === a.key)?.label || a.key,
      value: Math.round(a.currentAmount || 0),
      color: ASSET_TYPES.find(x => x.key === a.key)?.color || "#898781"
    }));
};

export const selectAssetAllocationTrend = (st) => {
  // This selector needs simulation data, but for now return empty array
  // The actual implementation is in simulationSelectors.js
  return [];
};
