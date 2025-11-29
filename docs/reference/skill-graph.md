# SkillGraph リファレンス

SkillGraph は **Clatelier 独自の内部データモデル**。GUI と Chat 双方が操作する「単一ソース・オブ・トゥルース」として機能する。

> **注意**: SkillGraph は Claude Code の公式仕様ではなく、Clatelier が視覚的編集を実現するために導入した中間表現です。最終的には [SKILL.md 形式](./skill-md.md) に変換されます。

## 設計意図

```
SkillGraph (内部表現)     →  変換  →  SKILL.md (Claude Code 公式形式)
  - ノード/エッジ構造              - YAML frontmatter
  - 視覚的編集に最適化              - Markdown 本文
  - GUI/Chat で共有                - Claude Code が読み込む
```

## 構造

### グラフメタ情報

| フィールド | 型 | 説明 |
|-----------|------|------|
| skillId | string | スキルの一意識別子（小文字・数字・ハイフンのみ） |
| version | number | 単調増加のバージョン番号 |
| updatedAt | timestamp | 更新タイムスタンプ |

### ノード（Node）

| フィールド | 型 | 説明 |
|-----------|------|------|
| id | string | ノードの一意識別子 |
| type | SkillGraphNodeType | ノード種別 |
| data.label | string | 表示ラベル |
| data.markdown | string? | Markdown テキスト（任意） |
| data.toolName | string? | ツール名（tool ノードのみ） |

### ノード種別（SkillGraphNodeType）

| 種別 | 説明 | SKILL.md での表現 |
|------|------|------------------|
| instruction | 手順や方針を表現 | `## 指示` セクション内の項目 |
| example | 入力／出力例 | `## 例` セクション |
| tool | 使用するツール | `allowed-tools` に追加 |
| decision | 条件分岐表現（将来拡張） | 条件付きの指示 |

### エッジ（Edge）

| フィールド | 型 | 説明 |
|-----------|------|------|
| id | string | エッジの一意識別子 |
| source | string | 接続元ノード ID |
| target | string | 接続先ノード ID |
| metadata | object? | 条件式などのメタデータ（任意） |

## 不変条件

SkillGraph は以下の不変条件を常に満たす必要がある。

| 条件 | 説明 | 違反時の動作 |
|------|------|------------|
| エッジの参照整合性 | すべてのエッジは存在するノード ID を参照していること | Operation 適用を拒否 |
| ID の一意性 | ノード ID とエッジ ID は集合内で一意であること | Operation 適用を拒否 |
| 開始ノードの存在 | グラフ全体は 1 つ以上の開始ノードを持つ | バリデーションエラー |
| DAG 制約（オプション） | 有向閉路を禁止（フローとして扱う場合） | 設計オプションとして検討 |

## JSON 構造例

```json
{
  "version": 1,
  "nodes": [
    { "id": "n1", "type": "instruction", "data": { "label": "ユーザー意図を確認" } },
    { "id": "n2", "type": "tool", "data": { "label": "Read", "toolName": "Read" } }
  ],
  "edges": [
    { "id": "e1", "source": "n1", "target": "n2" }
  ]
}
```

## ファイル配置

各スキルディレクトリ内に `skill.graph.json` として保存される。

```
.claude/skills/<skill-id>/
├── SKILL.md           # Claude Code が読む公式フォーマット
└── skill.graph.json   # Clatelier の内部表現（任意）
```

## 変換ルール

SkillGraph → SKILL.md の変換：

1. **frontmatter 生成**
   - `skillId` → `name`
   - tool ノードの `toolName` を収集 → `allowed-tools`（カンマ区切り）

2. **本文生成**
   - instruction ノード → `## 指示` セクションの項目
   - example ノード → `## 例` セクション
   - エッジ順序 → 項目の並び順

## 関連ドキュメント

- [SKILL.md 形式](./skill-md.md) - Claude Code 公式フォーマット
- [Operations](./operations.md) - SkillGraph への編集操作
