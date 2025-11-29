# Clatelier

> **開発中**: このプロジェクトは現在開発中です。まだ動作しません。

Claude Code のスキル・エージェント・スラッシュコマンドを GUI で作成・編集するビジュアルエディタ。

## 対応する Claude Code 機能

| 機能 | 出力ファイル | 説明 |
|-----|-------------|------|
| スキル | `.claude/skills/*/SKILL.md` | Claude の振る舞いを定義 |
| エージェント | `.claude/agents/*.md` | 特化型 AI エージェント |
| スラッシュコマンド | `.claude/commands/*.md` | カスタムコマンド |

## クイックスタート

```bash
npx clatelier
```

ブラウザが自動で開き、エディタが起動します。

## 特徴

- ドラッグ＆ドロップでワークフローを設計
- グラフ形式で指示の流れを可視化
- Claude Code 公式フォーマットで出力

## 動作環境

- Node.js 20 以上（推奨: 24.x LTS）

## ドキュメント

- [Getting Started](./docs/tutorials/getting-started.md) - 最初のファイルを作成する
- [開発環境のセットアップ](./docs/how-to/development-setup.md) - 開発者向け

## 開発

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev
```

詳細は [開発環境のセットアップ](./docs/how-to/development-setup.md) を参照。

## ライセンス

MIT
