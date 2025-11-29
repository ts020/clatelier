---
description: |
  開発環境の初期設定コマンド
  Node.js バージョン、パッケージマネージャ、実行環境を対話的に設定
  package-researcher エージェントで最新情報を調査しながらセットアップ
---

# 開発環境セットアップ

プロジェクトの開発環境を設定します。
最新のパッケージ情報を調査しながら最適な環境を構築します。

---

## Step 1: 現在の環境確認

まず現在の環境を確認してください：

```bash
# Node.js バージョン
node --version

# パッケージマネージャ
npm --version
yarn --version 2>/dev/null || echo "yarn: not installed"
pnpm --version 2>/dev/null || echo "pnpm: not installed"

# Docker
docker --version 2>/dev/null || echo "docker: not installed"
```

---

## Step 2: 最新情報の調査（package-researcher エージェント）

**package-researcher エージェントを起動**して以下を調査してください：

### 2.1 Node.js 最新情報
調査内容：
- 現在のLTSバージョンと次期LTSスケジュール
- 各バージョンのサポート終了日（EOL）
- 主要フレームワーク（Next.js, Vite等）の最新バージョン

### 2.2 パッケージマネージャ比較
調査内容：
- npm / yarn / pnpm の最新バージョン
- 各ツールの最新機能と改善点
- パフォーマンス比較（インストール速度、ディスク使用量）
- 2024-2025年のトレンドと採用状況

### 2.3 開発ツール最新情報
調査内容：
- ESLint v9 / Flat Config の状況
- Prettier 最新バージョンと新機能
- Biome（ESLint + Prettier 代替）の成熟度
- TypeScript 最新バージョンの新機能

### 2.4 コンテナ環境（Docker選択時）
調査内容：
- Node.js 公式イメージの推奨タグ（alpine vs slim vs bookworm）
- マルチステージビルドのベストプラクティス
- Docker Compose v2 の最新機能

---

## Step 3: 調査結果に基づく提案

package-researcher の調査結果を踏まえ、ユーザーに**根拠付きの選択肢**を提示：

### 3.1 実行環境
ユーザーに質問：「開発環境をどのように構成しますか？」

| 選択肢 | 説明 | 推奨ケース |
|--------|------|-----------|
| ローカル | ホストマシン上で直接実行 | 小規模プロジェクト、高速な開発サイクル |
| Docker | コンテナ環境で実行 | チーム開発、本番環境との一致が重要 |
| ハイブリッド | 開発はローカル、DB等はDocker | DBやRedis等の外部サービスを使う場合 |

### 3.2 Node.js バージョン
調査結果を反映した選択肢を提示：

```markdown
| バージョン | サポート終了 | 推奨理由 |
|-----------|-------------|----------|
| 20.x LTS | [調査結果] | [調査結果に基づく説明] |
| 22.x LTS | [調査結果] | [調査結果に基づく説明] |
| 23.x | [調査結果] | [調査結果に基づく説明] |
```

### 3.3 パッケージマネージャ
調査結果を反映した比較表を提示：

```markdown
| 項目 | npm | yarn | pnpm |
|------|-----|------|------|
| 最新バージョン | [調査] | [調査] | [調査] |
| インストール速度 | [調査] | [調査] | [調査] |
| ディスク効率 | [調査] | [調査] | [調査] |
| 推奨ケース | [調査] | [調査] | [調査] |
```

### 3.4 追加ツール（複数選択可）
調査結果を反映した選択肢を提示：

```markdown
| ツール | 最新バージョン | 特徴・推奨理由 |
|--------|---------------|----------------|
| ESLint + Prettier | [調査] | [調査結果] |
| Biome | [調査] | [調査結果] ESLint+Prettierの代替 |
| Husky + lint-staged | [調査] | [調査結果] |
| lefthook | [調査] | Huskyの代替、Go製で高速 |
| Docker Compose | [調査] | [調査結果] |
| GitHub Actions | - | CI/CD |
```

---

## Step 4: 設定ファイル生成

選択内容に基づいて以下のファイルを生成・更新：

### 4.1 .nvmrc
```
選択したバージョン番号
```

### 4.2 package.json の engines フィールド
```json
{
  "engines": {
    "node": ">=選択バージョン"
  },
  "packageManager": "選択したパッケージマネージャ@バージョン"
}
```

### 4.3 パッケージマネージャ設定
選択に応じて生成：
- npm: `.npmrc`
- yarn: `.yarnrc.yml`
- pnpm: `.npmrc` + `pnpm-workspace.yaml`（モノレポの場合）

### 4.4 リンター・フォーマッター設定
選択に応じて生成：
- ESLint: `eslint.config.js`（Flat Config形式）
- Prettier: `.prettierrc`
- Biome: `biome.json`

### 4.5 Git hooks 設定
選択に応じて生成：
- Husky: `.husky/` ディレクトリ
- lefthook: `lefthook.yml`

### 4.6 Docker 関連（選択時）
- `Dockerfile`（マルチステージビルド）
- `docker-compose.yml`
- `.dockerignore`

---

## Step 5: 依存関係インストール

選択したパッケージマネージャでインストール：

```bash
# npm の場合
npm install

# yarn の場合
yarn install

# pnpm の場合
pnpm install
```

追加ツールのセットアップ：

```bash
# Husky 初期化（選択時）
npx husky init

# lefthook 初期化（選択時）
npx lefthook install
```

---

## Step 6: 検証

セットアップが正しく完了したか確認：

```bash
# バージョン確認
node --version
npm --version  # または yarn/pnpm

# リンター動作確認（選択時）
npm run lint

# フォーマッター動作確認（選択時）
npm run format

# 開発サーバー起動テスト（存在する場合）
npm run dev
```

---

## 出力

セットアップ完了後、以下を報告：

### 1. 設定内容サマリー

```markdown
| 項目 | 選択 | バージョン |
|------|------|-----------|
| 実行環境 | [選択] | - |
| Node.js | [選択] | [バージョン] |
| パッケージマネージャ | [選択] | [バージョン] |
| リンター | [選択] | [バージョン] |
| フォーマッター | [選択] | [バージョン] |
| Git hooks | [選択] | [バージョン] |
```

### 2. 生成されたファイル一覧
- 生成・更新したファイルのリスト

### 3. 調査で得た推奨事項
- package-researcher が発見した注意点やベストプラクティス

### 4. 次のステップ
- 開発サーバーの起動方法
- 追加の設定が必要な場合の案内
- アップグレード時の注意点
