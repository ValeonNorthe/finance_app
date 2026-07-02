export const Metric = ({ label, value, sub, color, icon }) => (
  <div style={{ background: "var(--surface-1)", borderRadius: "var(--radius)", padding: "12px 14px" }}>
    <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
      {icon && <i className={`ti ${icon}`} aria-hidden="true" />}
      {label}
    </div>
    <div style={{ fontSize: 20, fontWeight: 500, color: color || "var(--text-primary)", lineHeight: 1.2 }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>{sub}</div>}
  </div>
);