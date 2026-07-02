import { calcLoanPayment } from "../../engine/LoanEngine";

export const selectCurrentAge = (st) => {
  if (!st.birthDate) return 30;
  const now = new Date();
  const born = new Date(st.birthDate);
  return now.getFullYear() - born.getFullYear();
};

export const selectLoanMonthly = (st) => {
  return calcLoanPayment(st.loanAmount, st.loanRate, st.loanYears);
};

export const selectChildBirthAge = (st, child) => {
  const currentAge = selectCurrentAge(st);
  return currentAge + child.birthYear;
};
