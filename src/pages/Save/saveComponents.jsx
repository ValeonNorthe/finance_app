export function SaveMessage({ msg }) {
  if (!msg) return null;

  return (
    <div
      style={{
        padding: "8px 14px",
        background: "var(--bg-success)",
        border: "0.5px solid var(--border-success)",
        borderRadius: "var(--radius)",
        color: "var(--text-success)",
        fontSize: 12,
        marginBottom: 12,
      }}
    >
      <i className="ti ti-check" style={{ marginRight: 6 }} />
      {msg}
    </div>
  );
}

export function SaveRow({
  profile,
  keyName,
  editingKey,
  editName,
  setEditName,
  setEditingKey,
  onLoad,
  onRename,
  onDelete,
}) {
  return (
    <div
      key={keyName}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 12px",
        background: "var(--surface-1)",
        borderRadius: "var(--radius)",
        marginBottom: 8,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {editingKey === keyName ? (
          <div style={{ display: "flex", gap: 6 }}>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onRename(keyName)}
              style={{ flex: 1, fontSize: 12 }}
            />
            <button
              onClick={() => onRename(keyName)}
              style={{
                background: "none",
                border: "0.5px solid var(--border-accent)",
                borderRadius: "var(--radius)",
                color: "var(--text-accent)",
                cursor: "pointer",
                padding: "4px 8px",
                fontSize: 11,
              }}
            >
              確定
            </button>
            <button
              onClick={() => setEditingKey(null)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
            >
              ✕
            </button>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{profile.name}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{profile.savedAt}</div>
          </>
        )}
      </div>

      <button
        onClick={() => onLoad(keyName)}
        title="読み込み"
        style={{
          background: "none",
          border: "0.5px solid var(--border-strong)",
          borderRadius: "var(--radius)",
          cursor: "pointer",
          color: "var(--text-secondary)",
          padding: "5px 10px",
          fontSize: 11,
        }}
      >
        <i className="ti ti-upload" style={{ marginRight: 4 }} />
        読込
      </button>

      <button
        onClick={() => {
          setEditingKey(keyName);
          setEditName(profile.name);
        }}
        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 16 }}
      >
        <i className="ti ti-edit" />
      </button>

      <button
        onClick={() => onDelete(keyName)}
        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-danger)", fontSize: 16 }}
      >
        <i className="ti ti-trash" />
      </button>
    </div>
  );
}
