import { calcTaxFull } from "../../engine/TaxEngine";

export const selectTaxResult = (st) => {
  if (!st) {
    return {
      takehome: 0,
      effectiveRate: "0.0",
      totalGross: 0,
      totalTax: 0
    };
  }
  return calcTaxFull(
    st.incomes || [],
    st.dependents || 0,
    st.spouseIncome || 0,
    st.includeSpouse || false,
    st.socialInsurance || 0,
    0
  );
};

export const selectIncomeSummary = (st) => {
  if (!st || !st.incomes || !Array.isArray(st.incomes)) {
    return { totalGross: 0 };
  }
  const totalGross = st.incomes.reduce((a, b) => a + (b.active !== false ? (b.amount || 0) : 0), 0);
  return { totalGross };
};
