// 年金の合計月額を計算
export const selectTotalMonthlyPension = (records) =>
  records.reduce((sum, r) => sum + r.monthlyAmount, 0);
