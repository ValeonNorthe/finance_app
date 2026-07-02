import { useSelector } from "react-redux";
import { Card } from "../../components/common/Card.jsx";
import { Metric } from "../../components/common/Metric.jsx";
import { fmtSmart } from "../../utils/format";
import { ACC_TYPES } from "../../constants/appData";

import {
  selectTotalBalance,
  selectAccountChartData,
} from "./accountsSelectors";

import {
  addAccount,
  updateAccountField,
  removeAccount
} from "./accountsActions";

import { AccountsAreaChart } from "./accountsCharts";

export const AccountsTab = ({ st, set }) => {
  const totalBalance = useSelector(selectTotalBalance);
  const accChartData = useSelector(selectAccountChartData);

  return (
    <div>
      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <Metric label="口座残高合計" value={fmtSmart(totalBalance) + "円"} icon="ti-building-bank" />
        <Metric label="口座数" value={`${st.accounts.length}口座`} icon="ti-credit-card" />
      </div>

      {/* 口座一覧 */}
      <Card title="口座一覧" style={{ marginBottom: 14 }}>
        {st.accounts.map(acc => {
          const typeInfo = ACC_TYPES.find(t => t.key === acc.type);

          return (
            <div key={acc.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
                padding: "10px 12px",
                background: "var(--surface-1)",
                borderRadius: "var(--radius)",
                borderLeft: `3px solid ${typeInfo?.color || "#898781"}`
              }}
            >
              <select
                value={acc.type}
                onChange={e => updateAccountField(set, acc.id, "type", e.target.value)}
                style={{ width: 160, fontSize: 11 }}
              >
                {ACC_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
              </select>

              <input
                value={acc.label}
                onChange={e => updateAccountField(set, acc.id, "label", e.target.value)}
                onFocus={e => e.target.select()}
                style={{ flex: 1, fontSize: 12 }}
                placeholder="口座名"
              />

              <input
                type="number"
                value={acc.balance}
                onChange={e => updateAccountField(set, acc.id, "balance", Number(e.target.value))}
                onFocus={e => e.target.select()}
                style={{ width: 100, fontSize: 12 }}
                placeholder="残高"
              />
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>円</span>

              <input
                type="number"
                value={acc.monthly}
                onChange={e => updateAccountField(set, acc.id, "monthly", Number(e.target.value))}
                onFocus={e => e.target.select()}
                style={{ width: 80, fontSize: 12 }}
                placeholder="月積立"
              />
              <span style={{ fontSize: 11, color: "var(--text-muted)", marginRight: 4 }}>円/月</span>

              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>積立期間:</span>
              <input
                type="number"
                value={acc.startAge !== undefined ? acc.startAge : 30}
                onChange={e => updateAccountField(set, acc.id, "startAge", Number(e.target.value))}
                onFocus={e => e.target.select()}
                style={{ width: 42, height: 32, fontSize: 12, padding: "0 4px", textAlign: "center", minWidth: 42 }}
                placeholder="開始"
              />
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>〜</span>
              <input
                type="number"
                value={acc.endAge !== undefined ? acc.endAge : 65}
                onChange={e => updateAccountField(set, acc.id, "endAge", Number(e.target.value))}
                onFocus={e => e.target.select()}
                style={{ width: 42, height: 32, fontSize: 12, padding: "0 4px", textAlign: "center", minWidth: 42 }}
                placeholder="終了"
              />
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>歳</span>

              <button
                onClick={() => removeAccount(set, acc.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  fontSize: 16
                }}
              >
                <i className="ti ti-trash" aria-hidden="true" />
              </button>
            </div>
          );
        })}

        <button
          onClick={() => addAccount(set)}
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
            gap: 5
          }}
        >
          <i className="ti ti-plus" aria-hidden="true" />口座を追加
        </button>
      </Card>

      {/* 口座種類の凡例 */}
      <Card title="口座種類・カラー凡例" style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {ACC_TYPES.map(t => (
            <span key={t.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                color: "var(--text-secondary)",
                padding: "3px 8px",
                background: "var(--surface-1)",
                borderRadius: "var(--radius)"
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.color }} />
              {t.label}
            </span>
          ))}
        </div>
      </Card>

      {/* グラフ */}
      <AccountsAreaChart data={accChartData} accounts={st.accounts} />
    </div>
  );
}