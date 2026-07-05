import { calcLoanPayment } from "../../engine/LoanEngine";

export const selectCurrentAge = (st) => {
  if (!st || !st.birthDate) return 30;
  const now = new Date();
  const born = new Date(st.birthDate);
  return now.getFullYear() - born.getFullYear();
};

export const selectLoanMonthly = (st) => {
  if (!st) return 0;
  return calcLoanPayment(st.loanAmount || 0, st.loanRate || 0, st.loanYears || 0);
};

export const selectChildBirthAge = (st, child) => {
  if (!st || !child) return 30;
  const currentAge = selectCurrentAge(st);
  return currentAge + (child.birthYear || 0);
};
