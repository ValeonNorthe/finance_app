import { configureStore } from '@reduxjs/toolkit';
import settingReducer from './settingSlice';
// uiSlice や simulationSlice も今後ここで統合します
// import uiReducer from './uiSlice';

const store = configureStore({
  reducer: {
    settings: settingReducer,
    // ui: uiReducer,
  },
  // 複雑なデータ（関数やDateオブジェクトなど）がStateに入ることへの警告を一時的にオフにする（シミュレーションアプリでよく使います）
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export default store;