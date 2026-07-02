import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine, Legend, ComposedChart, Bar, Line } from "recharts";
import { CustomTooltip } from "../../components/common/CustomTooltip";
import { Card } from "../../components/common/Card.jsx";
import { Metric } from "../../components/common/Metric.jsx";
import { Sl } from "../../components/common/Slider.jsx";
import { NumInput } from "../../components/common/NumberInput.jsx";
import { fmtSmart } from "../../utils/format";

export function ScenarioBox({ label, value, color }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: 12,
        marginBottom: 8,
        padding: "6px 10px",
        background: "var(--surface-1)",
        borderRadius: "var(--radius)",
      }}
    >
      <span style={{ color: "var(--text-secondary)" }}>{label}</span>
      <span style={{ color, fontWeight: 500 }}>{fmtSmart(value)}円</span>
    </div>
  );
}

export function ScenarioSummary({ finalNominal, riskRate }) {
  const optimistic = finalNominal * (1 + riskRate / 100);
  const pessimistic = finalNominal * (1 - riskRate / 100);

  return (
    <div>
      <ScenarioBox label="楽観（+1σ）" value={optimistic} color="#1baf7a" />
      <ScenarioBox label="基本予測" value={finalNominal} color="#2a78d6" />
      <ScenarioBox label="悲観（−1σ）" value={pessimistic} color="#e34948" />

      <div
        style={{
          fontSize: 11,
          color: "var(--text-muted)",
          marginTop: 8,
          borderTop: "0.5px solid var(--border)",
          paddingTop: 8,
        }}
      >
        期待リターン {riskRate.toFixed(1)}% / リスク ±{riskRate.toFixed(1)}%
      </div>
    </div>
  );
}
