export const NumInput = ({ label, value, onChange, prefix, suffix, step, min, max, style, disabled }) => (
  <div style={{ marginBottom: 10, ...style }}>
    {label && <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>{label}</div>}
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {prefix && <span style={{ fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{prefix}</span>}
      <input 
        type="number" 
        value={value} 
        step={step || 1} 
        min={min} 
        max={max}
        disabled={disabled}
        onChange={e => onChange(Number(e.target.value))}
        onFocus={e => e.target.select()}
        style={{ flex: 1, minWidth: 0, opacity: disabled ? 0.6 : 1 }} 
      />
      {suffix && <span style={{ fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{suffix}</span>}
    </div>
  </div>
);