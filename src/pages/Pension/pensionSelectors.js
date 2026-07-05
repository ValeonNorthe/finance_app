import { calcPensionFactor } from "../../engine/PensionEngine";

// 年金の合計月額を計算（受給開始年齢に応じた増減額を公的年金に適用）
export const selectTotalMonthlyPension = (records, pensionStartAge) => {
  if (!records || !Array.isArray(records)) return 0;
  const factor = calcPensionFactor(pensionStartAge || 65);
  return records.reduce((sum, r) => {
    const isPublic = ["kiso", "kosei"].includes(r.type);
    const amount = (r.monthlyAmount || 0) * (isPublic ? factor : 1.0);
    return sum + amount;
  }, 0);
};
