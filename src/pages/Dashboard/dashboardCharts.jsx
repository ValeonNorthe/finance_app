import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import { CustomTooltip } from "../../components/common/CustomTooltip";
import { fmtAxis } from "../../utils/format";
import { Card } from "../../components/common/Card.jsx";
export const AssetChart = ({ chartData, goalAmount }) => (
  <Card title="資産推移シミュレーション（年齢軸）">
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
        <XAxis dataKey="label" tick={{ fontSize: 9 }} />
        <YAxis tick={{ fontSize: 9 }} tickFormatter={fmtAxis} width={52} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="楽観" stroke="#1baf7a" fill="#1baf7a" fillOpacity={0.06} strokeWidth={1} strokeDasharray="4 2" />
        <Area type="monotone" dataKey="名目資産" stroke="#2a78d6" fill="#2a78d6" fillOpacity={0.12} strokeWidth={2} />
        <Area type="monotone" dataKey="悲観" stroke="#e34948" fill="#e34948" fillOpacity={0.06} strokeWidth={1} strokeDasharray="4 2" />
        <ReferenceLine y={goalAmount} stroke="#c98500" strokeDasharray="5 3" />
      </AreaChart>
    </ResponsiveContainer>
  </Card>
);

export const AllocationChart = ({ pieData }) => (
  <Card title="アセットアロケーション">
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie 
          data={pieData} 
          dataKey="value" 
          nameKey="name" 
          cx="50%" 
          cy="50%" 
          outerRadius={55}
          label={({ name, value }) => `${name}: ${value}%`}
          labelLine={true}
          style={{ fontSize: 10, fontWeight: 500 }}
        >
          {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
        </Pie>
        <Tooltip formatter={(v) => `${v}%`} />
      </PieChart>
    </ResponsiveContainer>
  </Card>
);

export const MonthlyCashflowChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={120}>
    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
      <XAxis type="number" tick={{ fontSize: 9 }} tickFormatter={(v) => `${Math.round(v / 10000)}万`} />
      <YAxis type="category" dataKey="name" hide={true} />
      <Tooltip formatter={(v) => `${v.toLocaleString()}円`} />
      <Legend wrapperStyle={{ fontSize: 10 }} />
      <Bar dataKey="手取り月収" fill="#1baf7a" radius={[0, 4, 4, 0]} />
      <Bar dataKey="固定費" stackId="expense" fill="#e34948" />
      <Bar dataKey="変動費" stackId="expense" fill="#eda100" />
      <Bar dataKey="医療費" stackId="expense" fill="#4a3aa7" />
      <Bar dataKey="投資額" stackId="expense" fill="#2a78d6" />
      <Bar dataKey="貯蓄余剰" stackId="expense" fill="#73726c" radius={[0, 4, 4, 0]} />
      <Bar dataKey="赤字" stackId="expense" fill="#000000" radius={[0, 4, 4, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

export const AccountChart = ({ accChartData, goalAmount }) => (
  <Card title="口座・資産推移（時間経過）">
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={accChartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
        <XAxis dataKey="label" tick={{ fontSize: 9 }} />
        <YAxis tick={{ fontSize: 9 }} tickFormatter={fmtAxis} width={52} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="資産" stroke="#2a78d6" fill="#2a78d6" fillOpacity={0.15} strokeWidth={2} />
        <ReferenceLine y={goalAmount} stroke="#c98500" strokeDasharray="4 2" />
      </AreaChart>
    </ResponsiveContainer>
  </Card>
);
