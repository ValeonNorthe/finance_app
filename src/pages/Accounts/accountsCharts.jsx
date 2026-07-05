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

export function AccountsAreaChart({ data, accounts, viewMode = "overall", granularity = "yearly" }) {
  // Filter data based on granularity
  const filteredData = granularity === "monthly" 
    ? data 
    : data.filter((_, i) => i % 12 === 0 || i === data.length - 1);

  return (
    <Card title={`口座残高推移（${granularity === "monthly" ? "月次" : "年齢"}軸）`}>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={filteredData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
          <XAxis dataKey="label" tick={{ fontSize: 9 }} />
          <YAxis tick={{ fontSize: 9 }} tickFormatter={fmtAxis} width={52} />
          <Tooltip content={<CustomTooltip />} />

          {viewMode === "overall" ? (
            // Overall total view
            <Area
              type="monotone"
              dataKey="total"
              stroke="#2a78d6"
              fill="#2a78d6"
              fillOpacity={0.15}
              strokeWidth={2}
            />
          ) : (
            // Individual account view
            accounts.map((acc, i) => {
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
            })
          )}
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
