import { STORAGE_KEY } from "../Save/saveSelectors";

export const persistSaves = async (setSaves, newSaves, setMsg) => {
  try {
    await window.storage.set(STORAGE_KEY, JSON.stringify(newSaves));
    setSaves(newSaves);
  } catch {
    setMsg("保存に失敗しました");
  }
};

export const saveProfileAction = async (saves, name, st, setSaves, setMsg, setNewName) => {
  if (!name.trim()) return;
  const key = `profile_${Date.now()}`;

  const newSaves = {
    ...saves,
    [key]: {
      name: name.trim(),
      data: st,
      savedAt: new Date().toLocaleString("ja-JP"),
    },
  };

  await persistSaves(setSaves, newSaves, setMsg);
  setNewName("");
  setMsg(`「${name}」を保存しました`);
};

export const loadProfileAction = (key, saves, set, setMsg) => {
  set(saves[key].data);
  setMsg(`「${saves[key].name}」を読み込みました`);
};

export const deleteProfileAction = async (key, saves, setSaves, setMsg) => {
  const ns = { ...saves };
  delete ns[key];
  await persistSaves(setSaves, ns, setMsg);
};

export const renameProfileAction = async (key, newName, saves, setSaves, setMsg, setEditingKey, setEditName) => {
  if (!newName.trim()) return;

  const ns = {
    ...saves,
    [key]: { ...saves[key], name: newName.trim() },
  };

  await persistSaves(setSaves, ns, setMsg);
  setEditingKey(null);
  setEditName("");
};
