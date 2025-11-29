# 技術スタック

## コア技術

### 言語
| 用途 | 選択 | 理由 |
|------|------|------|
| フロントエンド | TypeScript | 型安全性、IDE支援 |
| バックエンド | TypeScript (Node.js) | フルスタック統一 |
| スクリプト | TypeScript / Bash | 複雑さに応じて選択 |

### ランタイム
- **Node.js**: v22以上（LTS推奨）
- **pnpm**: v10（パッケージマネージャ）

## モノレポ構成

```
clatelier/
├── apps/
│   └── web/              # Vite + React SPA + Hono
├── packages/
│   ├── shared/           # 共通型定義
│   ├── server/           # Hono API
│   └── ui/               # UIコンポーネント
└── pnpm-workspace.yaml   # catalog でバージョン一元管理
```

### パッケージ間依存

```
apps/web
  ├── @clatelier/shared
  ├── @clatelier/server
  └── @clatelier/ui
        └── @clatelier/shared
```

## フロントエンド

### フレームワーク
| 選択 | バージョン | 用途 |
|------|-----------|------|
| **React** | 19.x | UIコンポーネント |
| **Vite** | 7.x | ビルドツール |
| **React Flow** | 11.x | グラフエディタ |

### 状態管理
外部ライブラリは使用しない。

| 用途 | 選択 |
|------|------|
| ローカル状態 | `useState` / `useReducer` |
| サーバー状態 | `use()` フック（React 19） |
| グローバル状態 | React Context |
| URL状態 | React Router（必要時） |

### スタイリング
| 選択 | バージョン | 用途 |
|------|-----------|------|
| **TailwindCSS** | 4.x | ユーティリティファースト |
| **@tailwindcss/vite** | 4.x | Viteプラグイン（PostCSS不要） |

## バックエンド

### APIフレームワーク
| 選択 | バージョン | 用途 |
|------|-----------|------|
| **Hono** | 4.x | 軽量・高速なAPIサーバー |

### Vite統合
`@hono/vite-dev-server` でViteとHonoを統合し、単一サーバーで動作。

### 通信
| 方式 | 用途 |
|------|------|
| REST | シンプルなCRUD |
| SSE | Server → Client ストリーム（Claude Code連携） |

### ファイル操作
- **fs/promises**: Node.js標準
- **glob**: パターンマッチング
- **yaml**: YAML解析

## 開発ツール

### 型チェック
| ツール | バージョン | 用途 |
|--------|-----------|------|
| **tsgo** | 7.x-dev | Go製TypeScript型チェッカー |
| typescript | 5.7.x | tsupのdts生成用 |

### リンター・フォーマッター
| ツール | バージョン | 用途 |
|--------|-----------|------|
| **Biome** | 1.9.x | Lint + Format 統合 |

### Git hooks
| ツール | バージョン | 用途 |
|--------|-----------|------|
| **lefthook** | 2.x | Go製、高速、並列実行 |

### テスト
| 種別 | ツール | バージョン |
|------|--------|-----------|
| ユニット | Vitest | 4.x |
| 統合 | Vitest | 4.x |
| E2E | Playwright | 1.57.x |

### パッケージビルド
| ツール | バージョン | 用途 |
|--------|-----------|------|
| **tsup** | 8.x | パッケージのESM + dts生成 |

## バージョン管理（catalog）

`pnpm-workspace.yaml` の catalog でバージョンを一元管理：

```yaml
catalog:
  react: ^19.0.0
  hono: ^4.10.7
  vite: ^7.2.4
  typescript: ^5.7.2
  '@biomejs/biome': ^1.9.4
  vitest: ^4.0.14
```

各パッケージでは `catalog:` で参照：

```json
{
  "dependencies": {
    "react": "catalog:"
  }
}
```

## 選定基準

### 採用基準
- [ ] メンテナンス状況（最終更新、Issue対応）
- [ ] TypeScript対応
- [ ] パフォーマンス（Rust/Go製を優先）
- [ ] シンプルさ（設定が少ないツール）

### 不採用としたもの
| ツール | 理由 |
|--------|------|
| Turborepo | オーバースペック |
| ESLint + Prettier | Biomeで代替 |
| Husky + lint-staged | lefthookで代替 |
| Zustand | 状態管理ライブラリ不使用方針 |
| autoprefixer | 最新ブラウザのみ対応 |
| PostCSS | @tailwindcss/viteで不要 |
| パスエイリアス (@/) | シンプルさを優先 |

## 関連ADR

- [ADR 0001: pnpm workspaces によるモノレポ構成](../decisions/0001-monorepo-with-pnpm-workspaces.md)
- [ADR 0002: Vite + Hono 統合](../decisions/0002-vite-hono-integration.md)
- [ADR 0003: 開発ツールの選定](../decisions/0003-tooling-choices.md)
