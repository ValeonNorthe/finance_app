import { useState, useEffect, useCallback, useMemo, useRef } from "react";
// 1. Reduxのフックとアクションをインポート
import { useSelector, useDispatch } from "react-redux";
import { updateSettings } from "./store/settingSlice";

import { TABS } from "./constants/tabs";
import { fmtSmart } from "./utils/format";
import { calcTaxFull } from "./engine/TaxEngine";
import { simulateWealth } from "./engine/SimulationEngine";

// タブコンポーネントのインポート
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
  const [tab, setTab] = useState(0); // 選択中のタブIDだけはローカルStateでOK

  // 2. 🌟 useState を廃止し、Reduxから設定データ(st)と送信関数(dispatch)を取得
  const st = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  // 3. 生年月日ベースの厳密な年齢計算
  const currentAge = useMemo(() => {
    if (!st.birthDate) return st.currentAge || 30;
    const birth = new Date(st.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }, [st.birthDate, st.currentAge]);

  // 4. シミュレーション期間の絶対時系列配列
  const timeline = useMemo(() => {
    const startAge = currentAge;
    const endAge = Math.max(startAge + (st.goalYears || 50), st.retirementAge || 85, 100);
    const years = [];
    let currentYear = new Date().getFullYear();

    for (let age = startAge; age <= endAge; age++) {
      years.push({ year: currentYear, age: age, index: age - startAge });
      currentYear++;
    }
    return years;
  }, [currentAge, st.goalYears, st.retirementAge]);

  // 5. 税制・手取りの集中計算
  const taxResult = useMemo(() => {
    return calcTaxFull(
      st.incomes,
      st.dependents,
      st.spouseIncome,
      st.includeSpouse,
      st.socialInsurance,
      0
    );
  }, [st.incomes, st.dependents, st.spouseIncome, st.includeSpouse, st.socialInsurance]);

  // 6. リアルタイム・シミュレーションの即時実行 (ダッシュボード連動の要)
  const simulationResult = useMemo(() => {
    return simulateWealth(st, timeline, taxResult);
  }, [st, timeline, taxResult]);

  // 7. サマリー表示用データ
  const totalAssets = useMemo(() => {
    const assetSum = Array.isArray(st.assets) ? st.assets.reduce((a, b) => a + (b.currentAmount || 0), 0) : 0;
    const accountSum = Array.isArray(st.accounts) ? st.accounts.reduce((a, b) => a + (b.balance || 0), 0) : 0;
    return assetSum + accountSum;
  }, [st.assets, st.accounts]);

  const totalAnnualIncome = useMemo(() => {
    if (!Array.isArray(st.incomes)) return 0;
    return st.incomes.reduce((a, b) => a + (b.active !== false ? (b.amount || 0) : 0), 0);
  }, [st.incomes]);

  // 8. 🌟 子タブ向けの更新ラッパー（既存の `set` と同じように動かしつつ裏ではReduxへdispatchする）
  const updateState = useCallback((updater) => {
    const payload = typeof updater === "function" ? updater(st) : updater;
    dispatch(updateSettings(payload));
  }, [dispatch, st]);

  // キーボードナビゲーション
  const listRef = useRef(null);
  const tabRefs = useRef([]);
  function handleKeyNav(e) {
    if (e.key === "ArrowRight") {
      setTab((s) => Math.min(s + 1, TABS.length - 1));
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      setTab((s) => Math.max(s - 1, 0));
      e.preventDefault();
    }
  }

  // 設定タブの動的レンダリング
  const renderSettingTab = () => {
    switch (tab) {
      case 1: return <ProfileTab st={st} set={updateState} currentAge={currentAge} />;
      case 2: return <IncomeTab st={st} set={updateState} taxResult={taxResult} timeline={timeline} />;
      case 3: return <CashflowTab st={st} set={updateState} simulationResult={simulationResult} />;
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
      {/* 1. ヘッダー */}
      <header style={{ marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--text-main)", display: "flex", alignItems: "center", gap: 10 }}>
            <i className="ti ti-chart-line" style={{ color: "var(--primary)", fontSize: 26 }} />
            {st.name ? `${st.name}の` : ""}資産ライフプランシミュレーター
          </h1>
          <div style={{ background: "var(--bg-card)", padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13, fontWeight: 700 }}>
            現在地: {currentAge}歳
          </div>
        </div>

        {/* KPIインジケーター */}
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

      {/* 2. タブバー */}
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

      {/* 3. メインコンテンツエリア（ここが肝） */}
      {tab === 0 ? (
        <div className="content-main">
          <DashboardTab st={st} simulationResult={simulationResult} timeline={timeline} />
        </div>
      ) : (
        <div className="main-layout">
          {/* 左側：設定フォーム */}
          <div className="content-main" style={{ background: "var(--bg-card)", padding: 24, borderRadius: 16, border: "2px solid var(--border)", boxShadow: "var(--shadow-md)" }}>
            {renderSettingTab()}
          </div>

          {/* 右側：固定サイドバー */}
          <div className="sticky-sidebar">
            <div style={{ background: "var(--bg-card)", padding: 20, borderRadius: 16, border: "2px solid var(--border)", boxShadow: "var(--shadow-md)" }}>
              <h3 style={{ margin: "0 0 12px 0", fontSize: 15, fontWeight: 800 }}>シミュレーション結果</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13 }}>
                <div>予測達成年齢: <span style={{ fontWeight: 800 }}>{simulationResult?.achievedAge || "未達"}</span></div>
                <div>老後残高: <span style={{ fontWeight: 800 }}>{fmtSmart(simulationResult?.minWealth || 0)}</span></div>
              </div>
              <button className="btn-primary" onClick={() => setTab(0)} style={{ width: "100%", marginTop: 16 }}>グラフを見る</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}