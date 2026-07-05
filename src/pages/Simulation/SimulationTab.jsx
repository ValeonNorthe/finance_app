import { useSelector, useDispatch } from "react-redux";
import {
  selectSimulationData,
  selectGoalAchievementAge,
  selectFinalNominal,
  selectPortfolioStats,
  selectSimulationMeta,
} from "../../store/simulationSelectors";
import { setHorizon } from "../../store/simulationSlice";

import { updateSimulationField } from "../Simulation/simulationActions";

import { ScenarioSummary } from "../Simulation/simulationComponents";

import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine, Legend, ComposedChart, Bar, Line } from "recharts";
import { CustomTooltip } from "../../components/common/CustomTooltip";
import { Card } from "../../components/common/Card.jsx";
import { Metric } from "../../components/common/Metric.jsx";
import { Sl } from "../../components/common/Slider.jsx";
import { NumInput } from "../../components/common/NumberInput.jsx";
import { fmt, fmtSmart, fmtAxis } from "../../utils/format";
import { INCOME_TYPES } from "../../constants/appData"; 

export const SimulationTab = ({ st, set }) => {
  const dispatch = useDispatch();
  const { horizon = "goal" } = useSelector(selectSimulationMeta) || {};
  const simData = useSelector(selectSimulationData) || [];
  const goalAge = useSelector(selectGoalAchievementAge);
  const finalNominal = useSelector(selectFinalNominal) || 0;
  const { returnRate = 0, riskRate = 0 } = useSelector(selectPortfolioStats) || {};

  const u = (key, value) => updateSimulationField(set, key, value);

  const lastData = simData.at(-1);
  const optimisticFinal = lastData?.optimistic ?? 0;
  const pessimisticFinal = lastData?.pessimistic ?? 0;

  const chartData = simData
    .filter((_, i) => i % Math.max(1, Math.floor(st.goalYears / 12)) === 0 || i === simData.length - 1)
    .map((d) => ({
      label: `${d.age}歳`,
      楽観: Math.round(d.optimistic),
      予測: Math.round(d.nominal),
      悲観: Math.round(d.pessimistic),
      実質: Math.round(d.real),
    }));

  const cfChartData = simData
    .filter((_, i) => i % Math.max(1, Math.floor(st.goalYears / 12)) === 0)
    .map((d) => ({
      label: `${d.age}歳`,
      キャッシュフロー: Math.round(d.cashflow),
      イベント費用: -Math.round(d.eventCost),
    }));

  return (
    <div>
      {/* KPI */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 10,
          marginBottom: 14,
        }}
      >
        <Metric
          label="目標達成予測"
          value={goalAge ? `${goalAge}歳` : "未達成"}
          color={goalAge ? "var(--text-success)" : "var(--text-warning)"}
          icon="ti-target"
        />
        <Metric
          label="最終資産（名目）"
          value={fmtSmart(finalNominal) + "円"}
          color={
            finalNominal >= st.goalAmount
              ? "var(--text-success)"
              : "var(--text-danger)"
          }
          icon="ti-chart-line"
        />
        <Metric
          label="インフレ調整後（実質）"
          value={fmtSmart(simData[simData.length - 1]?.real || 0) + "円"}
          icon="ti-building-bank"
        />
      </div>

      {/* 設定 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 14,
        }}
      >
        <Card>
          <NumInput
            label="目標金額"
            value={st.goalAmount}
            suffix="円"
            step={1_000_000}
            onChange={(v) => u("goalAmount", v)}
          />

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
              期間指定方法
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <button
                type="button"
                className={`tab-button ${!st.simulationEndType || st.simulationEndType === "years" ? "active" : ""}`}
                style={{ flex: 1, padding: "6px 12px", fontSize: 12 }}
                onClick={() => u("simulationEndType", "years")}
              >
                年数で指定
              </button>
              <button
                type="button"
                className={`tab-button ${st.simulationEndType === "date" ? "active" : ""}`}
                style={{ flex: 1, padding: "6px 12px", fontSize: 12 }}
                onClick={() => {
                  u("simulationEndType", "date");
                  if (!st.simulationEndDate) {
                    const d = new Date();
                    d.setFullYear(d.getFullYear() + 30);
                    u("simulationEndDate", d.toISOString().split('T')[0]);
                  }
                }}
              >
                日付で指定
              </button>
            </div>

            {(!st.simulationEndType || st.simulationEndType === "years") ? (
              <Sl
                label="シミュレーション期間"
                min={5}
                max={60}
                value={st.goalYears}
                onChange={(v) => u("goalYears", v)}
                unit="年"
              />
            ) : (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>
                  終了日付
                </div>
                <input
                  type="date"
                  value={st.simulationEndDate || ""}
                  onChange={(e) => {
                    const dateVal = e.target.value;
                    u("simulationEndDate", dateVal);
                    if (dateVal) {
                      const curYear = new Date().getFullYear();
                      const targetYear = new Date(dateVal).getFullYear();
                      const diff = Math.max(5, Math.min(60, targetYear - curYear));
                      u("goalYears", diff);
                    }
                  }}
                  style={{ width: "100%", height: 38 }}
                />
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                  → 現在から約 {st.goalYears} 年間のシミュレーションになります
                </div>
              </div>
            )}
          </div>

          <Sl
            label="インフレ率"
            min={0}
            max={10}
            step={0.1}
            value={st.inflationRate}
            onChange={(v) => u("inflationRate", v)}
            unit="%"
          />
          <Sl
            label="インフレ変化リスク"
            min={0}
            max={5}
            step={0.1}
            value={st.inflationRiskRate}
            onChange={(v) => u("inflationRiskRate", v)}
            unit="%"
          />

          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
              シナリオ信頼度（σレベル）
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {[1, 2, 3].map(s => (
                <button
                  key={s}
                  type="button"
                  className={`tab-button ${ (st.sigmaLevel || 1) === s ? "active" : ""}`}
                  style={{ flex: 1, padding: "6px 12px", fontSize: 12 }}
                  onClick={() => u("sigmaLevel", s)}
                >
                  ±{s}σ ({(s === 1 ? 68.2 : s === 2 ? 95.4 : 99.7)}%)
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 10 }}>
            シミュレーション期間モード
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button
              type="button"
              className={`tab-button ${horizon === "goal" ? "active" : ""}`}
              style={{ flex: 1 }}
              onClick={() => dispatch(setHorizon("goal"))}
            >
              目標年数まで
            </button>
            <button
              type="button"
              className={`tab-button ${horizon === "life" ? "active" : ""}`}
              style={{ flex: 1 }}
              onClick={() => dispatch(setHorizon("life"))}
            >
              100歳まで
            </button>
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "var(--text-secondary)",
              marginBottom: 10,
            }}
          >
            シナリオ比較（最終年）
          </div>

          <ScenarioSummary 
            finalNominal={finalNominal} 
            optimistic={optimisticFinal} 
            pessimistic={pessimisticFinal} 
            sigmaLevel={st.sigmaLevel || 1}
            riskRate={riskRate} 
          />
        </Card>
      </div>

      {/* 資産推移チャート */}
      <Card title="資産推移シミュレーション（3シナリオ）" style={{ marginBottom: 14 }}>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis dataKey="label" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 9 }} tickFormatter={fmtAxis} width={56} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={st.goalAmount}
              stroke="#c98500"
              strokeDasharray="6 3"
              label={{ value: "目標", fontSize: 10, fill: "#c98500" }}
            />
            <Area type="monotone" dataKey="楽観" stroke="#1baf7a" fill="#1baf7a" fillOpacity={0.08} />
            <Area type="monotone" dataKey="予測" stroke="#2a78d6" fill="#2a78d6" fillOpacity={0.12} />
            <Area type="monotone" dataKey="悲観" stroke="#e34948" fill="#e34948" fillOpacity={0.06} />
            <Line type="monotone" dataKey="実質" stroke="#898781" strokeWidth={1} dot={false} />
            <Legend />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* キャッシュフロー */}
      <Card title="キャッシュフロー・イベント費用" style={{ marginBottom: 14 }}>
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={cfChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis dataKey="label" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 9 }} tickFormatter={fmtAxis} width={56} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="キャッシュフロー" fill="#2a78d6" radius={[2, 2, 0, 0]} />
            <Bar dataKey="イベント費用" fill="#e34948" radius={[2, 2, 0, 0]} />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      {/* テーブル */}
      <Card title="年次詳細テーブル">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ borderBottom: "0.5px solid var(--border-strong)" }}>
                {["年後", "年齢", "資産（名目）", "資産（実質）", "楽観", "悲観", "キャッシュフロー", "イベント費用"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "6px 8px",
                      textAlign: "right",
                      color: "var(--text-muted)",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      fontSize: 10,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {simData
                .filter((_, i) => i % 5 === 0 || i === simData.length - 1)
                .map((d, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom: "0.5px solid var(--border)",
                      background:
                        d.nominal >= st.goalAmount ? "var(--bg-success)" : "transparent",
                    }}
                  >
                    <td style={{ padding: "4px 8px", color: "var(--text-secondary)" }}>
                      {d.year}年
                    </td>
                    <td style={{ padding: "4px 8px", textAlign: "right", fontWeight: 500 }}>
                      {d.age}歳
                    </td>
                    <td
                      style={{
                        padding: "4px 8px",
                        textAlign: "right",
                        color:
                          d.nominal >= st.goalAmount
                            ? "var(--text-success)"
                            : "var(--text-primary)",
                        fontWeight: d.nominal >= st.goalAmount ? 500 : 400,
                      }}
                    >
                      {fmtSmart(d.nominal)}
                    </td>
                    <td style={{ padding: "4px 8px", textAlign: "right", color: "var(--text-secondary)" }}>
                      {fmtSmart(d.real)}
                    </td>
                    <td style={{ padding: "4px 8px", textAlign: "right", color: "var(--text-success)" }}>
                      {fmtSmart(d.optimistic)}
                    </td>
                    <td style={{ padding: "4px 8px", textAlign: "right", color: "var(--text-danger)" }}>
                      {fmtSmart(d.pessimistic)}
                    </td>
                    <td
                      style={{
                        padding: "4px 8px",
                        textAlign: "right",
                        color: d.cashflow > 0 ? "var(--text-success)" : "var(--text-danger)",
                      }}
                    >
                      {fmtSmart(d.cashflow)}
                    </td>
                    <td style={{ padding: "4px 8px", textAlign: "right", color: "var(--text-warning)" }}>
                      {d.eventCost > 0 ? fmtSmart(d.eventCost) : "−"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
