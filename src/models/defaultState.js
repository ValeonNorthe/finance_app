import { ASSET_TYPES, EDU_PATTERNS } from "../constants/appData.js";

export const makeDefault = () => ({
  birthDate: "2004-10-31",
  name: "",
  goalAmount: 150_000_000,
  goalYears: 30,
  inflationRate: 2.5,
  inflationRiskRate: 1.0,

  incomes: [
    { id: "inc1", label: "本業（会社員）", type: "employee", amount: 6_000_000, active: true, startAge: 30, endAge: 65 },
  ],
  socialInsurance: 0,
  dependents: 0,
  spouseIncome: 0,
  includeSpouse: false,

  lifestages: [
    {
      id: "ls1", label: "現在〜35歳", fromYear: 0, toYear: 5,
      incomes: null, monthlyInvest: 50_000, socialInsurance: 0
    },
  ],

  monthlyFixed: {
    rent: 80_000, utility: 15_000, telecom: 6_000,
    insurance: 10_000, subscriptions: 3_000, other: 20_000,
  },
  monthlyVariable: {
    food: 50_000, transport: 15_000, entertainment: 25_000,
    clothing: 10_000, health: 8_000, misc: 15_000,
  },

  medical: { regular: 12_000, emergency: 20_000, checkup: 8_000, dental: 15_000 },

  monthlyInvest: 50_000,
  investTiming: "monthly",
  bonusInvest: 200_000,
  creditCardRate: 1.0,
  pointRate: 0.5,
  creditMonthDelay: 1,

  assets: ASSET_TYPES.map(a => ({
    key: a.key,
    ratio: a.key === "fund" ? 40 : a.key === "stock" ? 30 : a.key === "bond" ? 15 : a.key === "cash" ? 10 : 5,
    currentAmount: a.key === "fund" ? 2_000_000 : a.key === "stock" ? 1_000_000 : a.key === "bond" ? 500_000 : a.key === "cash" ? 800_000 : 200_000,
    expectedReturn: a.defaultReturn,
    riskRate: a.defaultRisk,
    dividendRate: a.key === "stock" ? 2.5 : 0,
    dividendRisk: a.key === "stock" ? 15 : 0,
  })),

  cashCurrencies: [
    { currency: "JPY", ratio: 45 },
    { currency: "USD", ratio: 45 },
    { currency: "EUR", ratio: 10 },
  ],

  accounts: [
    { id: "acc1", type: "nisa",     label: "NISA口座",     balance: 500_000, monthly: 33_333, startAge: 30, endAge: 65, maxBalance: null },
    { id: "acc2", type: "ideco",    label: "iDeCo",        balance: 200_000, monthly: 23_000, startAge: 30, endAge: 65, maxBalance: null },
    { id: "acc3", type: "living",   label: "生活費用口座", balance: 1_000_000, monthly: 0, startAge: 30, endAge: 100, maxBalance: null },
    { id: "acc4", type: "emergency",label: "生活防衛費",   balance: 3_000_000, monthly: 0, startAge: 30, endAge: 100, maxBalance: null },
  ],

  married: false,
  marriageYear: 3,
  marriageCost: 3_000_000,
  partnerName: "",
  partnerBirthDate: "",
  spouseIncomeDelta: 0,

  children: [],

  housing: "rent",
  loanAmount: 40_000_000,
  loanRate: 1.5,
  loanYears: 35,
  housingYear: 5,

  pensionStartAge: 65,
  pensionRecords: [
    { id: "p1", type: "kiso",  label: "基礎年金", startAge: 65, endAge: 90, monthlyAmount: 66_250, payYears: "20〜64歳" },
    { id: "p2", type: "kosei", label: "厚生年金", startAge: 65, endAge: 90, monthlyAmount: 120_000, payYears: "22〜60歳" },
  ],
  sigmaLevel: 1,
  simulationEndType: "years",
  simulationEndDate: "",
});
