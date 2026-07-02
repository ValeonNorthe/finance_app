export const Card = ({ title, children, style, accent, onClick, className = "" }) => (
  <div 
    onClick={onClick}
    className={`selectable-card ${accent ? "active" : ""} ${className}`}
    style={{
      // 既存の背景色・境界線のベースを活かしつつ変数をモダンに整理
      background: "var(--bg-card)", 
      border: `2px solid ${accent ? "var(--primary)" : "var(--border)"}`,
      borderRadius: 14,
      padding: "20px",
      transition: "var(--transition)", // App.cssで定義した共通のアニメーション設定
      cursor: onClick ? "pointer" : "default",
      ...style
    }}
  >
    {title && (
      <div style={{
        fontSize: 14,
        fontWeight: 700,
        color: accent ? "var(--primary)" : "var(--text-main)", // 選択時は文字色も少し強調
        marginBottom: 16,
        display: "flex",
        alignItems: "center",
        gap: 8,
        transition: "var(--transition)"
      }}>
        {title}
      </div>
    )}
    <div style={{ width: "100%" }}>
      {children}
    </div>
  </div>
);