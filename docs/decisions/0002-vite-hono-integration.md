# ADR 0002: Vite + Hono 統合によるフルスタック構成

## ステータス

採用（2025-11-29）

## コンテキスト

Clatelierは以下の要件を持つ：

1. **npx で即時起動** できるCLIツール
2. **Server → Client への Stream 通信**（Claude Code連携）
3. **統合サーバー**（フロント・バックエンドを1つのサーバーで）
4. **高速な開発サイクル**（HMR対応）

## 決定

**Vite + Hono** を統合して、単一サーバーで動作させる。

### 選択肢の比較

| 選択肢 | npx起動 | Stream | DX | 採用 |
|--------|---------|--------|-----|------|
| Vite + Hono | 高速 | SSE対応 | 良好 | **採用** |
| Next.js | やや遅い | Route Handlers | 優秀 | 不採用 |
| Vite + 別サーバー | 高速 | 対応 | 複雑 | 不採用 |

### Next.js を選ばなかった理由

1. **コールドスタートが遅い**: npx実行時に数秒かかる
2. **バンドルサイズが大きい**: npm publishに不向き
3. **オーバースペック**: Server Components等は不要

### Hono を選んだ理由

1. **軽量**: 本体14KB
2. **TypeScript first**: 型安全なRPC
3. **Stream対応**: SSE/WebSocketネイティブ
4. **Vite統合**: `@hono/vite-dev-server` で同一ポート

## 構成

```
apps/web/
├── vite.config.ts      # Hono統合
├── src/
│   ├── app.tsx         # React SPA
│   ├── main.tsx        # エントリ
│   └── server.ts       # Hono re-export
└── index.html

packages/server/
└── src/
    └── index.ts        # Hono API定義
```

### vite.config.ts

```typescript
import devServer from '@hono/vite-dev-server';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    devServer({
      entry: './src/server.ts',
    }),
  ],
});
```

### Hono RPC（型安全なAPI）

```typescript
// packages/server/src/index.ts
const routes = app
  .get('/api/skills', (c) => c.json(skills))
  .get('/api/stream', (c) => streamSSE(c, ...));

export type AppType = typeof routes;
```

```typescript
// apps/web - 型が自動伝播
import { hc } from 'hono/client';
import type { AppType } from '@clatelier/server';

const client = hc<AppType>('/');
const skills = await client.api.skills.$get(); // 型安全
```

## 結果

### メリット

- **単一サーバー**: フロント・バックエンドが同一ポート
- **高速起動**: Honoは軽量で即座に起動
- **型安全なAPI**: Hono RPCで型共有
- **優れたDX**: Vite HMR + Hono再起動

### デメリット

- **エコシステムが小さい**: Next.jsほど情報がない
- **SSR非対応**: SPA専用（本プロジェクトでは問題なし）

## 参考

- [Hono](https://hono.dev/)
- [@hono/vite-dev-server](https://github.com/honojs/vite-plugins)
