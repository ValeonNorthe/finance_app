// engine/LoanEngine.js
export const calcLoanPayment = (amount, rate, years) => {
  if (rate === 0) return amount / (years * 12);
  const r = rate / 100 / 12;
  const n = years * 12;
  return amount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
};
