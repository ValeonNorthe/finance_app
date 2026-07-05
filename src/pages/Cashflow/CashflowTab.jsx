import { Card } from "../../components/common/Card.jsx";
import { NumInput } from "../../components/common/NumberInput.jsx";
import { Sl } from "../../components/common/Slider.jsx";
import { SegBtn } from "../../components/common/SegmentButton.jsx";
import { Metric } from "../../components/common/Metric.jsx";
import { fmt, fmtSmart } from "../../utils/format";
import { CashflowPieChart } from "./cashflowCharts";

import {
  selectCashflowSummary,
  selectExpensePieData
} from "./cashflowSelectors";

import {
  updateFixedExpense,
  updateVariableExpense,
  updateMedicalExpense
} from "./cashflowActions";

export const CashflowTab = ({ st, set }) => {
  const summary = selectCashflowSummary(st || {});
  const expPieData = selectExpensePieData(st || {});

  return (
    <div>
      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 14 }}>
        <Metric label="月間手取り" value={fmtSmart(summary.monthlyTH) + "円"} color="var(--text-success)" icon="ti-cash" />
        <Metric label="月間総支出" value={fmtSmart(summary.totalExp) + "円"} color="var(--text-danger)" icon="ti-shopping-cart" />
        <Metric label="月間余剰" value={fmtSmart(summary.surplus) + "円"} color={summary.surplus > 0 ? "var(--text-success)" : "var(--text-danger)"} icon="ti-trending-up" />
      </div>

      {/* 固定費 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <Card title="固定費（月）">
          {Object.entries(st.monthlyFixed || {}).map(([k, v]) => (
            <NumInput
              key={k}
              label={summary.fixedLabels[k]}
              value={v}
              suffix="円"
              step={1000}
              onChange={val => updateFixedExpense(set, k, val)}
            />
          ))}
          <div style={{ fontSize: 12, color: "var(--text-muted)", borderTop: "0.5px solid var(--border)", paddingTop: 6, marginTop: 4 }}>
            合計: <strong style={{ color: "var(--text-primary)" }}>{fmt(summary.monthlyFixed)}</strong>円
          </div>
        </Card>

        {/* 変動費 */}
        <Card title="変動費（月）">
          {Object.entries(st.monthlyVariable || {}).map(([k, v]) => (
            <NumInput
              key={k}
              label={summary.varLabels[k]}
              value={k === "health" ? summary.totalMedicalMonthly : v}
              suffix="円"
              step={1000}
              onChange={val => k === "health" ? null : updateVariableExpense(set, k, val)}
              disabled={k === "health"}
              style={k === "health" ? { background: "var(--bg-accent)" } : {}}
            />
          ))}
<<<<<<< HEAD
          {(st.monthlyVariable?.health || 0) !== (summary.totalMedicalMonthly || 0) && (
=======
          {st.monthlyVariable.health !== summary.totalMedicalMonthly && (
>>>>>>> eb5fa1b0ea88092afdb1ee7f87a84c0fb7ad3e10
            <div style={{ fontSize: 11, color: "var(--text-accent)", marginTop: 4, padding: "4px 8px", background: "var(--bg-accent)", borderRadius: "var(--radius)" }}>
              <i className="ti ti-info-circle" style={{ marginRight: 4 }} />
              健康・医療は医療費（年間）から自動計算: {fmt(summary.totalMedicalMonthly)}円/月
            </div>
          )}
          <div style={{ fontSize: 12, color: "var(--text-muted)", borderTop: "0.5px solid var(--border)", paddingTop: 6, marginTop: 4 }}>
            合計: <strong style={{ color: "var(--text-primary)" }}>{fmt(summary.monthlyVarExcludingHealth + summary.totalMedicalMonthly)}</strong>円
          </div>
        </Card>
      </div>

      {/* 医療費 */}
      <Card title="医療費（年間 → 月額換算）" style={{ marginBottom: 14 }}>
        <div style={{ padding: "6px 10px", background: "var(--bg-accent)", borderRadius: "var(--radius)", fontSize: 11, color: "var(--text-accent)", marginBottom: 10 }}>
          <i className="ti ti-info-circle" style={{ marginRight: 4 }} />
          この金額は変動費の「健康・医療」と連動して月額換算されます
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {Object.entries(st.medical || {}).map(([k, v]) => (
            <NumInput
              key={k}
              label={summary.medLabels[k] + "（年額）"}
              value={v}
              suffix="円"
              step={1000}
              onChange={val => {
                updateMedicalExpense(set, k, val);
                // Sync with health variable expense
                const newMedicalTotal = Object.entries({ ...st.medical, [k]: val })
                  .reduce((a, [_, val]) => a + val, 0);
                set(p => ({
                  ...p,
                  monthlyVariable: {
                    ...p.monthlyVariable,
                    health: newMedicalTotal / 12
                  }
                }));
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
          月額換算: {fmt(summary.monthlyMedical)}円 / 年間合計: {fmt(summary.annualMedical)}円
        </div>
      </Card>

      {/* 投資設定 */}
      <Card title="積み立て・投資設定" style={{ marginBottom: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <NumInput label="月間投資額" value={st.monthlyInvest} suffix="円" step={1000}
            onChange={v => set(p => ({ ...p, monthlyInvest: v }))} />
          <NumInput label="ボーナス投資額（年）" value={st.bonusInvest} suffix="円" step={10000}
            onChange={v => set(p => ({ ...p, bonusInvest: v }))} />
        </div>

        <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>積み立てタイミング</div>
        <SegBtn options={[["monthly","毎月"],["annual","年初一括"],["daily","毎日"]]} value={st.investTiming}
          onChange={v => set(p => ({ ...p, investTiming: v }))} />
      </Card>

      {/* クレジット・ポイント還元 */}
      <Card title="クレジット・ポイント還元" style={{ marginBottom: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <Sl label="クレカ翌月払い遅延" min={0} max={3} step={1} value={st.creditMonthDelay}
            onChange={v => set(p => ({ ...p, creditMonthDelay: v }))} unit="ヶ月" />
          <Sl label="クレジット還元率" min={0} max={5} step={0.1} value={st.creditCardRate}
            onChange={v => set(p => ({ ...p, creditCardRate: v }))} unit="%" />
          <Sl label="ポイント還元率" min={0} max={3} step={0.1} value={st.pointRate}
            onChange={v => set(p => ({ ...p, pointRate: v }))} unit="%" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 8 }}>
          <Metric label="月間クレカ還元" value={`+${fmt(summary.creditBack)}円`} color="var(--text-success)" />
          <Metric label="月間ポイント還元" value={`+${fmt(summary.pointBack)}円`} color="var(--text-success)" />
          <Metric label="年間合計還元" value={`+${fmtSmart(summary.annualBack)}円`} color="var(--text-accent)" />
        </div>
      </Card>

      {/* 円グラフ */}
      <CashflowPieChart expPieData={expPieData} />
    </div>
  );
}
