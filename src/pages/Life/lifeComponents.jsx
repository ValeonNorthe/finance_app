import { Card } from "../../components/common/Card.jsx";
import { NumInput } from "../../components/common/NumberInput.jsx";
import { Sl } from "../../components/common/Slider.jsx";
import { SegBtn } from "../../components/common/SegmentButton.jsx";
import { Metric } from "../../components/common/Metric.jsx";
import { fmtSmart } from "../../utils/format";
import { EDU_PATTERNS } from "../../constants/appData";

export function ChildCard({ child, activeChild, setActiveChild, birthAge, eduPat, removeChild }) {
  return (
    <div
      onClick={() => setActiveChild(activeChild === child.id ? null : child.id)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        background: "var(--surface-1)",
        borderRadius: activeChild === child.id ? "var(--radius) var(--radius) 0 0" : "var(--radius)",
        cursor: "pointer",
        border: activeChild === child.id ? "1.5px solid var(--border-accent)" : "0.5px solid var(--border)",
        borderBottom: activeChild === child.id ? "none" : undefined,
        transition: "all 0.15s"
      }}
    >
      <i className="ti ti-baby-carriage" aria-hidden="true" style={{ fontSize: 18, color: "#e87ba4" }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{child.name}</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
          {child.birthYear}年後（あなた{birthAge}歳）/ {eduPat?.label}
        </div>
      </div>

      <button
        onClick={e => {
          e.stopPropagation();
          if (confirm("この子供のデータを削除しますか？")) {
            removeChild();
          }
        }}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#ef4444",
          fontSize: 16
        }}
        title="削除"
      >
        <i className="ti ti-trash" aria-hidden="true" />
      </button>

      <i
        className={`ti ${activeChild === child.id ? "ti-chevron-up" : "ti-chevron-down"}`}
        style={{ fontSize: 16, color: "var(--text-muted)" }}
      />
    </div>
  );
}

export function ChildDetail({ child, updateChildField }) {
  return (
    <div
      style={{
        border: "1.5px solid var(--border-accent)",
        borderTop: "none",
        borderRadius: "0 0 var(--radius) var(--radius)",
        padding: "12px 14px",
        background: "var(--surface-2)"
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>
            お子さんの名称
          </div>
          <input
            value={child.name}
            onChange={e => updateChildField("name", e.target.value)}
            onFocus={e => e.target.select()}
            style={{ width: "100%" }}
          />
        </div>

        <Sl
          label="誕生年（現在から）"
          min={0}
          max={30}
          value={child.birthYear}
          onChange={v => updateChildField("birthYear", v)}
          unit="年後"
        />

        <NumInput
          label="出生費用"
          value={child.birthCost}
          suffix="円"
          step={50_000}
          onChange={v => updateChildField("birthCost", v)}
        />

        <NumInput
          label="年間育児費用（0〜6歳）"
          value={child.annualChildcareCost}
          suffix="円"
          step={10_000}
          onChange={v => updateChildField("annualChildcareCost", v)}
        />

        <Sl
          label="自立年齢（支援終了）"
          min={15}
          max={30}
          value={child.independenceAge !== undefined ? child.independenceAge : 22}
          onChange={v => updateChildField("independenceAge", v)}
          unit="歳"
        />
      </div>

      <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>
        教育費パターン
      </div>

      {EDU_PATTERNS.map((pat, i) => (
        <label
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            cursor: "pointer",
            marginBottom: 6,
            padding: "6px 8px",
            background: child.eduPattern === i ? "var(--bg-accent)" : "transparent",
            borderRadius: "var(--radius)",
            transition: "background 0.15s"
          }}
        >
          <input
            type="radio"
            checked={child.eduPattern === i}
            onChange={() => updateChildField("eduPattern", i)}
          />
          <span style={{ flex: 1 }}>{pat.label}</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{pat.desc}</span>
          <span style={{ color: "var(--text-accent)", fontWeight: 500 }}>
            約{fmtSmart(pat.cost * 10_000)}円
          </span>
        </label>
      ))}

      <div
        style={{
          padding: "6px 10px",
          background: "var(--bg-accent)",
          borderRadius: "var(--radius)",
          fontSize: 11,
          color: "var(--text-accent)",
          marginTop: 6
        }}
      >
        教育費総額: {fmtSmart(EDU_PATTERNS[child.eduPattern]?.cost * 10_000 || 0)}円
        （育児費用6年合計: {fmtSmart((child.annualChildcareCost || 0) * 6)}円）
      </div>
    </div>
  );
}

