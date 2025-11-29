# API リファレンス

バックエンドが提供する REST API の仕様。

> **注意**: API 内部では `allowed-tools` を配列として扱いますが、SKILL.md 出力時にはカンマ区切り文字列に変換されます。

## エンドポイント一覧

| メソッド | パス | 説明 |
|---------|------|------|
| GET | /api/config | 設定情報を取得 |
| GET | /api/skills | スキル一覧を取得 |
| GET | /api/skills/:id | 単一スキルを取得 |
| POST | /api/skills | 新規スキルを作成 |
| PUT | /api/skills/:id | スキルを更新 |
| POST | /api/skills/:id/validate | スキルをバリデート |

## GET /api/config

skillsRoot や環境情報を返す。

### レスポンス

```json
{
  "skillsRoot": "/path/to/.claude/skills",
  "mode": "project"
}
```

## GET /api/skills

スキル一覧を返す（name + description 中心）。

### レスポンス

```json
{
  "skills": [
    { "id": "git-reviewer", "name": "git-reviewer", "description": "PRをレビューする" },
    { "id": "code-explainer", "name": "code-explainer", "description": "コードを説明する" }
  ]
}
```

> `name` は小文字・数字・ハイフンのみ（最大64文字）。

## GET /api/skills/:id

1 つのスキルを Skill モデル + Graph データとして返す。

### レスポンス

```json
{
  "id": "git-reviewer",
  "frontmatter": {
    "name": "git-reviewer",
    "description": "PRをレビューする",
    "allowed-tools": ["Read", "Bash"]
  },
  "sections": {
    "instructions": "## 指示\n...",
    "examples": "## 例\n..."
  },
  "graph": {
    "version": 1,
    "nodes": [...],
    "edges": [...]
  }
}
```

> `allowed-tools` は API では配列、SKILL.md 出力時は `"Read, Bash"` 形式に変換。

## POST /api/skills

新規スキルを作成する。

### リクエスト

```json
{
  "id": "new-skill",
  "frontmatter": {
    "name": "New Skill",
    "description": "説明"
  },
  "graph": {
    "nodes": [...],
    "edges": [...]
  }
}
```

### レスポンス

作成されたスキル（GET /api/skills/:id と同形式）。

## PUT /api/skills/:id

スキルを更新する。Graph から SKILL.md を再生成し保存する。

### リクエスト

```json
{
  "frontmatter": {
    "name": "Updated Name",
    "description": "更新された説明"
  },
  "graph": {
    "version": 2,
    "nodes": [...],
    "edges": [...]
  }
}
```

### レスポンス

更新されたスキル（GET /api/skills/:id と同形式）。

## POST /api/skills/:id/validate

スキルをバリデートし、結果を返す。グラフは変更しない。

### リクエスト

```json
{
  "graph": {
    "nodes": [...],
    "edges": [...]
  }
}
```

### レスポンス

```json
{
  "valid": true,
  "errors": [],
  "warnings": ["開始ノードが複数あります"]
}
```

## エラーレスポンス

すべてのエラーは以下の形式で返される。

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "エッジが存在しないノードを参照しています",
    "details": {
      "edgeId": "e1",
      "missingNodeId": "n999"
    }
  }
}
```

### エラーコード

| コード | HTTP ステータス | 説明 |
|-------|---------------|------|
| NOT_FOUND | 404 | スキルが存在しない |
| VALIDATION_ERROR | 400 | バリデーションエラー |
| VERSION_CONFLICT | 409 | バージョン競合 |
| INTERNAL_ERROR | 500 | サーバ内部エラー |
