# ADR 0003: 開発ツールの選定

## ステータス

採用（2025-11-29）

## コンテキスト

開発効率と品質を両立するため、以下のツールを選定する必要があった：

- 型チェッカー
- リンター/フォーマッター
- パッケージマネージャ
- Git hooks
- テストツール

## 決定

### 型チェック: tsgo（@typescript/native-preview）

| 選択肢 | 採用 | 理由 |
|--------|------|------|
| **tsgo** | **採用** | Go製で高速、Microsoft公式 |
| tsc | 不採用 | tsgoで代替可能 |

tsgoはTypeScriptのGo実装で、従来のtscより大幅に高速。
ビルドはVite（esbuild）が行うため、型チェックのみにtsgoを使用。

### Lint/Format: Biome

| 選択肢 | 採用 | 理由 |
|--------|------|------|
| **Biome** | **採用** | Rust製で100倍高速、Lint+Format統合 |
| ESLint + Prettier | 不採用 | 2ツール必要、設定複雑 |

Biomeは単一ツールでLintとFormatを提供。
設定がシンプルで、パフォーマンスも優秀。

### パッケージマネージャ: pnpm

| 選択肢 | 採用 | 理由 |
|--------|------|------|
| **pnpm** | **採用** | 高速、省スペース、catalog機能 |
| npm | 不採用 | 遅い、ディスク使用量大 |
| yarn | 不採用 | トレンド減少 |

### Git hooks: lefthook

| 選択肢 | 採用 | 理由 |
|--------|------|------|
| **lefthook** | **採用** | Go製で超高速、並列実行 |
| Husky + lint-staged | 不採用 | Node.js製、やや遅い |

lefthookはGo製バイナリで、Huskyより高速に動作。
並列実行にも対応し、複数のhookを同時実行可能。

### テスト: Vitest + Playwright

| 用途 | ツール | 理由 |
|------|--------|------|
| ユニット/統合 | **Vitest** | Vite統合、Jest互換、高速 |
| E2E | **Playwright** | クロスブラウザ、安定性 |

### スタイリング: TailwindCSS v4

| 選択肢 | 採用 | 理由 |
|--------|------|------|
| **TailwindCSS v4** | **採用** | CSS-first設定、高速 |
| CSS Modules | 不採用 | ユーティリティファーストを優先 |

TailwindCSS v4は`@tailwindcss/vite`プラグインでPostCSS不要。

## バージョン一覧

```yaml
# pnpm-workspace.yaml catalog
typescript: ^5.7.2
'@typescript/native-preview': ^7.0.0-dev
'@biomejs/biome': ^1.9.4
lefthook: ^2.0.4
vitest: ^4.0.14
'@playwright/test': ^1.57.0
vite: ^7.2.4
'@tailwindcss/vite': ^4.1.17
```

## 不採用としたもの

| ツール | 理由 |
|--------|------|
| autoprefixer | 最新ブラウザのみ対応 |
| PostCSS | @tailwindcss/viteで不要 |
| 状態管理ライブラリ | React 19のuseState/useReducerで十分 |
| パスエイリアス (@/) | シンプルさを優先、相対パス使用 |

## 結果

- **高速**: tsgo, Biome, lefthookでビルド・チェックが高速
- **シンプル**: 単一ツールで複数機能をカバー
- **型安全**: TypeScript strict mode + tsgo
- **一貫性**: pnpm catalogでバージョン統一

## 参考

- [tsgo (TypeScript Go)](https://github.com/nicolo-ribaudo/typescript-go)
- [Biome](https://biomejs.dev/)
- [lefthook](https://github.com/evilmartians/lefthook)
