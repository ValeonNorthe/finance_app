import { Card } from "../../components/common/Card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
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
