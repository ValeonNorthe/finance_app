export const STORAGE_KEY = "finance_app_v2_saves";

export const loadSavedProfiles = async () => {
  try {
    const r = await window.storage.get(STORAGE_KEY);
    return r ? JSON.parse(r.value) : {};
  } catch {
    return {};
  }
};
