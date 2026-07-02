import { calcTaxFull } from "../../engine/TaxEngine";

export const selectTaxResult = (st) => {
  return calcTaxFull(
    st.incomes,
    st.dependents,
    st.spouseIncome,
    st.includeSpouse,
    st.socialInsurance,
    0
  );
};

export const selectIncomeSummary = (st) => {
  const totalGross = st.incomes.reduce((a, b) => a + (b.active ? b.amount : 0), 0);
  return { totalGross };
};
