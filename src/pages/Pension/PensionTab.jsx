import { selectTotalMonthlyPension } from "./pensionSelectors";
import {
  addPensionRecord,
  updatePensionRecord,
  removePensionRecord,
} from "./pensionActions";

import { PensionRow, PensionDetailForm } from "./pensionComponents";
import { Card } from "../../components/common/Card.jsx";
import { Metric } from "../../components/common/Metric.jsx";
import { Sl } from "../../components/common/Slider.jsx";
import { fmt, fmtSmart } from "../../utils/format";
import { useState } from "react";
import { PENSION_TYPES } from "../../constants/appData";

export const PensionTab = ({ st, set }) => {
  const [activeP, setActiveP] = useState(null);

  const totalMonthly = selectTotalMonthlyPension(st.pensionRecords, st.pensionStartAge);

  return (
    <div>
      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <Metric label="月間年金合計" value={`${fmt(totalMonthly)}円`} icon="ti-receipt" />
        <Metric label="年間年金合計" value={fmtSmart(totalMonthly * 12) + "円"} icon="ti-cash" />
      </div>

      {/* 受給開始年齢設定 */}
      <Card title="年金受給開始年齢設定" style={{ marginBottom: 14 }}>
        <Sl
          label="年金受給開始年齢"
          min={60}
          max={75}
          value={st.pensionStartAge}
          onChange={(v) => set((p) => ({ ...p, pensionStartAge: v }))}
          unit="歳"
        />
        <div style={{
          padding: "6px 10px",
          background: "var(--bg-accent)",
          borderRadius: "var(--radius)",
          fontSize: 11,
          color: "var(--text-accent)",
        }}>
          65歳より早く受給すると月0.4%減額、遅くすると月0.7%増額（75歳で+84%）
        </div>
      </Card>

      {/* 年金記録一覧 */}
      <Card title="年金記録">
        {st.pensionRecords.map((rec) => (
          <div key={rec.id} style={{ marginBottom: 8 }}>
            <PensionRow
              rec={rec}
              active={activeP === rec.id}
              onToggle={() => setActiveP(activeP === rec.id ? null : rec.id)}
              onRemove={() => removePensionRecord(set, rec.id)}
            />

            {activeP === rec.id && (
              <PensionDetailForm
                rec={rec}
                onUpdate={(key, val) => updatePensionRecord(set, rec.id, key, val)}
              />
            )}
          </div>
        ))}

        <button
          onClick={() => {
            const newId = addPensionRecord(set);
            setActiveP(newId);
          }}
          style={{
            fontSize: 12,
            padding: "7px 14px",
            borderRadius: "var(--radius)",
            border: "0.5px solid var(--border-accent)",
            background: "var(--bg-accent)",
            cursor: "pointer",
            color: "var(--text-accent)",
            display: "flex",
            alignItems: "center",
            gap: 5,
            marginTop: 4,
          }}
        >
          <i className="ti ti-plus" /> 年金を追加
        </button>
      </Card>
    </div>
  );
}
