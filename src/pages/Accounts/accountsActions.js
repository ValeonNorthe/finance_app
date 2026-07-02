export const addAccount = (set) => {
  const id = `acc_${Date.now()}`;
  set(p => ({
    ...p,
    accounts: [
      ...p.accounts,
      { id, type: "living", label: "新規口座", balance: 0, monthly: 0 }
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
