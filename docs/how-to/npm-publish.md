# npm 公開手順

Clatelier CLI パッケージを npm に公開する手順。

## パッケージ構成

CLI パッケージ（`apps/cli`）は以下を含む自己完結型パッケージ：

| ファイル/ディレクトリ | 説明 |
|---------------------|------|
| `dist/cli.js` | CLI エントリポイント（サーバーコードをバンドル） |
| `public/` | ビルド済み Web アセット（HTML, JS, CSS） |
| `package.json` | 依存関係は `hono` と `@hono/node-server` のみ |

## ビルド手順

### 1. 全体ビルド

```bash
# プロジェクトルートから
pnpm build
```

これにより以下が実行される：
1. `packages/server` のビルド
2. `apps/web` のビルド（React アプリ）
3. `apps/cli` のビルド（Web アセットを `public/` にコピー）

### 2. CLI パッケージ単体ビルド

```bash
cd apps/cli
pnpm build
```

`prebuild` スクリプトが自動で Web アプリをビルドして `public/` にコピーする。

## ローカルテスト

npm に公開する前に、パッケージが正しく動作するか検証する。

### 方法 1: 直接ビルド確認

最も簡単な方法。ビルド後に直接実行：

```bash
# ビルド
cd apps/cli
pnpm build

# 起動
node dist/cli.js

# 別ターミナルでテスト
curl http://localhost:3000/api/health
# => {"status":"ok"}
```

### 方法 2: npx シミュレーション（推奨）

npm 公開後の `npx clatelier` と同等の環境を再現する方法。

#### Step 1: tarball の作成

```bash
cd apps/cli
pnpm pack
# => clatelier-0.1.0.tgz
```

> **注意**: `npm pack` ではなく `pnpm pack` を使用すること。
> pnpm は `catalog:` プロトコルを解決してから tarball を作成する。

#### Step 2: 一時ディレクトリで展開

```bash
# 一時ディレクトリを作成
mkdir -p /tmp/clatelier-npx-test
cd /tmp/clatelier-npx-test

# 既存のテストを削除（2回目以降）
rm -rf package

# tarball を展開
tar -xzf /path/to/apps/cli/clatelier-0.1.0.tgz
cd package
```

#### Step 3: 依存関係をインストール

```bash
npm install
# => added 53 packages
```

この時点で、npm 公開後のパッケージと同じ状態になる。

#### Step 4: サーバー起動と動作確認

```bash
# サーバーを起動
node dist/cli.js

# 別ターミナルでテスト
curl http://localhost:3000/api/health
# => {"status":"ok"}
```

ポートを変更する場合：

```bash
PORT=4000 node dist/cli.js
```

#### 一括実行スクリプト

上記を一括で実行するスクリプト：

```bash
#!/bin/bash
set -e

# 設定
CLI_DIR="$(cd apps/cli && pwd)"
TEST_DIR="/tmp/clatelier-npx-test"
PORT="${PORT:-4000}"

# ビルド & パック
cd "$CLI_DIR"
pnpm build
pnpm pack

# 展開 & インストール
rm -rf "$TEST_DIR/package"
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"
tar -xzf "$CLI_DIR"/clatelier-*.tgz
cd package
npm install

# 起動
echo "Starting server on port $PORT..."
PORT=$PORT node dist/cli.js
```

### エンドポイント確認

| エンドポイント | 期待されるレスポンス |
|---------------|---------------------|
| `/api/health` | `{"status":"ok"}` |
| `/api/doctor` | ヘルスチェック結果 JSON |
| `/` | HTML（React SPA） |
| `/doctor` | HTML（SPA ルート） |
| `/assets/*.js` | 静的 JavaScript |

## npm への公開

### 1. npm にログイン

```bash
npm login
```

### 2. バージョン更新

```bash
cd apps/cli
npm version patch  # または minor, major
```

### 3. 公開

```bash
npm publish
```

### 4. 公開確認

```bash
# 別ディレクトリで npx 実行
npx clatelier
```

## 環境変数

| 変数 | デフォルト | 説明 |
|------|-----------|------|
| `PORT` | `3000` | サーバーポート |
| `HOST` | `localhost` | バインドするホスト |

例：

```bash
PORT=8080 npx clatelier
```

## package.json の重要な設定

```json
{
  "name": "clatelier",
  "bin": {
    "clatelier": "./dist/cli.js"
  },
  "files": ["dist", "public"],
  "dependencies": {
    "hono": "^4.10.7",
    "@hono/node-server": "^1.14.3"
  },
  "engines": {
    "node": ">=20.0.0"
  }
}
```

### 注意点

- `dependencies` には `hono` と `@hono/node-server` のみ
- `@clatelier/*` ワークスペースパッケージは `tsup` でバンドル済み
- `devDependencies` には公開に不要なパッケージのみ配置

## トラブルシューティング

### "Cannot find package" エラー

`package.json` の `dependencies` から `workspace:*` や `catalog:` 参照を削除し、外部公開パッケージのみにする。

### 静的ファイルが見つからない

`prebuild` スクリプトが正しく実行されているか確認：

```bash
ls apps/cli/public/
# index.html assets/ が存在すること
```

### shebang エラー

`dist/cli.js` の先頭に shebang があることを確認：

```bash
head -1 apps/cli/dist/cli.js
# => #!/usr/bin/env node
```

## CI/CD での公開

GitHub Actions の例：

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
          registry-url: 'https://registry.npmjs.org'

      - run: pnpm install
      - run: pnpm build

      - run: npm publish
        working-directory: apps/cli
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 次のステップ

- [開発環境のセットアップ](./development-setup.md) - 開発環境の構築
- [アーキテクチャ](../explanation/architecture.md) - システム構成の理解
