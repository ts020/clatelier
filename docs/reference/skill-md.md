# SKILL.md 形式リファレンス

Claude Code が読み込むスキルファイルの公式フォーマット。

## 概要

SKILL.md は YAML frontmatter と Markdown 本文で構成される。Claude Code はこのファイルを自動的に発見し、コンテキストに応じてスキルを実行する。

## ファイル構造

```yaml
---
name: skill-name
description: スキルの説明と使用時機
allowed-tools: Tool1, Tool2, Tool3
---

# スキルタイトル

## 指示

詳細な手順

## 例

具体的な使用例
```

## Frontmatter フィールド

### 必須フィールド

| フィールド | 制約 | 説明 |
|-----------|------|------|
| `name` | 小文字・数字・ハイフンのみ、最大64文字 | スキルの識別子 |
| `description` | 最大1024文字 | スキルの説明。**トリガー用語を含める** |

### オプションフィールド

| フィールド | 形式 | 説明 |
|-----------|------|------|
| `allowed-tools` | カンマ区切り文字列 | 使用可能なツールを制限 |

## name フィールド

```yaml
# 有効な例
name: code-reviewer
name: git-commit-helper
name: pdf-extractor

# 無効な例
name: Code Reviewer      # スペース不可
name: CodeReviewer       # 大文字不可
name: code_reviewer      # アンダースコア不可
```

## description フィールド

Claude がスキルを自動発見するための重要なフィールド。

### 書き方のポイント

1. **何をするか**を明記
2. **いつ使うか**を明記
3. **トリガー用語**を含める

```yaml
# 良い例
description: |
  PDF ファイルからテキストと表を抽出します。
  PDF の内容を読み取りたい時に使用します。

# 悪い例
description: PDF を処理する  # 曖昧すぎる
```

## allowed-tools フィールド

スキルが使用できるツールを制限する。

```yaml
# 読み取り専用スキル
allowed-tools: Read, Grep, Glob

# ファイル操作可能なスキル
allowed-tools: Read, Write, Edit, Glob, Grep

# 制限なし（フィールドを省略）
# allowed-tools を記載しない
```

### 利用可能なツール例

| ツール | 用途 |
|-------|------|
| Read | ファイル読み取り |
| Write | ファイル書き込み |
| Edit | ファイル編集 |
| Glob | ファイル検索（パターン） |
| Grep | テキスト検索 |
| Bash | シェルコマンド実行 |
| WebFetch | Web コンテンツ取得 |

## Markdown 本文

### 推奨セクション構成

```markdown
# スキルタイトル

## 指示

1. 最初のステップ
2. 次のステップ
3. 最後のステップ

## 例

### 入力例
ユーザーがこのように依頼した場合...

### 出力例
このように応答する...

## ガイドライン

- 注意点1
- 注意点2
```

## ディレクトリ構成

### 最小構成

```
.claude/skills/my-skill/
└── SKILL.md
```

### フル構成

```
.claude/skills/my-skill/
├── SKILL.md           # 必須：メインファイル
├── reference.md       # 任意：詳細ドキュメント
├── scripts/           # 任意：ユーティリティスクリプト
│   └── helper.py
└── templates/         # 任意：テンプレートファイル
    └── template.txt
```

## 配置場所

| 種類 | パス | 用途 |
|------|------|------|
| プロジェクト | `.claude/skills/<name>/` | プロジェクト固有、チーム共有 |
| 個人 | `~/.claude/skills/<name>/` | ユーザー固有、マシンローカル |

## スキルの発見と実行

スキルは **自動発見・自動実行** される。

1. Claude Code 起動時に `.claude/skills/` と `~/.claude/skills/` をスキャン
2. ユーザーのリクエストと `description` を照合
3. 適切なスキルを自動的に適用

### 確認方法

```
# 対話で確認
"What Skills are available?"

# ファイルシステムで確認
ls .claude/skills/
ls ~/.claude/skills/
```

## 完全な例

```yaml
---
name: code-reviewer
description: |
  コードの変更をレビューし、問題点や改善点を指摘します。
  「レビューして」「コードを確認して」などのリクエストで使用されます。
allowed-tools: Read, Grep, Glob
---

# Code Reviewer

## 指示

1. 変更されたファイルを特定する
2. 各ファイルの変更内容を読み取る
3. 以下の観点でレビューする：
   - バグの可能性
   - セキュリティ上の問題
   - パフォーマンスへの影響
   - コードスタイル
4. 問題点と改善提案をまとめる

## 例

### ユーザーリクエスト
「最新のコミットをレビューして」

### 応答形式
## レビュー結果

### 問題点
- [重要] ファイル名:行番号 - 問題の説明

### 改善提案
- ファイル名:行番号 - 提案内容

## ガイドライン

- 批判的すぎず、建設的なフィードバックを心がける
- 重要度を明示する（重要/軽微/提案）
```

## 関連ドキュメント

- [SkillGraph](./skill-graph.md) - Clatelier の内部表現
- [アーキテクチャ](../explanation/architecture.md) - 変換フロー
