export const SegBtn = ({ options, value, onChange }) => (
  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
    {options.map(([val, lbl]) => (
      <button key={val} onClick={() => onChange(val)}
        style={{
          padding: "6px 12px", borderRadius: "var(--radius)", fontSize: 12, cursor: "pointer",
          border: value === val ? "1.5px solid var(--border-accent)" : "0.5px solid var(--border-strong)",
          background: value === val ? "var(--bg-accent)" : "transparent",
          color: value === val ? "var(--text-accent)" : "var(--text-secondary)",
          fontWeight: value === val ? 500 : 400,
          transition: "all 0.15s",
        }}>{lbl}</button>
    ))}
  </div>
);