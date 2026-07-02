import { NumInput } from "../../components/common/NumberInput.jsx";
import { INCOME_TYPES } from "../../constants/appData";
import { fmtSmart } from "../../utils/format";

export function IncomeEditor({ inc, active, onToggle, onUpdate, onRemove }) {
  return (
    <div
      onClick={onToggle}
      style={{
        marginBottom: 8,
        borderRadius: "var(--radius)",
        border: active ? "1.5px solid var(--border-accent)" : "0.5px solid var(--border)",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.15s"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 12px",
          background: active ? "var(--bg-accent)" : "var(--surface-1)"
        }}
      >
        <input
          type="checkbox"
          checked={inc.active}
          onClick={e => e.stopPropagation()}
          onChange={e => {
            e.stopPropagation();
            onUpdate("active", e.target.checked);
          }}
        />

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{inc.label}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
            {INCOME_TYPES.find(t => t.key === inc.type)?.label} / {fmtSmart(inc.amount)}円
          </div>
        </div>

        <div style={{ fontSize: 12, color: "var(--text-success)", fontWeight: 500 }}>
          手取 {fmtSmart(Math.round(inc.amount * 0.75))}円目安
        </div>

        <button
          onClick={e => {
            e.stopPropagation();
            onRemove();
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            fontSize: 16,
            padding: 4
          }}
        >
          <i className="ti ti-trash" aria-hidden="true" />
        </button>
      </div>

      {active && (
        <div style={{ padding: "12px 14px", background: "var(--surface-2)" }} onClick={e => e.stopPropagation()}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>収入名称</div>
              <input
                value={inc.label}
                onChange={e => onUpdate("label", e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>収入区分</div>
              <select
                value={inc.type}
                onChange={e => onUpdate("type", e.target.value)}
                style={{ width: "100%" }}
              >
                {INCOME_TYPES.map(t => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <NumInput
            label="年収"
            value={inc.amount}
            onChange={v => onUpdate("amount", v)}
            suffix="円"
            step={100_000}
          />

          {inc.type === "sole" && (
            <div style={{ padding: "6px 10px", background: "var(--bg-success)", borderRadius: "var(--radius)", fontSize: 11, color: "var(--text-success)" }}>
              個人事業主：青色申告特別控除65万円が自動適用されます
            </div>
          )}

          {inc.type === "executive" && (
            <div style={{ padding: "6px 10px", background: "var(--bg-warning)", borderRadius: "var(--radius)", fontSize: 11, color: "var(--text-warning)" }}>
              役員報酬：給与所得控除が適用されます（上限1,600万円）
            </div>
          )}
        </div>
      )}
    </div>
  );
}
