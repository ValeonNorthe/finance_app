//JSX（UI）だけを置く
import { Card } from "../../components/common/Card.jsx";
import { NumInput } from "../../components/common/NumberInput.jsx";
import { Sl } from "../../components/common/Slider.jsx";
import { computeProfileAge } from "./profileSelectors";

export const ProfileTab = ({ st, set }) => {
  const u = (k, v) => set(p => ({ ...p, [k]: v }));

  const { currentAge, goalAge } = computeProfileAge(st || {});

  return (
    <div>
      <Card title="基本情報" style={{ marginBottom: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>お名前（任意）</div>
            <input
              value={st.name}
              onChange={e => u("name", e.target.value)}
              placeholder="山田 太郎"
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>生年月日</div>
            <input
              type="date"
              value={st.birthDate}
              onChange={e => u("birthDate", e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {currentAge && (
          <div style={{
            marginTop: 10,
            padding: "8px 12px",
            background: "var(--bg-accent)",
            borderRadius: "var(--radius)",
            fontSize: 13,
            color: "var(--text-accent)"
          }}>
            <i className="ti ti-info-circle" aria-hidden="true" style={{ marginRight: 6 }} />
            現在 {currentAge}歳 → 目標到達時 {goalAge}歳（{st.goalYears}年後）
          </div>
        )}
      </Card>

      <Card title="シミュレーション目標" style={{ marginBottom: 14 }}>
        <NumInput
          label="目標金額"
          value={st.goalAmount}
          onChange={v => u("goalAmount", v)}
          suffix="円"
          step={1_000_000}
        />

        <Sl
          label="シミュレーション期間"
          min={5}
          max={60}
          value={st.goalYears}
          onChange={v => u("goalYears", v)}
          unit="年"
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Sl
            label="インフレ率（基本）"
            min={0}
            max={10}
            step={0.1}
            value={st.inflationRate}
            onChange={v => u("inflationRate", v)}
            unit="%"
          />
          <Sl
            label="インフレ変化リスク率"
            min={0}
            max={5}
            step={0.1}
            value={st.inflationRiskRate}
            onChange={v => u("inflationRiskRate", v)}
            unit="%"
          />
        </div>

        <div style={{
          padding: "8px 12px",
          background: "var(--surface-1)",
          borderRadius: "var(--radius)",
          fontSize: 12,
          color: "var(--text-muted)"
        }}>
          インフレ変化リスク率は悲観シナリオにのみ反映されます。
          基本インフレ率 {st.inflationRate}% ± {st.inflationRiskRate}% の範囲でシミュレーションします。
        </div>
      </Card>

      <Card title="扶養・家族情報">
        <Sl
          label="扶養親族数"
          min={0}
          max={10}
          value={st.dependents}
          onChange={v => u("dependents", v)}
          unit="人"
        />

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={st.includeSpouse}
              onChange={e => u("includeSpouse", e.target.checked)}
            />
            配偶者の収入を合算する
          </label>
        </div>

        {st.includeSpouse && (
          <NumInput
            label="配偶者の年収"
            value={st.spouseIncome}
            onChange={v => u("spouseIncome", v)}
            suffix="円"
            step={100_000}
          />
        )}
      </Card>
    </div>
  );
}
