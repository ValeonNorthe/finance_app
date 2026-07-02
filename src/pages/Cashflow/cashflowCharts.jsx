import { Card } from "../../components/common/Card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { fmt } from "../../utils/format";
import { SERIES_COLORS } from "../../constants/appData";

export function CashflowPieChart({ expPieData }) {
  return (
    <Card title="支出内訳（円グラフ）">
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={expPieData}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={70}
            labelLine={false}
            fontSize={10}
          >
            {expPieData.map((entry, i) => (
              <Cell key={i} fill={SERIES_COLORS[i % SERIES_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => `${fmt(v)}円`} />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
