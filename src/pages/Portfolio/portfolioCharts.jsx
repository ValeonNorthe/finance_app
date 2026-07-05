import { Card } from "../../components/common/Card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, AreaChart, Area, Legend } from "recharts";
import { fmtAxis, fmtSmart } from "../../utils/format";

export function PortfolioBarChart({ data }) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Card title="現在の保有額（比較）">
        <div style={{ padding: 20, textAlign: "center", color: "var(--text-muted)", fontSize: 12 }}>
          データがありません
        </div>
      </Card>
    );
  }

  return (
    <Card title="現在の保有額（比較）">
      <ResponsiveContainer width="100%" height={160}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 60, right: 20 }}
        >
          <XAxis type="number" tick={{ fontSize: 9 }} tickFormatter={fmtAxis} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={60} />
          <Tooltip formatter={v => fmtSmart(v) + "円"} />

          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.color || "#999"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function AssetAllocationTrendChart({ data, assetTypes }) {
<<<<<<< HEAD
  if (!data || !Array.isArray(data) || data.length === 0 || !assetTypes || !Array.isArray(assetTypes)) {
    return (
      <Card title="資産配分比率の推移（年齢軸）">
        <div style={{ padding: 20, textAlign: "center", color: "var(--text-muted)", fontSize: 12 }}>
          データがありません
        </div>
      </Card>
    );
  }

=======
>>>>>>> eb5fa1b0ea88092afdb1ee7f87a84c0fb7ad3e10
  return (
    <Card title="資産配分比率の推移（年齢軸）">
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <XAxis dataKey="label" tick={{ fontSize: 9 }} />
          <YAxis tick={{ fontSize: 9 }} tickFormatter={(v) => `${v}%`} width={40} />
          <Tooltip formatter={(v) => `${v.toFixed(1)}%`} />
          <Legend />

          {assetTypes.map((asset, i) => (
            <Area
<<<<<<< HEAD
              key={asset.key || i}
              type="monotone"
              dataKey={asset.label}
              stroke={asset.color || "#999"}
              fill={asset.color || "#999"}
=======
              key={asset.key}
              type="monotone"
              dataKey={asset.label}
              stroke={asset.color}
              fill={asset.color}
>>>>>>> eb5fa1b0ea88092afdb1ee7f87a84c0fb7ad3e10
              fillOpacity={0.15}
              strokeWidth={1.5}
              stackId="stack"
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
