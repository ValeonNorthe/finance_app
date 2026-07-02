import { useState } from "react";
import { Card } from "../../components/common/Card.jsx";
import { NumInput } from "../../components/common/NumberInput.jsx";
import { Sl } from "../../components/common/Slider.jsx";
import { SegBtn } from "../../components/common/SegmentButton.jsx";
import { Metric } from "../../components/common/Metric.jsx";
import { fmtSmart } from "../../utils/format";
import { INCOME_TYPES } from "../../constants/appData";

import {
  selectIncomeSummary,
  selectTaxResult
} from "./incomeSelectors";

import {
  addIncome,
  updateIncome,
  removeIncome
} from "./incomeActions";

import { IncomeEditor } from "./incomeInputs";
import { InfoRow } from "../../components/common/InfoRow.jsx";

export const IncomeTab = ({ st, set }) => {
  const [activeInc, setActiveInc] = useState(null);

  const summary = selectIncomeSummary(st);
  const taxResult = selectTaxResult(st);

  return (
    <div>
      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 14 }}>
        <Metric label="総年収" value={fmtSmart(summary.totalGross) + "円"} icon="ti-coins" />
        <Metric label="年間手取り" value={fmtSmart(taxResult.takehome) + "円"} color="var(--text-success)" icon="ti-cash" />
        <Metric label="実効税率" value={`${taxResult.effectiveRate}%`} color="var(--text-warning)" icon="ti-percentage" />
      </div>

      {/* 収入一覧 */}
      <Card title="収入一覧" style={{ marginBottom: 14 }}>
        {st.incomes.map(inc => (
          <IncomeEditor
            key={inc.id}
            inc={inc}
            active={activeInc === inc.id}
            onToggle={() => setActiveInc(activeInc === inc.id ? null : inc.id)}
            onUpdate={(key, val) => updateIncome(set, inc.id, key, val)}
            onRemove={() => removeIncome(set, inc.id)}
          />
        ))}

        <button
          onClick={() => addIncome(set, setActiveInc)}
          style={{
            fontSize: 13,
            padding: "8px 16px",
            borderRadius: "var(--radius)",
            border: "0.5px solid var(--border-accent)",
            background: "var(--bg-accent)",
            cursor: "pointer",
            color: "var(--text-accent)",
            display: "flex",
            alignItems: "center",
            gap: 6
          }}
        >
          <i className="ti ti-plus" aria-hidden="true" />収入を追加
        </button>
      </Card>

      {/* 税計算詳細 */}
      <Card title="税計算詳細（令和6年度）" style={{ marginBottom: 14 }}>
        <InfoRow label="総収入（合算）" value={fmtSmart(taxResult.totalGross) + "円"} />
        <InfoRow label="給与所得控除等" value={"−" + fmtSmart(taxResult.totalGross - taxResult.totalNet) + "円"} color="var(--text-success)" />
        <InfoRow label="所得金額（合計）" value={fmtSmart(taxResult.totalNet) + "円"} />
        <InfoRow label="基礎控除" value={"−" + fmtSmart(taxResult.basicDeduction) + "円"} color="var(--text-success)" />
        <InfoRow label={`扶養控除（${st.dependents}人）`} value={"−" + fmtSmart(taxResult.dependDeduction) + "円"} color="var(--text-success)" />
        <InfoRow label="社会保険料控除" value={"−" + fmtSmart(taxResult.socialIns) + "円"} color="var(--text-success)" />
        <InfoRow label="課税所得" value={fmtSmart(taxResult.taxable) + "円"} />
        <InfoRow label="所得税+復興税" value={"−" + fmtSmart(taxResult.incomeTax) + "円"} color="var(--text-danger)" />
        <InfoRow label="住民税（10%+均等割）" value={"−" + fmtSmart(taxResult.residentTax) + "円"} color="var(--text-danger)" />
        <InfoRow label="社会保険料" value={"−" + fmtSmart(taxResult.socialIns) + "円"} color="var(--text-warning)" />

        <div style={{ padding: "10px 0", display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 500, marginTop: 4 }}>
          <span>年間手取り</span>
          <span style={{ color: "var(--text-success)" }}>{fmtSmart(taxResult.takehome)}円</span>
        </div>
      </Card>

      {/* 社会保険料設定 */}
      <Card title="社会保険料設定">
        <div style={{ padding: "6px 10px", background: "var(--bg-accent)", borderRadius: "var(--radius)", fontSize: 11, color: "var(--text-accent)", marginBottom: 10 }}>
          0円に設定すると収入の14.5%で自動計算（会社員の目安）
        </div>

        <NumInput
          label="年間社会保険料（自動計算：0円）"
          value={st.socialInsurance}
          onChange={v => set(p => ({ ...p, socialInsurance: v }))}
          suffix="円"
          step={10_000}
        />

        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
          自動計算値: 約{fmtSmart(Math.round(summary.totalGross * 0.145))}円（年収の14.5%）
        </div>
      </Card>
    </div>
  );
}
