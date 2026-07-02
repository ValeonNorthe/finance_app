import { createSlice } from '@reduxjs/toolkit';
import { makeDefault } from '../models/defaultState';

const initialState = typeof makeDefault === 'function' ? makeDefault() : makeDefault;

export const settingSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // 既存の set(prev => ({...prev, ...updater})) と同じ動きをする汎用更新アクション
    updateSettings: (state, action) => {
      const payload = action.payload;
      // オブジェクトが渡された場合は、既存のstateにマージする
      Object.assign(state, payload);
    },
    // 将来的には、特定のアクション（例：addIncome, removeAccountなど）をここに追加していきます
  }
});

export const { updateSettings } = settingSlice.actions;
export default settingSlice.reducer;