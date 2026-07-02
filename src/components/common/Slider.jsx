export const Sl = ({ label, min, max, step, value, onChange, unit }) => (
  <div style={{ marginBottom: 10 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>
      <span>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step || 1}
          onChange={e => onChange(Number(e.target.value))}
          onFocus={e => e.target.select()}
          style={{
            width: 60,
            height: 22,
            padding: "0 4px",
            fontSize: 12,
            textAlign: "right",
            borderRadius: 4,
            border: "1px solid var(--border)",
            outline: "none"
          }}
        />
        <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>{unit || ""}</span>
      </div>
    </div>
    <input type="range" min={min} max={max} step={step || 1} value={value}
      onChange={e => onChange(Number(e.target.value))} style={{ width: "100%" }} />
  </div>
);