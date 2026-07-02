import incomeTax from "../data/tax/2026/incomeTax.json";

export function calcIncomeTax(){
}
// engine/TaxEngine.js
export const calcSingleIncomeTax = (income, type) => {
  // 給与所得控除
  let kyuyoDeduction = 0;
  if (type === "employee" || type === "part" || type === "executive") {
    if (income <= 1_625_000)      kyuyoDeduction = 550_000;
    else if (income <= 1_800_000) kyuyoDeduction = income * 0.4 - 100_000;
    else if (income <= 3_600_000) kyuyoDeduction = income * 0.3 + 80_000;
    else if (income <= 6_600_000) kyuyoDeduction = income * 0.2 + 440_000;
    else if (income <= 8_500_000) kyuyoDeduction = income * 0.1 + 1_100_000;
    else                          kyuyoDeduction = 1_950_000;
    if (type === "executive" && income > 16_000_000) kyuyoDeduction = Math.min(kyuyoDeduction, 1_600_000);
  }

  // 事業所得控除（青色申告特別控除65万）
  let jigyoDeduction = 0;
  if (type === "sole") jigyoDeduction = 650_000;

  const netIncome = Math.max(0, income - kyuyoDeduction - jigyoDeduction);
  return { kyuyoDeduction, jigyoDeduction, netIncome };
};

export const calcTaxFull = (
  incomes,
  dependents,
  spouseIncome,
  includeSpouse,
  customSocialIns,
  lifestageIdx
) => {
  // 複数収入の合算
  let totalGross = 0;
  let totalNet = 0;

  const processedIncomes = incomes.map(inc => {
    const { kyuyoDeduction, jigyoDeduction, netIncome } = calcSingleIncomeTax(inc.amount, inc.type);
    totalGross += inc.amount;
    totalNet += netIncome;
    return { ...inc, kyuyoDeduction, jigyoDeduction, netIncome };
  });

  if (includeSpouse && spouseIncome > 0) {
    const { netIncome: sNet } = calcSingleIncomeTax(spouseIncome, "employee");
    totalNet += sNet;
    totalGross += spouseIncome;
  }

  // 基礎控除（合計所得が2400万以下は48万）
  let basicDeduction = 0;
  if (totalNet <= 24_000_000)      basicDeduction = 480_000;
  else if (totalNet <= 24_500_000) basicDeduction = 320_000;
  else if (totalNet <= 25_000_000) basicDeduction = 160_000;

  // 扶養控除（一般扶養38万、特定扶養63万）
  const dependDeduction = dependents * 380_000;

  // 社会保険料
  const socialIns = customSocialIns > 0 ? customSocialIns : Math.round(totalGross * 0.145);

  const taxable = Math.max(0, totalNet - basicDeduction - dependDeduction - socialIns);

  // 所得税の累進課税（令和6年度税制）
  let incomeTax = 0;
  const brackets = [
    [1_950_000,  0.05, 0],
    [3_300_000,  0.10, 97_500],
    [6_950_000,  0.20, 427_500],
    [9_000_000,  0.23, 636_000],
    [18_000_000, 0.33, 1_536_000],
    [40_000_000, 0.40, 2_796_000],
    [Infinity,   0.45, 4_796_000],
  ];
  for (const [limit, rate, deduct] of brackets) {
    if (taxable <= (brackets[brackets.indexOf([limit,rate,deduct]) - 1]?.[0] || 0)) continue;
    if (taxable <= limit) {
      incomeTax = taxable * rate - deduct;
      break;
    }
  }
  // 簡略計算（ステップごとに計算）
  incomeTax = 0;
  let prev = 0;
  const steps = [[1_950_000,0.05],[3_300_000,0.10],[6_950_000,0.20],[9_000_000,0.23],[18_000_000,0.33],[40_000_000,0.40],[Infinity,0.45]];
  for (const [limit, rate] of steps) {
    if (taxable <= prev) break;
    incomeTax += (Math.min(taxable, limit) - prev) * rate;
    prev = limit;
  }
  incomeTax = Math.round(incomeTax * 1.021); // 復興特別所得税

  const residentTax = Math.round(taxable * 0.10 + 5_000);
  const totalTax = incomeTax + residentTax;
  const takehome = Math.round(totalGross - totalTax - socialIns);
  const effectiveRate = totalGross > 0 ? ((totalTax / totalGross) * 100).toFixed(1) : "0.0";

  return {
    processedIncomes, totalGross, totalNet, taxable,
    basicDeduction, dependDeduction, socialIns,
    incomeTax, residentTax, totalTax,
    takehome, effectiveRate
  };
};
