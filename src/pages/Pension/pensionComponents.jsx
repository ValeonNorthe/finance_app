import { PENSION_TYPES } from "../../constants/appData";
import { selectTotalMonthlyPension } from "./pensionSelectors";
import { fmt,fmtSmart } from "../../utils/format";
import { Card } from "../../components/common/Card.jsx";
import { Metric } from "../../components/common/Metric.jsx";
import { Sl } from "../../components/common/Slider.jsx";
import { NumInput } from "../../components/common/NumberInput.jsx";
import { useState } from "react";
import { addPensionRecord, updatePensionRecord, removePensionRecord } from "./pensionActions";
export function PensionRow({ rec, active, onToggle, onRemove }) {
  const typeLabel = PENSION_TYPES.find((t) => t.key === rec.type)?.label;

  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        background: "var(--surface-1)",
        cursor: "pointer",
        borderRadius: active
          ? "var(--radius) var(--radius) 0 0"
          : "var(--radius)",
        border: active
          ? "1.5px solid var(--border-accent)"
          : "0.5px solid var(--border)",
        borderBottom: active ? "none" : undefined,
      }}
    >
      <i className="ti ti-building-bank" style={{ fontSize: 16, color: "#2a78d6" }} />

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{rec.label}</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
          {typeLabel} / {rec.startAge}歳〜{rec.endAge}歳 / 月額 {fmt(rec.monthlyAmount)}円
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          if (confirm("この年金記録を削除しますか？")) {
            onRemove();
          }
        }}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#ef4444",
        }}
        title="削除"
      >
        <i className="ti ti-trash" />
      </button>

      <i
        className={`ti ${active ? "ti-chevron-up" : "ti-chevron-down"}`}
        style={{ fontSize: 16, color: "var(--text-muted)" }}
      />
    </div>
  );
}
export function PensionDetailForm({ rec, onUpdate }) {
  return (
    <div
      style={{
        border: "1.5px solid var(--border-accent)",
        borderTop: "none",
        borderRadius: "0 0 var(--radius) var(--radius)",
        padding: "12px 14px",
        background: "var(--surface-2)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>
            年金名称
          </div>
          <input
            value={rec.label}
            onChange={(e) => onUpdate("label", e.target.value)}
            onFocus={(e) => e.target.select()}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>
            年金種別
          </div>
          <select
            value={rec.type}
            onChange={(e) => onUpdate("type", e.target.value)}
            style={{ width: "100%" }}
          >
            {PENSION_TYPES.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <NumInput
          label="月額受給額"
          value={rec.monthlyAmount}
          suffix="円"
          step={1000}
          onChange={(v) => onUpdate("monthlyAmount", v)}
        />

        <div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>
            納付期間（メモ）
          </div>
          <input
            value={rec.payYears}
            onChange={(e) => onUpdate("payYears", e.target.value)}
            onFocus={(e) => e.target.select()}
            placeholder="例: 22〜60歳"
            style={{ width: "100%" }}
          />
        </div>

        <Sl
          label="受給開始年齢"
          min={60}
          max={75}
          value={rec.startAge}
          onChange={(v) => onUpdate("startAge", v)}
          unit="歳"
        />

        <NumInput
          label="受給終了年齢"
          value={rec.endAge}
          suffix="歳"
          step={1}
          min={65}
          max={120}
          onChange={(v) => onUpdate("endAge", v)}
        />
      </div>
    </div>
  );
}
