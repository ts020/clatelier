# Getting Started

Clatelier を使って最初の SKILL.md を作成するチュートリアル。

## このチュートリアルで学ぶこと

- Clatelier の起動方法
- グラフエディタでの編集
- ノードの追加と接続
- SKILL.md ファイルの生成

## Clatelier で作成できるもの

| 種類 | 出力先 | 用途 |
|-----|-------|------|
| スキル | `.claude/skills/*/SKILL.md` | Claude の振る舞いを定義 |
| エージェント | `.claude/agents/*.md` | 特化型 AI エージェント |
| スラッシュコマンド | `.claude/commands/*.md` | カスタムコマンド |

このチュートリアルではスキル（SKILL.md）の作成を例に説明します。

## 前提条件

- Node.js 20 以上がインストールされていること（推奨: 24.x LTS）
- 開発者の方は [開発環境のセットアップ](../how-to/development-setup.md) を参照

## Step 1: 起動する

プロジェクトのルートディレクトリで以下を実行：

```bash
npx clatelier --project
```

ブラウザが自動で開き、Clatelier の画面が表示される。

## Step 2: 新規ファイルを作成

1. 左サイドバーの「+ New」ボタンをクリック
2. 種類を選択：「Skill」「Agent」「Command」から選択（ここでは Skill）
3. 以下を入力：
   - **Name**: `hello-world`（小文字・数字・ハイフンのみ）
   - **Description**: `最初のスキルです。挨拶したい時に使います。`

## Step 3: 最初のノードを追加

1. 左パレットから「instruction」をドラッグ
2. キャンバスにドロップ
3. ノードをダブルクリック
4. ラベルに「ユーザーに挨拶する」と入力
5. 「Apply」をクリック

## Step 4: 2 つ目のノードを追加

1. 「tool」ノードをパレットからドラッグ
2. 最初のノードの右側にドロップ
3. ダブルクリックして編集：
   - ラベル: `Read`
   - ツール名: `Read`
4. 「Apply」をクリック

## Step 5: ノードを接続

1. 「ユーザーに挨拶する」ノードの右ハンドル（●）をドラッグ
2. 「Read」ノードの左ハンドル（●）にドロップ
3. 矢印でノードが接続される

## Step 6: 保存

1. 画面右上の「Save」ボタンをクリック
2. 「Saved successfully」と表示される

## 結果を確認

以下のファイルが生成される：

```
.claude/skills/hello-world/
├── SKILL.md
└── skill.graph.json
```

### SKILL.md の内容

```yaml
---
name: hello-world
description: 最初のスキルです。挨拶したい時に使います。
allowed-tools: Read
---

# Hello World

## 指示

1. ユーザーに挨拶する
2. Read ツールを使用してファイルを読み取る
```

> `allowed-tools` はカンマ区切り文字列（例: `Read, Grep, Glob`）

## 次のステップ

- [スキルを作成する](../how-to/create-skill.md) - より詳細な作成手順
- [グラフを編集する](../how-to/edit-graph.md) - 高度な編集操作
- [SKILL.md 形式](../reference/skill-md.md) - Claude Code 公式フォーマット
- [SkillGraph リファレンス](../reference/skill-graph.md) - 内部データモデル
