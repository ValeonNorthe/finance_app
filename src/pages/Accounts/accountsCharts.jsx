import { Card } from "../../components/common/Card";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

import { fmtAxis } from "../../utils/format";
import { ACC_TYPES, SERIES_COLORS } from "../../constants/appData";
import { CustomTooltip } from "../../components/common/CustomTooltip";

export function AccountsAreaChart({ data, accounts }) {
  return (
    <Card title="口座残高推移（年齢軸）">
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
          <XAxis dataKey="label" tick={{ fontSize: 9 }} />
          <YAxis tick={{ fontSize: 9 }} tickFormatter={fmtAxis} width={52} />
          <Tooltip content={<CustomTooltip />} />

          {accounts.map((acc, i) => {
            const color =
              ACC_TYPES.find(t => t.key === acc.type)?.color ||
              SERIES_COLORS[i % SERIES_COLORS.length];

            return (
              <Area
                key={acc.id}
                type="monotone"
                dataKey={acc.label}
                stroke={color}
                fill={color}
                fillOpacity={0.1}
                strokeWidth={1.5}
                stackId="stack"
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
