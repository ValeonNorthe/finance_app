import { configureStore } from '@reduxjs/toolkit';
import settingReducer from './settingSlice';
import simulationReducer from './simulationSlice';

const store = configureStore({
  reducer: {
    settings: settingReducer,
    simulation: simulationReducer,
  },
  // 複雑なデータ（関数やDateオブジェクトなど）がStateに入ることへの警告を一時的にオフにする（シミュレーションアプリでよく使います）
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export default store;