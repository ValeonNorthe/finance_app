/**
 * 基本的な千の位区切りのフォーマット (端数は四捨五入)
 * @param {number} n - 数値
 * @returns {string} カンマ区切りの文字列
 */
export const fmt = (n) => {
  if (n === undefined || n === null || isNaN(n)) return "0";
  return Math.round(n).toLocaleString("ja-JP");
};

/**
 * 金額をスマートにフォーマットする (兆・億・万・円の動的切り替え)
 * @param {number} n - 金額(円)
 * @param {boolean} includeYen - 末尾に「円」を付与するかどうか (デフォルト: true)
 * @returns {string} フォーマットされた文字列
 */
export const fmtSmart = (n, includeYen = true) => {
  if (n === undefined || n === null || isNaN(n)) return "0円";
  
  const v = Math.abs(n);
  const sign = n < 0 ? "−" : "";
  const suffix = includeYen ? "円" : "";

  // 1兆円以上: 不要な小数点末尾の0は自動カット (例: 1.20兆 -> 1.2兆, 1.00兆 -> 1兆)
  if (v >= 1_000_000_000_000) {
    const value = Number((v / 1_000_000_000_000).toFixed(2));
    return `${sign}${value}兆${suffix}`;
  }
  
  // 1億円以上: (例: 1.5億、2億)
  if (v >= 100_000_000) {
    const value = Number((v / 100_000_000).toFixed(1));
    return `${sign}${value}億${suffix}`;
  }
  
  // 1万円以上:
  if (v >= 10_000) {
    const value = Number((v / 10_000).toFixed(0));
    return `${sign}${value}万${suffix}`;
  }
  
  // 1万円未満:
  return `${sign}${fmt(v)}${suffix}`;
};

/**
 * グラフのY軸・ツールチップ用の動的フォーマッタ (Recharts等向け)
 * @param {number} v - 軸の値
 * @returns {string} 億・万単位の文字列
 */
export const fmtAxis = (v) => {
  if (v === undefined || v === null || isNaN(v)) return "0";
  const abs = Math.abs(v);
  const sign = v < 0 ? "−" : "";

  if (abs >= 1_000_000_000_000) {
    return `${sign}${Number((abs / 1_000_000_000_000).toFixed(1))}兆`;
  }
  if (abs >= 100_000_000) {
    return `${sign}${Number((abs / 100_000_000).toFixed(1))}億`;
  }
  if (abs >= 10_000) {
    return `${sign}${Number((abs / 10_000).toFixed(0))}万`;
  }
  return `${sign}${abs}`;
};

/**
 * 生年月日とシミュレーション対象年(西暦)から、その年の満年齢を計算してフォーマットする
 * @param {string|Date} birthDate - 生年月日
 * @param {number} targetYear - シミュレーション対象の西暦 (例: 2030)
 * @returns {string|null} 「〇〇歳」の文字列
 */
export const fmtAge = (birthDate, targetYear) => {
  if (!birthDate) return null;
  const born = new Date(birthDate);
  if (isNaN(born.getTime())) return null;

  // 対象年の誕生日時点での年齢を正確に計算
  const age = targetYear - born.getFullYear();
  return `${age}歳`;
};