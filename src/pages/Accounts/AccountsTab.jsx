import { useSelector } from "react-redux";
import { Card } from "../../components/common/Card.jsx";
import { Metric } from "../../components/common/Metric.jsx";
import { fmtSmart } from "../../utils/format";
import { ACC_TYPES } from "../../constants/appData";
import { useState } from "react";

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
  const [viewMode, setViewMode] = useState("overall"); // "overall" or "individual"
  const [granularity, setGranularity] = useState("yearly"); // "yearly" or "monthly"
  
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

              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>上限:</span>
              <input
                type="number"
                value={acc.maxBalance || ""}
                onChange={e => updateAccountField(set, acc.id, "maxBalance", e.target.value ? Number(e.target.value) : null)}
                onFocus={e => e.target.select()}
                style={{ width: 80, fontSize: 12 }}
                placeholder="なし"
              />
              <span style={{ fontSize: 11, color: "var(--text-muted)", marginRight: 8 }}>円</span>

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
                onClick={() => {
                  if (confirm("この口座を削除しますか？")) {
                    removeAccount(set, acc.id);
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

      {/* グラフ表示設定 */}
      <Card title="グラフ表示設定" style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>表示モード</div>
            <div style={{ display: "flex", gap: 4 }}>
              <button
                onClick={() => setViewMode("overall")}
                style={{
                  padding: "6px 12px",
                  borderRadius: "var(--radius)",
                  fontSize: 12,
                  cursor: "pointer",
                  border: viewMode === "overall" ? "1.5px solid var(--border-accent)" : "0.5px solid var(--border)",
                  background: viewMode === "overall" ? "var(--bg-accent)" : "transparent",
                  color: viewMode === "overall" ? "var(--text-accent)" : "var(--text-secondary)",
                }}
              >
                全体合計
              </button>
              <button
                onClick={() => setViewMode("individual")}
                style={{
                  padding: "6px 12px",
                  borderRadius: "var(--radius)",
                  fontSize: 12,
                  cursor: "pointer",
                  border: viewMode === "individual" ? "1.5px solid var(--border-accent)" : "0.5px solid var(--border)",
                  background: viewMode === "individual" ? "var(--bg-accent)" : "transparent",
                  color: viewMode === "individual" ? "var(--text-accent)" : "var(--text-secondary)",
                }}
              >
                口座別
              </button>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>時間単位</div>
            <div style={{ display: "flex", gap: 4 }}>
              <button
                onClick={() => setGranularity("yearly")}
                style={{
                  padding: "6px 12px",
                  borderRadius: "var(--radius)",
                  fontSize: 12,
                  cursor: "pointer",
                  border: granularity === "yearly" ? "1.5px solid var(--border-accent)" : "0.5px solid var(--border)",
                  background: granularity === "yearly" ? "var(--bg-accent)" : "transparent",
                  color: granularity === "yearly" ? "var(--text-accent)" : "var(--text-secondary)",
                }}
              >
                年次
              </button>
              <button
                onClick={() => setGranularity("monthly")}
                style={{
                  padding: "6px 12px",
                  borderRadius: "var(--radius)",
                  fontSize: 12,
                  cursor: "pointer",
                  border: granularity === "monthly" ? "1.5px solid var(--border-accent)" : "0.5px solid var(--border)",
                  background: granularity === "monthly" ? "var(--bg-accent)" : "transparent",
                  color: granularity === "monthly" ? "var(--text-accent)" : "var(--text-secondary)",
                }}
              >
                月次
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* グラフ */}
      <AccountsAreaChart 
        data={accChartData} 
        accounts={st.accounts} 
        viewMode={viewMode}
        granularity={granularity}
      />
    </div>
  );
}