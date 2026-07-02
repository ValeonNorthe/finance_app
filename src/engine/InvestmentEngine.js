// engine/InvestmentEngine.js
export const calcPortfolioReturn = (assets) => {
  const total = assets.reduce((a, b) => a + b.ratio, 0);
  if (total === 0) return { returnRate: 0, riskRate: 0 };
  const wr = assets.reduce((a, b) => a + (b.ratio / total) * b.expectedReturn, 0);
  const risk = Math.sqrt(assets.reduce((a, b) => a + Math.pow((b.ratio / total) * b.riskRate, 2), 0));
  return { returnRate: wr, riskRate: risk };
};