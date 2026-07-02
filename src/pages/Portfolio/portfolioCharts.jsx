import { Card } from "../../components/common/Card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, AreaChart, Area, Legend } from "recharts";
import { fmtAxis, fmtSmart } from "../../utils/format";

export function PortfolioBarChart({ data }) {
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
              <Cell key={i} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function AssetAllocationTrendChart({ data, assetTypes }) {
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
              key={asset.key}
              type="monotone"
              dataKey={asset.label}
              stroke={asset.color}
              fill={asset.color}
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
