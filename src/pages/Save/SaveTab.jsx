import { useEffect, useState } from "react";

import { loadSavedProfiles } from "../Save/saveSelectors";
import {
  saveProfileAction,
  loadProfileAction,
  deleteProfileAction,
  renameProfileAction,
} from "../Save/saveActions";

import { SaveMessage, SaveRow } from "../Save/SaveComponents";
import { Card } from "../../components/common/Card.jsx";
import { makeDefault } from "../../models/defaultState";

export const SaveTab = ({ st, set }) => {
  const [saves, setSaves] = useState({});
  const [newName, setNewName] = useState("");
  const [editingKey, setEditingKey] = useState(null);
  const [editName, setEditName] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const loaded = await loadSavedProfiles();
      setSaves(loaded);
    })();
  }, []);

  const showMsg = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 2500);
  };

  return (
    <div>
      <SaveMessage msg={msg} />

      {/* 保存 */}
      <Card title="プロファイルを保存" style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="プロファイル名（例: 35歳・子2人プラン）"
            onKeyDown={(e) => e.key === "Enter" &&
              saveProfileAction(saves, newName, st, setSaves, showMsg, setNewName)
            }
            style={{ flex: 1 }}
          />
          <button
            onClick={() =>
              saveProfileAction(saves, newName, st, setSaves, showMsg, setNewName)
            }
            style={{
              padding: "0 18px",
              borderRadius: "var(--radius)",
              border: "0.5px solid var(--border-accent)",
              background: "var(--bg-accent)",
              color: "var(--text-accent)",
              cursor: "pointer",
              fontSize: 12,
              whiteSpace: "nowrap",
            }}
          >
            <i className="ti ti-device-floppy" style={{ marginRight: 4 }} />
            保存
          </button>
        </div>
      </Card>

      {/* 保存済み一覧 */}
      <Card title="保存済みプロファイル" style={{ marginBottom: 14 }}>
        {Object.keys(saves).length === 0 ? (
          <div style={{ fontSize: 12, color: "var(--text-muted)", padding: "12px 0" }}>
            保存済みプロファイルはありません
          </div>
        ) : (
          Object.entries(saves).map(([key, profile]) => (
            <SaveRow
              keyName={key}
              profile={profile}
              editingKey={editingKey}
              editName={editName}
              setEditName={setEditName}
              setEditingKey={setEditingKey}
              onLoad={(k) => loadProfileAction(k, saves, set, showMsg)}
              onRename={(k) =>
                renameProfileAction(k, editName, saves, setSaves, showMsg, setEditingKey, setEditName)
              }
              onDelete={(k) => deleteProfileAction(k, saves, setSaves, showMsg)}
            />
          ))
        )}
      </Card>

      {/* エクスポート・リセット */}
      <Card title="エクスポート・リセット">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {/* JSON Export */}
          <button
            onClick={() => {
              const blob = new Blob([JSON.stringify(st, null, 2)], {
                type: "application/json",
              });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = `finance_profile_${new Date()
                .toISOString()
                .slice(0, 10)}.json`;
              a.click();
            }}
            style={{
              padding: "8px 16px",
              borderRadius: "var(--radius)",
              border: "0.5px solid var(--border-strong)",
              background: "transparent",
              cursor: "pointer",
              color: "var(--text-secondary)",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <i className="ti ti-download" />
            JSONエクスポート
          </button>

          {/* JSON Import */}
          <label
            style={{
              padding: "8px 16px",
              borderRadius: "var(--radius)",
              border: "0.5px solid var(--border-strong)",
              background: "transparent",
              cursor: "pointer",
              color: "var(--text-secondary)",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <i className="ti ti-upload" />
            JSONインポート
            <input
              type="file"
              accept=".json"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                  try {
                    set(JSON.parse(ev.target.result));
                    showMsg("インポートしました");
                  } catch {
                    showMsg("ファイルが正しくありません");
                  }
                };
                reader.readAsText(file);
              }}
            />
          </label>

          {/* Reset */}
          <button
            onClick={() => {
              set(makeDefault());
              showMsg("設定をリセットしました");
            }}
            style={{
              padding: "8px 16px",
              borderRadius: "var(--radius)",
              border: "0.5px solid var(--border-danger)",
              background: "transparent",
              cursor: "pointer",
              color: "var(--text-danger)",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <i className="ti ti-refresh" />
            設定をリセット
          </button>
        </div>
      </Card>
    </div>
  );
}
