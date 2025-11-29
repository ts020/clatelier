# 開発環境のセットアップ

Clatelier の開発環境を構築する手順。

## 必要なツール

| ツール | バージョン | 用途 |
|--------|-----------|------|
| Node.js | 24.x (LTS) | JavaScript ランタイム |
| pnpm | 10.24.0 | パッケージマネージャー |
| mise | 最新 | Node.js バージョン管理（推奨） |

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/your-org/claude-skil-atelier.git
cd claude-skil-atelier
```

### 2. Node.js のインストール

mise を使用する場合（推奨）：

```bash
# mise のインストール（未インストールの場合）
curl https://mise.run | sh

# Node.js のインストール（.node-version から自動検出）
mise install

# バージョン確認
mise exec -- node -v  # v24.x.x
```

他のバージョンマネージャー（nodenv, fnm, nvm など）も `.node-version` ファイルを認識する。

### 3. pnpm の有効化

corepack を使用して pnpm を有効化：

```bash
corepack enable pnpm
pnpm -v  # 10.24.0
```

### 4. 依存関係のインストール

```bash
pnpm install
```

### 5. 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで http://localhost:5173 が自動で開く。

## プロジェクト構造

```
claude-skil-atelier/
├── apps/
│   ├── web/          # Vite + React フロントエンド
│   └── cli/          # npx 配布用 CLI パッケージ
├── packages/
│   ├── server/       # Hono API サーバー
│   ├── shared/       # 共通型定義
│   └── ui/           # UI コンポーネント
├── docs/             # ドキュメント（Diataxis 形式）
├── .node-version     # Node.js バージョン指定
├── biome.json        # Biome 設定（Lint/Format）
└── pnpm-workspace.yaml  # ワークスペース設定
```

## 開発コマンド

### 基本コマンド

| コマンド | 説明 |
|---------|------|
| `pnpm dev` | 開発サーバー起動（HMR 有効） |
| `pnpm build` | 全パッケージのビルド |
| `pnpm typecheck` | 型チェック（tsgo） |
| `pnpm lint` | Biome による静的解析 |
| `pnpm format` | Biome によるフォーマット |
| `pnpm test` | 単体テスト（Vitest） |
| `pnpm test:e2e` | E2E テスト（Playwright） |

### パッケージ個別ビルド

```bash
# server パッケージのみビルド
pnpm --filter @clatelier/server build

# web パッケージのみビルド
pnpm --filter @clatelier/web build

# CLI パッケージのビルド（web のビルドも含む）
pnpm --filter clatelier build
```

## ホットリロード

開発サーバーは以下の変更を検知して自動リロードする：

- **フロントエンド** (`apps/web/src/`): Vite HMR による即時反映
- **サーバー** (`packages/server/src/`): @hono/vite-dev-server による自動リロード

サーバーコードは `apps/web/src/server.ts` から直接ソースをインポートしているため、ビルドなしで変更が反映される。

## ヘルスチェック

開発サーバー起動後、以下のエンドポイントで動作確認：

```bash
# API ヘルスチェック
curl http://localhost:5173/api/health
# => {"status":"ok"}

# 詳細な診断情報
curl http://localhost:5173/api/doctor
# => {"status":"healthy","timestamp":"...","checks":[...]}
```

ブラウザで http://localhost:5173/doctor にアクセスすると GUI で確認可能。

## トラブルシューティング

### Node.js のバージョンが古い

```bash
# mise で最新 LTS をインストール
mise install node@lts
mise use node@lts
```

### pnpm が見つからない

```bash
# corepack を有効化
corepack enable pnpm
```

### ポート 5173 が使用中

```bash
# 別のポートで起動
PORT=3001 pnpm dev
```

### 依存関係の問題

```bash
# node_modules を削除して再インストール
pnpm clean
rm -rf node_modules
pnpm install
```

## 次のステップ

- [npm 公開手順](./npm-publish.md) - パッケージの公開方法
- [テストガイド](./testing-guide.md) - テストの書き方
- [コーディングスタイル](../reference/technical/coding-style.md) - コード規約
