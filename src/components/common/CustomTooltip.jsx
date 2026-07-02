// カスタムツールチップ
import { fmtAxis } from "../../utils/format";
export const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--surface-2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "10px 14px", fontSize: 12 }}>
      <div style={{ fontWeight: 500, marginBottom: 6, color: "var(--text-primary)" }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 2 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color, display: "inline-block" }} />
          <span style={{ color: "var(--text-secondary)" }}>{p.name}:</span>
          <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{fmtAxis(p.value)}</span>
        </div>
      ))}
    </div>
  );
};