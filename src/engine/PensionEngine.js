/**
 * 公的年金の受給開始年齢に応じた増減倍率を計算します。
 * 65歳を基準とし、繰り上げ（60〜64歳）は月-0.4%、繰り下げ（66〜75歳）は月+0.7%です。
 * 
 * @param {number} startAge 受給開始年齢（60〜75）
 * @returns {number} 増減倍率（0.76〜1.84）
 */
export const calcPensionFactor = (startAge) => {
  const diffMonths = (startAge - 65) * 12;
  if (diffMonths < 0) {
    // 繰り上げ受給: 1ヶ月あたり -0.4% (最大 60歳で -24%)
    return Math.max(0.76, 1 + diffMonths * 0.004);
  } else if (diffMonths > 0) {
    // 繰り下げ受給: 1ヶ月あたり +0.7% (最大 75歳で +84%)
    return Math.min(1.84, 1 + diffMonths * 0.007);
  }
  return 1.0;
};
