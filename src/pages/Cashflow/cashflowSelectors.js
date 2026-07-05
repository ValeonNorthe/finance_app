import { calcTaxFull } from "../../engine/TaxEngine";
import { SERIES_COLORS } from "../../constants/appData";

export const selectCashflowSummary = (st) => {
  if (!st) {
    return {
      monthlyTH: 0,
      monthlyFixed: 0,
      monthlyVar: 0,
      monthlyVarExcludingHealth: 0,
      monthlyMedical: 0,
      totalMedicalMonthly: 0,
      annualMedical: 0,
      totalExp: 0,
      surplus: 0,
      creditBack: 0,
      pointBack: 0,
      annualBack: 0,
      fixedLabels: {},
      varLabels: {},
      medLabels: {}
    };
  }

  const taxResult = calcTaxFull(
    st.incomes || [],
    st.dependents || 0,
    st.spouseIncome || 0,
    st.includeSpouse || false,
    st.socialInsurance || 0,
    0
  );

  const monthlyTH = (taxResult.takehome || 0) / 12;

  const monthlyFixed = Object.values(st.monthlyFixed || {}).reduce((a, b) => a + (b || 0), 0);
  const monthlyVar = Object.values(st.monthlyVariable || {}).reduce((a, b) => a + (b || 0), 0);
  const annualMedical = Object.values(st.medical || {}).reduce((a, b) => a + (b || 0), 0);
  const monthlyMedical = annualMedical / 12;

  // Link medical expenses with health/medical variable expense
  // Medical section (annual/12) should be the source of truth for health variable expense
  const totalMedicalMonthly = monthlyMedical;

  // Calculate total expenses excluding health from variable (since it's now in medical)
  const monthlyVarExcludingHealth = Object.keys(st.monthlyVariable || {})
    .filter(key => key !== "health")
    .reduce((a, key) => a + (st.monthlyVariable[key] || 0), 0);

  const totalExp = monthlyFixed + monthlyVarExcludingHealth + totalMedicalMonthly;
  const surplus = monthlyTH - totalExp - (st.monthlyInvest || 0);

  const creditBack = totalExp * (st.creditCardRate || 0) / 100;
  const pointBack = totalExp * (st.pointRate || 0) / 100;
  const annualBack = (creditBack + pointBack) * 12;

  const fixedLabels = {
    rent: "家賃・住居費",
    utility: "光熱費",
    telecom: "通信費",
    insurance: "保険料",
    subscriptions: "サブスク",
    other: "その他固定費"
  };

  const varLabels = {
    food: "食費",
    transport: "交通費",
    entertainment: "娯楽・外食",
    clothing: "衣類・美容",
    health: "健康・医療（変動）",
    misc: "雑費"
  };

  const medLabels = {
    regular: "定期受診",
    emergency: "急病・急診",
    checkup: "健康診断・人間ドック",
    dental: "歯科"
  };

  return {
    monthlyTH,
    monthlyFixed,
    monthlyVar,
    monthlyVarExcludingHealth,
    monthlyMedical,
    totalMedicalMonthly,
    annualMedical,
    totalExp,
    surplus,
    creditBack,
    pointBack,
    annualBack,
    fixedLabels,
    varLabels,
    medLabels
  };
};

export const selectExpensePieData = (st) => {
  if (!st) return [];

  const fixedLabels = {
    rent: "家賃・住居費",
    utility: "光熱費",
    telecom: "通信費",
    insurance: "保険料",
    subscriptions: "サブスク",
    other: "その他固定費"
  };

  const varLabels = {
    food: "食費",
    transport: "交通費",
    entertainment: "娯楽・外食",
    clothing: "衣類・美容",
    health: "健康・医療（変動）",
    misc: "雑費"
  };

  return [
    ...Object.entries(st.monthlyFixed || {}).map(([k, v]) => ({
      name: fixedLabels[k],
      value: v || 0,
      color: SERIES_COLORS[0]
    })),
    ...Object.entries(st.monthlyVariable || {}).map(([k, v]) => ({
      name: varLabels[k],
      value: v || 0,
      color: SERIES_COLORS[1]
    }))
  ].filter(d => d.value > 0);
};
