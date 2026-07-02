import { calcPortfolioReturn } from "../../engine/InvestmentEngine";
import { ASSET_TYPES } from "../../constants/appData";

export const selectPortfolioSummary = (st) => {
  const totalRatio = st.assets.reduce((a, b) => a + b.ratio, 0);
  const totalAmount = st.assets.reduce((a, b) => a + b.currentAmount, 0);

  const { returnRate, riskRate } = calcPortfolioReturn(st.assets);

  return {
    totalRatio,
    totalAmount,
    returnRate,
    riskRate
  };
};

export const selectSortedAssetChartData = (st) => {
  return [...st.assets]
    .sort((a, b) => b.currentAmount - a.currentAmount)
    .map(a => ({
      name: ASSET_TYPES.find(x => x.key === a.key)?.label,
      value: Math.round(a.currentAmount),
      color: ASSET_TYPES.find(x => x.key === a.key)?.color
    }));
};
