export const updateFixedExpense = (set, key, val) => {
  set(p => ({
    ...p,
    monthlyFixed: { ...p.monthlyFixed, [key]: val }
  }));
};

export const updateVariableExpense = (set, key, val) => {
  set(p => ({
    ...p,
    monthlyVariable: { ...p.monthlyVariable, [key]: val }
  }));
};

export const updateMedicalExpense = (set, key, val) => {
  set(p => ({
    ...p,
    medical: { ...p.medical, [key]: val }
  }));
};
