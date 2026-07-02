import { useState, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateSettings, resetSettings } from "./store/settingSlice";
import {
  selectSettings,
  selectCurrentAge,
  selectTimeline,
  selectTaxResult,
  selectSimulationSummary,
  selectTotalAssets,
  selectTotalAnnualIncome,
} from "./store/simulationSelectors";

import { TABS } from "./constants/tabs";
import { fmtSmart } from "./utils/format";

import { DashboardTab } from "./pages/Dashboard/DashboardTab";
import { ProfileTab } from "./pages/Profile/ProfileTab";
import { IncomeTab } from "./pages/Income/IncomeTab";
import { CashflowTab } from "./pages/Cashflow/CashflowTab";
import { PortfolioTab } from "./pages/Portfolio/PortfolioTab";
import { AccountsTab } from "./pages/Accounts/AccountsTab";
import { LifeTab } from "./pages/Life/LifeTab";
import { PensionTab } from "./pages/Pension/PensionTab";
import { SimulationTab } from "./pages/Simulation/SimulationTab";
import { FormulaTab } from "./pages/Formula/FormulaTab";
import { SaveTab } from "./pages/Save/SaveTab";

export default function App() {
  const [tab, setTab] = useState(0);

  const st = useSelector(selectSettings);
  const currentAge = useSelector(selectCurrentAge);
  const timeline = useSelector(selectTimeline);
  const taxResult = useSelector(selectTaxResult);
  const simulationResult = useSelector(selectSimulationSummary);
  const totalAssets = useSelector(selectTotalAssets);
  const totalAnnualIncome = useSelector(selectTotalAnnualIncome);

  const dispatch = useDispatch();

  const updateState = useCallback(
    (updater) => {
      const payload = typeof updater === "function" ? updater(st) : updater;
      dispatch(updateSettings(payload));
    },
    [dispatch, st]
  );

  const listRef = useRef(null);

  const renderSettingTab = () => {
    switch (tab) {
      case 1: return <ProfileTab st={st} set={updateState} currentAge={currentAge} />;
      case 2: return <IncomeTab st={st} set={updateState} taxResult={taxResult} timeline={timeline} />;
      case 3: return <CashflowTab st={st} set={updateState} />;
      case 4: return <PortfolioTab st={st} set={updateState} />;
      case 5: return <AccountsTab st={st} set={updateState} />;
      case 6: return <LifeTab st={st} set={updateState} timeline={timeline} />;
      case 7: return <PensionTab st={st} set={updateState} />;
      case 8: return <SimulationTab st={st} set={updateState} />;
      case 9: return <FormulaTab />;
      case 10: return <SaveTab st={st} set={updateState} />;
      default: return null;
    }
  };

  return (
    <div className="app-container">
      <header style={{ marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--text-main)", display: "flex", alignItems: "center", gap: 10 }}>
            <i className="ti ti-chart-line" style={{ color: "var(--primary)", fontSize: 26 }} />
            {st.name ? `${st.name}の` : ""}資産ライフプランシミュレーター
          </h1>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ background: "var(--bg-card)", padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13, fontWeight: 700 }}>
              現在地: {currentAge}歳
            </div>
            <button 
              onClick={() => {
                if (window.confirm("すべての入力・設定データを初期状態にリセットしますか？")) {
                  dispatch(resetSettings());
                }
              }}
              style={{
                background: "none",
                border: "1px solid #ef4444",
                color: "#ef4444",
                padding: "6px 12px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s"
              }}
            >
              <i className="ti ti-rotate" style={{ marginRight: 4 }} />設定リセット
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginTop: 16 }}>
          <div style={{ background: "var(--bg-card)", padding: 14, borderRadius: 10, border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>現在の総資産</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "var(--primary)", marginTop: 4 }}>{fmtSmart(totalAssets)}</div>
          </div>
          <div style={{ background: "var(--bg-card)", padding: 14, borderRadius: 10, border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>世帯総年収</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#10b981", marginTop: 4 }}>{fmtSmart(totalAnnualIncome)}</div>
          </div>
          <div style={{ background: "var(--bg-card)", padding: 14, borderRadius: 10, border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>目標金額</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#f59e0b", marginTop: 4 }}>{fmtSmart(st.goalAmount)}</div>
          </div>
        </div>
      </header>

      <div className="tab-list-wrapper">
        <div className="tab-list" role="tablist" ref={listRef}>
          {TABS.map((t, i) => (
            <button
              key={t.key}
              onClick={() => setTab(i)}
              className={`tab-button ${tab === i ? "active" : ""}`}
            >
              <i className={`ti ${t.icon}`} />
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {tab === 0 ? (
        <div className="content-main">
          <DashboardTab />
        </div>
      ) : (
        <div className="main-layout">
          <div className="content-main" style={{ background: "var(--bg-card)", padding: 24, borderRadius: 16, border: "2px solid var(--border)", boxShadow: "var(--shadow-md)" }}>
            {renderSettingTab()}
          </div>

          <div className="sticky-sidebar">
            <div style={{ background: "var(--bg-card)", padding: 20, borderRadius: 16, border: "2px solid var(--border)", boxShadow: "var(--shadow-md)" }}>
              <h3 style={{ margin: "0 0 12px 0", fontSize: 15, fontWeight: 800 }}>シミュレーション結果</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13 }}>
                <div>予測達成年齢: <span style={{ fontWeight: 800 }}>{simulationResult.achievedAge ?? "未達"}</span></div>
                <div>最低資産残高: <span style={{ fontWeight: 800 }}>{fmtSmart(simulationResult.minWealth)}</span></div>
              </div>
              <button className="btn-primary" onClick={() => setTab(0)} style={{ width: "100%", marginTop: 16 }}>グラフを見る</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
