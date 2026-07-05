export const ASSET_TYPES = [ { key: "gold",  label: "金（ゴールド）",  color: "#c98500", defaultReturn: 5,   defaultRisk: 18 },
  { key: "bond",  label: "国債",            color: "#2a78d6", defaultReturn: 1.5, defaultRisk: 5  },
  { key: "stock", label: "個別株",          color: "#e34948", defaultReturn: 8,   defaultRisk: 25 },
  { key: "fund",  label: "投資信託",        color: "#1baf7a", defaultReturn: 6,   defaultRisk: 15 },
  { key: "cash",  label: "現金・預金",      color: "#898781", defaultReturn: 0.1, defaultRisk: 0.5 },
];
export const CURRENCIES = ["JPY","USD","EUR","GBP","CNY","AUD","CHF","HKD"];
export const EDU_PATTERNS =  [
  { 
    label: "全て公立", 
    cost: 1000,  
    desc: "幼〜大学まで公立",
    ageGroups: {
      "0-3": { monthly: 0, desc: "保育園（公立）" },
      "3-6": { monthly: 0, desc: "幼稚園（公立）" },
      "6-12": { monthly: 0, desc: "小学校（公立）" },
      "12-15": { monthly: 0, desc: "中学校（公立）" },
      "15-18": { monthly: 0, desc: "高校（公立）" },
      "18-22": { monthly: 0, desc: "大学（国公立）" }
    }
  },
  { 
    label: "私立中高・国公立大", 
    cost: 1800,  
    desc: "中高私立、大学国公立",
    ageGroups: {
      "0-3": { monthly: 0, desc: "保育園（公立）" },
      "3-6": { monthly: 0, desc: "幼稚園（公立）" },
      "6-12": { monthly: 0, desc: "小学校（公立）" },
      "12-15": { monthly: 50, desc: "中学校（私立）" },
      "15-18": { monthly: 60, desc: "高校（私立）" },
      "18-22": { monthly: 0, desc: "大学（国公立）" }
    }
  },
  { 
    label: "私立中〜大学", 
    cost: 2500,  
    desc: "中学から私立一貫",
    ageGroups: {
      "0-3": { monthly: 0, desc: "保育園（公立）" },
      "3-6": { monthly: 0, desc: "幼稚園（公立）" },
      "6-12": { monthly: 0, desc: "小学校（公立）" },
      "12-15": { monthly: 50, desc: "中学校（私立）" },
      "15-18": { monthly: 60, desc: "高校（私立）" },
      "18-22": { monthly: 80, desc: "大学（私立）" }
    }
  },
  { 
    label: "私立（理系）", 
    cost: 2800,  
    desc: "私立理系大学含む",
    ageGroups: {
      "0-3": { monthly: 0, desc: "保育園（公立）" },
      "3-6": { monthly: 0, desc: "幼稚園（公立）" },
      "6-12": { monthly: 0, desc: "小学校（公立）" },
      "12-15": { monthly: 50, desc: "中学校（私立）" },
      "15-18": { monthly: 60, desc: "高校（私立）" },
      "18-22": { monthly: 100, desc: "大学（私立理系）" }
    }
  },
  { 
    label: "私立（医歯薬）", 
    cost: 4500,  
    desc: "医学部・歯学部など",
    ageGroups: {
      "0-3": { monthly: 0, desc: "保育園（公立）" },
      "3-6": { monthly: 0, desc: "幼稚園（公立）" },
      "6-12": { monthly: 0, desc: "小学校（公立）" },
      "12-15": { monthly: 50, desc: "中学校（私立）" },
      "15-18": { monthly: 60, desc: "高校（私立）" },
      "18-22": { monthly: 200, desc: "大学（医歯薬）" }
    }
  },
  { 
    label: "海外留学含む", 
    cost: 5500,  
    desc: "海外大学・留学費用含む",
    ageGroups: {
      "0-3": { monthly: 0, desc: "保育園（公立）" },
      "3-6": { monthly: 0, desc: "幼稚園（公立）" },
      "6-12": { monthly: 0, desc: "小学校（公立）" },
      "12-15": { monthly: 50, desc: "中学校（私立）" },
      "15-18": { monthly: 60, desc: "高校（私立）" },
      "18-22": { monthly: 250, desc: "海外大学・留学" }
    }
  },
];
export const ACC_TYPES = [
  { key: "cash",       label: "現金・手元資金",            color: "#898781" },
  { key: "living",     label: "生活費用普通口座",          color: "#2a78d6" },
  { key: "emergency",  label: "生活防衛費普通口座",        color: "#1baf7a" },
  { key: "medium",     label: "中期資金用普通口座",        color: "#eda100" },
  { key: "special",    label: "特別資金用普通口座",        color: "#4a3aa7" },
  { key: "business",   label: "事業用普通口座",            color: "#e87ba4" },
  { key: "corporate",  label: "法人用当座口座",            color: "#eb6834" },
  { key: "nisa",       label: "NISA口座",                  color: "#008300" },
  { key: "specific_w", label: "特定口座（源泉徴収あり）",  color: "#e34948" },
  { key: "specific_r", label: "特定口座（確定申告）",      color: "#e66767" },
  { key: "general",    label: "一般口座（確定申告）",      color: "#898781" },
  { key: "ideco",      label: "iDeCo",                     color: "#3987e5" },
  { key: "sme",        label: "小規模企業共済口座",        color: "#c98500" },
  { key: "fixed",      label: "定期預金",                  color: "#73726c" },
];
export const PENSION_TYPES =  [
  { key: "kiso",     label: "基礎年金（国民年金）" },
  { key: "kosei",    label: "厚生年金" },
  { key: "kigyo",    label: "企業年金（DB/DC）" },
  { key: "ideco",    label: "iDeCo" },
  { key: "national", label: "国民年金基金" },
];
export const INCOME_TYPES = [
  { key: "employee",   label: "給与所得（会社員）" },
  { key: "part",       label: "給与所得（パート・アルバイト）" },
  { key: "sole",       label: "事業所得（個人事業主）" },
  { key: "executive",  label: "役員報酬（法人代表）" },
  { key: "real_estate",label: "不動産所得" },
  { key: "interest",   label: "利子所得" },
  { key: "tax",        label: "税金所得" },
  { key: "dividend",   label: "配当所得" },
  { key: "capital",    label: "譲渡所得（株・不動産）" },
  { key: "retirement",     label: "退職所得" },
  { key: "temporary",   label: "一時所得" },
  { key: "other",      label: "雑所得" },
];
export const SERIES_COLORS = [
  "#2a78d6",
  "#1baf7a",
  "#c98500",
  "#e34948",
  "#4a3aa7",
  "#e87ba4",
  "#eb6834",
  "#008300"
];