export const updateAssetField = (set, index, key, val) => {
  set(prev => ({
    ...prev,
    assets: prev.assets.map((a, i) =>
      i === index ? { ...a, [key]: val } : a
    )
  }));
};

export const updateCashCurrency = (set, index, key, val) => {
  set(prev => ({
    ...prev,
    cashCurrencies: prev.cashCurrencies.map((c, i) =>
      i === index ? { ...c, [key]: val } : c
    )
  }));
};
