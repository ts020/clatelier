# スキルを作成する

新しいスキルを GUI から作成する手順。

## 前提条件

- Clatelier が起動していること
- ブラウザで `http://localhost:3123` にアクセスできること

## 手順

### 1. 新規作成画面を開く

左サイドバーの「New」ボタンをクリック、または `/skills/new` にアクセスする。

### 2. 基本情報を入力

| フィールド | 必須 | 説明 |
|-----------|------|------|
| ID | Yes | スキルの識別子（例: `git-reviewer`） |
| Name | Yes | 表示名（例: `Git Reviewer`） |
| Description | Yes | スキルの説明 |
| Allowed Tools | No | 使用を許可するツール（複数選択可） |

### 3. ノードを追加

React Flow キャンバスでノードを追加する。

1. 左パレットからノードタイプをドラッグ
2. キャンバスにドロップ
3. ノードをダブルクリックして内容を編集

### 4. エッジで接続

ノード間の依存関係を定義する。

1. 接続元ノードのハンドルをドラッグ
2. 接続先ノードにドロップ

### 5. 保存

「Save」ボタンをクリックすると：

- `skill.graph.json` が作成される
- `SKILL.md` が生成される

## 保存先

| モード | パス |
|-------|------|
| project | `./.claude/skills/<skill-id>/` |
| global | `~/.claude/skills/<skill-id>/` |

## 生成されるファイル

```
.claude/skills/git-reviewer/
├── SKILL.md           # Claude Code が読む
└── skill.graph.json   # GUI が管理
```

## ヒント

- ID は英数字とハイフンのみ使用可能
- Description は簡潔に（1-2 文）
- 最初は少ないノードから始め、徐々に拡張する
