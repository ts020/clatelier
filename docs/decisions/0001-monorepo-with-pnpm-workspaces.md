# ADR 0001: pnpm workspaces によるモノレポ構成

## ステータス

採用（2025-11-29）

## コンテキスト

Clatelierプロジェクトは以下のコンポーネントで構成される：

- **Web アプリ**: React SPA（Vite）
- **Server**: Hono API（Stream対応）
- **Shared**: 共通型定義
- **UI**: 再利用可能なUIコンポーネント

これらを効率的に管理するため、モノレポ構成を検討した。

## 決定

**pnpm workspaces + catalog** を採用する。

### 選択肢の比較

| ツール | 採用 | 理由 |
|--------|------|------|
| pnpm workspaces | **採用** | シンプル、高速、catalog機能 |
| Turborepo | 不採用 | オーバースペック、追加の学習コスト |
| Nx | 不採用 | 設定が複雑、プロジェクト規模に不釣り合い |
| Lerna | 不採用 | メンテナンスモード、機能が古い |

### 主な決定事項

1. **pnpm catalog** でバージョン一元管理
   - 全パッケージで同一バージョンを保証
   - `pnpm-workspace.yaml` で定義

2. **workspace プロトコル** でパッケージ間参照
   - `"@clatelier/shared": "workspace:*"`

3. **tsup** でパッケージビルド
   - 軽量、高速、dts生成対応

4. **Turborepo 不使用**
   - ビルドキャッシュは不要（プロジェクト規模が小さい）
   - シンプルさを優先

## ディレクトリ構成

```
clatelier/
├── apps/
│   └── web/              # Vite + React SPA
├── packages/
│   ├── shared/           # 共通型定義
│   ├── server/           # Hono API
│   └── ui/               # UIコンポーネント
├── pnpm-workspace.yaml   # workspace + catalog
└── package.json          # ルート設定
```

## 結果

### メリット

- **シンプルな設定**: 追加ツールなしでモノレポ管理
- **高速なインストール**: pnpmのシンボリックリンク
- **バージョン一元管理**: catalog機能で依存関係の一貫性
- **型共有が容易**: workspace参照で型が自動伝播

### デメリット

- **ビルドキャッシュなし**: Turborepoほどの最適化はない
- **変更検知が手動**: `--filter` でのフィルタリングが必要

### 許容する理由

プロジェクト規模が小さく、ビルド時間は数秒程度。
Turborepoの複雑さよりシンプルさを優先する。

## 参考

- [pnpm workspaces](https://pnpm.io/workspaces)
- [pnpm catalog](https://pnpm.io/catalogs)
