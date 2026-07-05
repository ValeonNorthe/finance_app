// engine/InvestmentEngine.js
export const calcPortfolioReturn = (assets) => {
  if (!assets || !Array.isArray(assets) || assets.length === 0) {
    return { returnRate: 0, riskRate: 0 };
  }
  const total = assets.reduce((a, b) => a + (b.ratio || 0), 0);
  if (total === 0) return { returnRate: 0, riskRate: 0 };
  const wr = assets.reduce((a, b) => a + ((b.ratio || 0) / total) * (b.expectedReturn || 0), 0);
  const risk = Math.sqrt(assets.reduce((a, b) => a + Math.pow(((b.ratio || 0) / total) * (b.riskRate || 0), 2), 0));
  return { returnRate: wr, riskRate: risk };
};