export const addPensionRecord = (set) => {
  const id = `p_${Date.now()}`;
  set((prev) => ({
    ...prev,
    pensionRecords: [
      ...prev.pensionRecords,
      {
        id,
        type: "kiso",
        label: "年金を追加",
        startAge: 65,
        endAge: 90,
        monthlyAmount: 50_000,
        payYears: "",
      },
    ],
  }));
  return id;
};

export const updatePensionRecord = (set, id, key, value) => {
  set((prev) => ({
    ...prev,
    pensionRecords: prev.pensionRecords.map((r) =>
      r.id === id ? { ...r, [key]: value } : r
    ),
  }));
};

export const removePensionRecord = (set, id) => {
  set((prev) => ({
    ...prev,
    pensionRecords: prev.pensionRecords.filter((r) => r.id !== id),
  }));
};
