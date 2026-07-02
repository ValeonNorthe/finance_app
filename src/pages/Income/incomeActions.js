export const addIncome = (set, setActiveInc) => {
  const id = `inc_${Date.now()}`;
  set(p => ({
    ...p,
    incomes: [
      ...p.incomes,
      { id, label: "収入を追加", type: "employee", amount: 3_000_000, active: true }
    ]
  }));
  setActiveInc(id);
};

export const updateIncome = (set, id, key, val) => {
  set(p => ({
    ...p,
    incomes: p.incomes.map(i =>
      i.id === id ? { ...i, [key]: val } : i
    )
  }));
};

export const removeIncome = (set, id) => {
  set(p => ({
    ...p,
    incomes: p.incomes.filter(i => i.id !== id)
  }));
};
