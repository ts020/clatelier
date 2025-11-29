# Clatelier ドキュメント

Claude Code のスキル・エージェント・スラッシュコマンドを GUI で作成・編集するビジュアルエディタ。

## Clatelier とは

Clatelier は、Claude Code の拡張機能（スキル、エージェント、スラッシュコマンド）を視覚的に作成できるツールです。

### 対応する Claude Code 機能

| 機能 | 出力ファイル | 説明 |
|-----|-------------|------|
| スキル | `.claude/skills/*/SKILL.md` | Claude の振る舞いを定義 |
| エージェント | `.claude/agents/*.md` | 特化型の AI エージェント |
| スラッシュコマンド | `.claude/commands/*.md` | カスタムコマンド |

### 特徴

- ドラッグ＆ドロップでワークフローを設計
- グラフ形式で指示の流れを可視化
- Claude Code 公式フォーマットで出力

## ドキュメント構成

### Tutorials（チュートリアル）

初めての方向けの学習ガイド。

- [Getting Started](./tutorials/getting-started.md) - 最初のスキルを作成する

### How-to Guides（ハウツーガイド）

具体的なタスクの実行手順。

- [開発環境のセットアップ](./how-to/development-setup.md) - 開発を始める準備
- [npm 公開手順](./how-to/npm-publish.md) - パッケージの公開とテスト
- [スキルを作成する](./how-to/create-skill.md)
- [グラフを編集する](./how-to/edit-graph.md)
- [スキル・エージェントのテストガイド](./how-to/testing-guide.md) - 実践的なテスト方法
- [スキルの発動率を検証する](./how-to/test-skills.md) - 詳細な実験結果

### Reference（リファレンス）

技術仕様の詳細。

- [SKILL.md 形式](./reference/skill-md.md) - Claude Code 公式フォーマット
- [SkillGraph](./reference/skill-graph.md) - Clatelier 内部データモデル
- [Operations](./reference/operations.md) - 編集操作の定義
- [API](./reference/api.md) - REST API 仕様

### Explanation（解説）

設計思想と背景の説明。

- [アーキテクチャ](./explanation/architecture.md) - システム構成と起動フロー
- [Claude 連携](./explanation/chat-integration.md) - Chat ベース編集の統合方針

### Decisions（設計決定）

アーキテクチャ決定記録（ADR）。

- [ADR 0001: pnpm workspaces によるモノレポ構成](./decisions/0001-monorepo-with-pnpm-workspaces.md)
- [ADR 0002: Vite + Hono 統合](./decisions/0002-vite-hono-integration.md)
- [ADR 0003: 開発ツールの選定](./decisions/0003-tooling-choices.md)
