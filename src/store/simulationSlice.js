import { createSlice } from "@reduxjs/toolkit";

/**
 * シミュレーション表示設定（入力データ settings とは分離）
 * - goal: 目標年数（goalYears）まで
 * - life: 100歳まで（人生設計モード）
 */
const simulationSlice = createSlice({
  name: "simulation",
  initialState: {
    horizon: "goal",
  },
  reducers: {
    setHorizon: (state, action) => {
      state.horizon = action.payload;
    },
  },
});

export const { setHorizon } = simulationSlice.actions;
export default simulationSlice.reducer;