export function MarriageSection({ st, set, currentAge, updateLifeField }) {
  return (
    <Card title="結婚" style={{ marginBottom: 12 }}>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 13,
          cursor: "pointer",
          marginBottom: 10
        }}
      >
        <input
          type="checkbox"
          checked={st.married}
          onChange={e => updateLifeField(set, "married", e.target.checked)}
        />
        結婚予定あり
      </label>

      {st.married && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <Sl
                label="結婚年（現在から）"
                min={0}
                max={30}
                value={st.marriageYear}
                onChange={v => updateLifeField(set, "marriageYear", v)}
                unit="年後"
              />
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                → {currentAge + st.marriageYear}歳時
              </div>
            </div>

            <NumInput
              label="結婚式・関連費用"
              value={st.marriageCost}
              suffix="円"
              step={100_000}
              onChange={v => updateLifeField(set, "marriageCost", v)}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 6 }}>
            <div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>
                パートナー名（任意）
              </div>
              <input
                value={st.partnerName || ""}
                onChange={e => updateLifeField(set, "partnerName", e.target.value)}
                onFocus={e => e.target.select()}
                placeholder="山田 花子"
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>
                パートナーの生年月日
              </div>
              <input
                type="date"
                value={st.partnerBirthDate || ""}
                onChange={e => updateLifeField(set, "partnerBirthDate", e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              cursor: "pointer",
              marginTop: 8
            }}
          >
            <input
              type="checkbox"
              checked={st.includeSpouse}
              onChange={e => updateLifeField(set, "includeSpouse", e.target.checked)}
            />
            <span style={{ color: "var(--text-accent)" }}>パートナーの収入を合算</span>
          </label>

          {st.includeSpouse && (
            <NumInput
              label="パートナー年収"
              value={st.spouseIncome}
              onChange={v => updateLifeField(set, "spouseIncome", v)}
              suffix="円"
              step={100_000}
              style={{ marginTop: 8 }}
            />
          )}
        </div>
      )}
    </Card>
  );
}

export function HousingSection({ st, set, currentAge, loanMonthly, updateLifeField }) {
  return (
    <Card title="住宅" style={{ marginBottom: 12 }}>
      <SegBtn
        options={[
          ["rent", "賃貸継続"],
          ["loan", "住宅ローン購入"],
          ["purchase", "一括購入"]
        ]}
        value={st.housing}
        onChange={v => updateLifeField(set, "housing", v)}
      />

      {(st.housing === "loan" || st.housing === "purchase") && (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <NumInput
              label="物件価格 / 借入金額"
              value={st.loanAmount}
              suffix="円"
              step={1_000_000}
              onChange={v => updateLifeField(set, "loanAmount", v)}
            />

            <div>
              <Sl
                label="購入時期（現在から）"
                min={0}
                max={30}
                value={st.housingYear}
                onChange={v => updateLifeField(set, "housingYear", v)}
                unit="年後"
              />
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                → {currentAge + st.housingYear}歳時
              </div>
            </div>
          </div>

          {st.housing === "loan" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Sl
                label="金利"
                min={0.1}
                max={5}
                step={0.05}
                value={st.loanRate}
                onChange={v => updateLifeField(set, "loanRate", v)}
                unit="%"
              />

              <Sl
                label="返済期間"
                min={10}
                max={35}
                value={st.loanYears}
                onChange={v => updateLifeField(set, "loanYears", v)}
                unit="年"
              />
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
            {st.housing === "loan" && (
              <Metric
                label="月額返済額"
                value={`${fmt(loanMonthly)}円`}
                sub={`総返済: ${fmtSmart(loanMonthly * st.loanYears * 12)}円`}
              />
            )}

            <Metric
              label="頭金（10%目安）"
              value={`${fmtSmart(st.loanAmount * 0.1)}円`}
            />
          </div>
        </div>
      )}
    </Card>
  );
}

