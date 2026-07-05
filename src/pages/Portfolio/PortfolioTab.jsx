import { useState } from "react";
import { Card } from "../../components/common/Card.jsx";
import { NumInput } from "../../components/common/NumberInput.jsx";
import { Sl } from "../../components/common/Slider.jsx";
import { SegBtn } from "../../components/common/SegmentButton.jsx";
import { Metric } from "../../components/common/Metric.jsx";
import { fmtSmart } from "../../utils/format";
import { ASSET_TYPES, CURRENCIES } from "../../constants/appData";

import {
  selectPortfolioSummary,
  selectSortedAssetChartData,
  selectAssetAllocationTrend
} from "./portfolioSelectors";
import { selectAssetAllocationTrend } from "../../store/simulationSelectors";

import {
  updateAssetField,
  updateCashCurrency
} from "./portfolioActions";

import { PortfolioBarChart, AssetAllocationTrendChart } from "./portfolioCharts";

export const PortfolioTab = ({ st, set }) => {
  const [activeAsset, setActiveAsset] = useState(null);

<<<<<<< HEAD
  const summary = selectPortfolioSummary(st || {});
  const barChartData = selectSortedAssetChartData(st || {});
  const allocationTrendData = selectAssetAllocationTrend(st || {});
=======
  const summary = selectPortfolioSummary(st);
  const barChartData = selectSortedAssetChartData(st);
  const allocationTrendData = selectAssetAllocationTrend(st);
>>>>>>> eb5fa1b0ea88092afdb1ee7f87a84c0fb7ad3e10

  return (
    <div>
      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 14 }}>
        <Metric label="総資産" value={fmtSmart(summary.totalAmount || 0) + "円"} icon="ti-building-bank" />
        <Metric label="期待リターン" value={`${(summary.returnRate || 0).toFixed(2)}%`} color="var(--text-success)" icon="ti-trending-up" />
        <Metric label="ポートフォリオリスク" value={`±${(summary.riskRate || 0).toFixed(2)}%`} color="var(--text-warning)" icon="ti-alert-triangle" />
      </div>

      {/* 配分比率チェック */}
      {summary.totalRatio !== 100 && (
        <div style={{
          padding: "8px 12px",
          background: "var(--bg-warning)",
          border: "0.5px solid var(--border-warning)",
          borderRadius: "var(--radius)",
          fontSize: 13,
          color: "var(--text-warning)",
          marginBottom: 12
        }}>
          <i className="ti ti-alert-triangle" aria-hidden="true" style={{ marginRight: 6 }} />
          配分比率の合計が{summary.totalRatio}%です（100%になるよう調整してください）
        </div>
      )}

      {/* アセット一覧 */}
      {(st.assets || []).map((asset, i) => {
        const info = ASSET_TYPES[i] || { key: 'unknown', label: 'Unknown', color: '#999' };
        const isActive = activeAsset === i;

        return (
          <div key={info.key} style={{ marginBottom: 8 }}>
            <div
              onClick={() => setActiveAsset(isActive ? null : i)}
              style={{
                borderRadius: isActive ? "12px 12px 0 0" : 12,
                border: isActive ? `1.5px solid ${info.color}` : "0.5px solid var(--border)",
                borderBottom: isActive ? "none" : undefined,
                padding: "12px 16px",
                background: "var(--surface-2)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
                transition: "all 0.15s"
              }}
            >
              <div style={{ width: 14, height: 14, borderRadius: 3, background: info.color }} />
              <span style={{ fontWeight: 500, fontSize: 14, flex: 1 }}>{info.label}</span>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {fmtSmart(asset.currentAmount)}円 / {asset.ratio}%
              </span>
              <span style={{ fontSize: 11, color: "var(--text-success)" }}>リターン {asset.expectedReturn}%</span>
              <i className={`ti ${isActive ? "ti-chevron-up" : "ti-chevron-down"}`} aria-hidden="true"
                style={{ fontSize: 16, color: "var(--text-muted)" }} />
            </div>

            {isActive && (
              <div style={{
                border: `1.5px solid ${info.color}`,
                borderTop: "none",
                borderRadius: "0 0 12px 12px",
                padding: "14px 16px",
                background: "var(--surface-2)"
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <NumInput
                    label="現在の保有額"
                    value={asset.currentAmount}
                    onChange={v => updateAssetField(set, i, "currentAmount", v)}
                    suffix="円"
                    step={10000}
                  />

                  <Sl
                    label="目標比率"
                    min={0}
                    max={100}
                    step={1}
                    value={asset.ratio}
                    onChange={v => updateAssetField(set, i, "ratio", v)}
                    unit="%"
                  />

                  <Sl
                    label="期待リターン"
                    min={-5}
                    max={40}
                    step={0.1}
                    value={asset.expectedReturn}
                    onChange={v => updateAssetField(set, i, "expectedReturn", v)}
                    unit="%"
                  />

                  <Sl
                    label="リスク（標準偏差）"
                    min={0}
                    max={60}
                    step={0.5}
                    value={asset.riskRate}
                    onChange={v => updateAssetField(set, i, "riskRate", v)}
                    unit="%"
                  />

                  {info.key === "stock" && (
                    <>
                      <Sl
                        label="配当率"
                        min={0}
                        max={15}
                        step={0.1}
                        value={asset.dividendRate || 0}
                        onChange={v => updateAssetField(set, i, "dividendRate", v)}
                        unit="%"
                      />

                      <Sl
                        label="配当リスク率"
                        min={0}
                        max={50}
                        step={0.5}
                        value={asset.dividendRisk || 0}
                        onChange={v => updateAssetField(set, i, "dividendRisk", v)}
                        unit="%"
                      />
                    </>
                  )}
                </div>

                {info.key === "stock" && (
                  <div style={{
                    padding: "6px 10px",
                    background: "var(--bg-accent)",
                    borderRadius: "var(--radius)",
                    fontSize: 11,
                    color: "var(--text-accent)",
                    marginTop: 6
                  }}>
                    年間配当予測: 約{fmtSmart(Math.round(asset.currentAmount * (asset.dividendRate || 0) / 100))}円
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* 通貨分散 */}
      <Card title="現金・預金の通貨分散" style={{ marginBottom: 14, marginTop: 4 }}>
        {(st.cashCurrencies || []).map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <select
              value={c.currency}
              onChange={e => updateCashCurrency(set, i, "currency", e.target.value)}
              style={{ width: 80, fontSize: 12 }}
            >
              {CURRENCIES.map(cur => <option key={cur}>{cur}</option>)}
            </select>

            <input
              type="range"
              min={0}
              max={100}
              value={c.ratio}
              style={{ flex: 1 }}
              onChange={e => updateCashCurrency(set, i, "ratio", Number(e.target.value))}
            />

            <span style={{ width: 36, fontSize: 13, fontWeight: 500, textAlign: "right" }}>{c.ratio}%</span>
          </div>
        ))}
      </Card>

      {/* 棒グラフ */}
      <PortfolioBarChart data={barChartData} />

      {/* 資産配分推移グラフ */}
      <AssetAllocationTrendChart data={allocationTrendData} assetTypes={ASSET_TYPES} />
    </div>
  );
}
