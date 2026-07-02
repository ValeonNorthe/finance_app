export const addAccount = (set) => {
  const id = `acc_${Date.now()}`;
  set(p => ({
    ...p,
    accounts: [
      ...p.accounts,
      { id, type: "living", label: "口座を追加", balance: 0, monthly: 0, startAge: 30, endAge: 65 }
    ]
  }));
};

export const updateAccountField = (set, id, key, val) => {
  set(p => ({
    ...p,
    accounts: p.accounts.map(a =>
      a.id === id ? { ...a, [key]: val } : a
    )
  }));
};

export const removeAccount = (set, id) => {
  set(p => ({
    ...p,
    accounts: p.accounts.filter(a => a.id !== id)
  }));
};
