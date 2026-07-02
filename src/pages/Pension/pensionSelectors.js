import { calcPensionFactor } from "../../engine/PensionEngine";

// 年金の合計月額を計算（受給開始年齢に応じた増減額を公的年金に適用）
export const selectTotalMonthlyPension = (records, pensionStartAge) => {
  const factor = calcPensionFactor(pensionStartAge || 65);
  return records.reduce((sum, r) => {
    const isPublic = ["kiso", "kosei"].includes(r.type);
    const amount = r.monthlyAmount * (isPublic ? factor : 1.0);
    return sum + amount;
  }, 0);
};
