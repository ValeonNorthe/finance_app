import { Card } from "../../components/common/Card";

export const FormulaItem = ({ label, formula }) => {
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: "var(--text-primary)",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 12,
          color: "var(--text-secondary)",
          background: "var(--surface-1)",
          padding: "6px 10px",
          borderRadius: "var(--radius)",
          fontFamily: "var(--font-mono)",
          lineHeight: 1.6,
        }}
      >
        {formula}
      </div>
    </div>
  );
}

export const DisclaimerBox = () => {
  return (
    <Card title="免責事項" accent>
      <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.8 }}>
        このアプリで使用する計算式は一般的な目安です。実際の税計算は個人の詳細な状況、
        特例措置、地方自治体ごとの差異等により異なります。
        重要な財務判断には必ず税理士・ファイナンシャルプランナー等の専門家にご相談ください。
      </div>
    </Card>
  );
}
