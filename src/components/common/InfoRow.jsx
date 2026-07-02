export const InfoRow = ({ label, value, color }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "0.5px solid var(--border)" }}>
    <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{label}</span>
    <span style={{ fontSize: 13, fontWeight: 500, color: color || "var(--text-primary)" }}>{value}</span>
  </div>
);