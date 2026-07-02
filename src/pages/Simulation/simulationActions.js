export const updateSimulationField = (set, key, value) => {
  set((prev) => ({ ...prev, [key]: value }));
};
