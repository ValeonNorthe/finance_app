import { useSelector } from "react-redux";
import { Card } from "../../components/common/Card.jsx";
import { Metric } from "../../components/common/Metric.jsx";
import { fmtSmart } from "../../utils/format";
import {
  selectSettings,
  selectDashboardKPI,
  selectChartData,
  selectPieData,
  selectAccChartData,
  selectMonthlyCashflowData,
} from "../../store/simulationSelectors";

import { AssetChart, AllocationChart, AccountChart, MonthlyCashflowChart } from "./dashboardCharts";

export const DashboardTab = () => {
  const st = useSelector(selectSettings) || {};
  const {
    taxResult = { takehome: 0, effectiveRate: "0.0" },
    totalCurrentAssets = 0,
    returnRate = 0,
    riskRate = 0,
    finalNominal = 0,
    finalReal = 0,
    progress = 0,
    goalAge = null,
    surplus = 0,
    currentAge = 30,
  } = useSelector(selectDashboardKPI);

  const chartData = useSelector(selectChartData) || [];
  const pieData = useSelector(selectPieData) || [];
  const accChartData = useSelector(selectAccChartData) || [];
  const monthlyCfData = useSelector(selectMonthlyCashflowData) || [];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10, marginBottom: 14 }}>
        <Metric label="目標金額" value={fmtSmart(st.goalAmount || 0)} sub={`${goalAge ? goalAge + "歳で達成予測" : "未達成"}`} color="var(--text-accent)" icon="ti-target" />
        <Metric label="現在の総資産" value={fmtSmart(totalCurrentAssets)} sub={`目標の${progress.toFixed(1)}%`} icon="ti-building-bank" />
        <Metric label="年間手取り" value={fmtSmart(taxResult.takehome)} sub={`実効税率 ${taxResult.effectiveRate}%`} icon="ti-cash" />
        <Metric label="月間余剰" value={fmtSmart(surplus)} sub="手取月収 − 支出" color={surplus > 0 ? "var(--text-success)" : "var(--text-danger)"} icon="ti-trending-up" />
        <Metric label="期待リターン" value={`${returnRate.toFixed(1)}%`} sub={`リスク ±${riskRate.toFixed(1)}%`} icon="ti-chart-pie" />
        <Metric label="予測最終資産" value={fmtSmart(finalNominal)} sub={`実質 ${fmtSmart(finalReal)}`} color={finalNominal >= (st.goalAmount || 0) ? "var(--text-success)" : "var(--text-warning)"} icon="ti-chart-line" />
      </div>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
          <span style={{ color: "var(--text-secondary)" }}>目標達成度 ({currentAge}歳 → 目標 {fmtSmart(st.goalAmount || 0)}円)</span>
          <span style={{ fontWeight: 500 }}>{progress.toFixed(1)}%</span>
        </div>
        <div style={{ height: 10, background: "var(--surface-1)", borderRadius: 5, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: progress >= 100 ? "#1baf7a" : "#2a78d6", borderRadius: 5 }} />
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <AssetChart chartData={chartData} goalAmount={st.goalAmount || 0} />
        <AllocationChart pieData={pieData} />
      </div>

      <Card title="月次キャッシュフロー概要" style={{ marginBottom: 14 }}>
        <MonthlyCashflowChart data={monthlyCfData} />
      </Card>

      <AccountChart accChartData={accChartData} goalAmount={st.goalAmount || 0} />
    </div>
  );
};
