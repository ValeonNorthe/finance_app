export const Sl = ({ label, min, max, step, value, onChange, unit }) => (
  <div style={{ marginBottom: 10 }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>
      <span>{label}</span>
      <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>{value}{unit || ""}</span>
    </div>
    <input type="range" min={min} max={max} step={step || 1} value={value}
      onChange={e => onChange(Number(e.target.value))} style={{ width: "100%" }} />
  </div>
);