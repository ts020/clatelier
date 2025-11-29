# アーキテクチャ

Clatelier のシステム構成と設計思想。

## コンポーネント構成

```
┌─────────────────────────────────────────────────────┐
│                    ブラウザ                          │
│  ┌───────────────────────────────────────────────┐  │
│  │           フロントエンド（React + Vite）         │  │
│  │  ┌─────────────┐  ┌─────────────────────────┐ │  │
│  │  │ SidebarNav  │  │  SkillFlowEditor        │ │  │
│  │  │ スキル一覧   │  │  (React Flow)           │ │  │
│  │  └─────────────┘  └─────────────────────────┘ │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                          ↓ HTTP
┌─────────────────────────────────────────────────────┐
│               バックエンド（Node.js）                 │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │
│  │   routes/   │  │  services/  │  │  shared/   │  │
│  │  skills.ts  │→ │skillService │→ │graphMapper │  │
│  └─────────────┘  └─────────────┘  └────────────┘  │
└─────────────────────────────────────────────────────┘
                          ↓ ファイル I/O
┌─────────────────────────────────────────────────────┐
│                  ファイルシステム                     │
│  .claude/skills/<skill-id>/                         │
│  ├── SKILL.md           ← Claude Code 用            │
│  └── skill.graph.json   ← GUI/Chat 用              │
└─────────────────────────────────────────────────────┘
```

## 4 層構成

### 1. CLI ラッパー

エントリーポイント。

- Node バージョンチェック（>= 18）
- skillsRoot パス決定（`--project` / `--global`）
- バックエンドサーバ起動
- ブラウザ自動オープン

### 2. バックエンド

Express/Fastify ベースの HTTP サーバ。

- SKILL.md のファイル I/O
- YAML frontmatter + Markdown のパース／シリアライズ
- SkillGraph との相互変換
- 完全ローカル動作（認証なし）

### 3. フロントエンド

Vite ベースの React SPA。

- React Router によるルーティング
- React Flow による視覚的グラフ編集
- Zustand / React Query による状態管理

### 4. 共有ライブラリ（Shared）

フロント/バックエンド共通のロジック。

- 型定義（`Skill`, `SkillGraph`, `Operation`）
- `parseSkillMd` / `serializeSkillMd`
- `skillToGraph` / `graphToSkill`

## 起動フロー

```
1. npx clatelier --project
       ↓
2. CLI: Node バージョンチェック
       ↓
3. CLI: skillsRoot 決定 → ./.claude/skills
       ↓
4. バックエンド起動 (localhost:3123)
       ↓
5. フロントエンド静的配信開始
       ↓
6. ブラウザ自動オープン
       ↓
7. GET /api/skills → 一覧表示
       ↓
8. スキル選択 → GET /api/skills/:id
       ↓
9. React Flow でグラフ編集
       ↓
10. 保存 → PUT /api/skills/:id → SKILL.md 生成
```

## 単一ソース・オブ・トゥルース

SkillGraph（`skill.graph.json`）を真実の源とする。

- GUI で編集 → Graph 更新 → SKILL.md 再生成
- Chat で編集 → Graph 更新 → SKILL.md 再生成

SKILL.md は常に Graph から導出される。直接編集は想定しない。

## ディレクトリ構成

```
clatelier/
├── package.json
├── packages/
│   └── shared/           # 共通ライブラリ
│       └── src/
│           ├── types/
│           ├── skillParser.ts
│           └── graphMapper.ts
└── apps/
    ├── cli/              # CLI エントリ
    ├── backend/          # HTTP サーバ
    └── web/              # React SPA
```

## 非機能要件

| 項目 | 要件 |
|------|------|
| インストール | npx で即時実行（グローバル install 不要） |
| ランタイム | Node.js 18+ |
| ネットワーク | 完全ローカル動作（外部通信なし） |
| プラットフォーム | Mac / Linux / Windows |

---

## 設計原則

### 単一責任の原則（SRP）
- 1ファイル = 1責務
- 1関数 = 1処理
- 1コンポーネント = 1UI責務

**なぜ？** 変更理由が1つだけになるため、保守性が向上する。

### 依存性逆転の原則（DIP）
```typescript
// ❌ 具体に依存
class SkillService {
  private storage = new FileStorage();
}

// ✅ 抽象に依存
interface Storage {
  save(data: unknown): Promise<void>;
}

class SkillService {
  constructor(private storage: Storage) {}
}
```

**なぜ？** テスト時にモックを注入でき、実装の差し替えが容易になる。

### 関心の分離
```
UI層（components/）
    ↓ props/hooks
ロジック層（services/）
    ↓ interface
データ層（storage/api/）
```

**なぜ？** 各層を独立して変更・テストできる。

## コンポーネント設計パターン

### Presentational / Container パターン

**なぜ採用したか？**
- UIとロジックを分離することで再利用性が向上
- テストが書きやすい（Presentationalは純粋なUI）

```typescript
// Presentational: 見た目のみ
function SkillCard({ skill, onEdit }: SkillCardProps) {
  return (
    <div>
      <h3>{skill.name}</h3>
      <button onClick={onEdit}>Edit</button>
    </div>
  );
}

// Container: ロジックを持つ
function SkillCardContainer({ skillId }: { skillId: string }) {
  const skill = useSkill(skillId);
  const { editSkill } = useSkillActions();

  return <SkillCard skill={skill} onEdit={() => editSkill(skillId)} />;
}
```

### Compound Component パターン

**なぜ採用したか？**
- 柔軟な組み合わせが可能
- 親子間の暗黙的なコンテキスト共有

```typescript
<SkillEditor>
  <SkillEditor.Header />
  <SkillEditor.Canvas />
  <SkillEditor.Sidebar />
</SkillEditor>
```

## 状態管理の選択理由

| 種別 | 管理場所 | 理由 |
|------|----------|------|
| UI状態 | useState | ローカルで完結、シンプル |
| サーバー状態 | React Query | キャッシュ、再取得、楽観的更新 |
| グローバル状態 | Zustand | 軽量、ボイラープレート少 |
| URL状態 | Router | ブックマーク可能、共有可能 |

**なぜReduxではないか？**
- ボイラープレートが多い
- 中規模プロジェクトには過剰
- Zustandで十分な機能を提供
