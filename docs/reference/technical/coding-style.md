# コーディングスタイル

## 命名規則

### 基本ルール
| 対象 | スタイル | 例 |
|------|----------|-----|
| 変数・関数 | camelCase | `getUserName`, `isValid` |
| クラス・型 | PascalCase | `UserService`, `SkillNode` |
| 定数 | UPPER_SNAKE | `MAX_RETRY_COUNT` |
| ファイル | kebab-case | `user-service.ts` |
| ディレクトリ | kebab-case | `skill-editor/` |

### 意味のある命名
```typescript
// ❌ 悪い例
const d = new Date();
const tmp = users.filter(u => u.active);

// ✅ 良い例
const createdAt = new Date();
const activeUsers = users.filter(user => user.isActive);
```

### Boolean命名
- `is`, `has`, `can`, `should` プレフィックス使用
```typescript
const isLoading = true;
const hasPermission = false;
const canEdit = user.role === 'admin';
```

## フォーマット

### インデント・スペース
- インデント: 2スペース
- 行末スペース: 禁止
- 最終行: 改行あり

### 行の長さ
- 最大: 100文字
- 超える場合は適切に改行

### インポート順序
```typescript
// 1. 外部ライブラリ
import React from 'react';
import { z } from 'zod';

// 2. 内部モジュール（絶対パス）
import { SkillService } from '@/services/skill-service';

// 3. 相対パス
import { Button } from './button';
import type { SkillNode } from './types';
```

## TypeScript

### 型定義
```typescript
// ✅ interface: オブジェクト型
interface User {
  id: string;
  name: string;
}

// ✅ type: ユニオン、インターセクション
type Status = 'pending' | 'active' | 'completed';
type UserWithRole = User & { role: string };
```

### any禁止
```typescript
// ❌ any使用禁止
function process(data: any) {}

// ✅ unknown + 型ガード
function process(data: unknown) {
  if (isValidData(data)) {
    // 処理
  }
}
```

### 非null表明演算子
```typescript
// ❌ 非推奨（理由なき使用）
const name = user!.name;

// ✅ 推奨（ガード後または明確な理由）
if (user) {
  const name = user.name;
}
```

## 関数

### 関数の長さ
- 目安: 30行以内
- 超える場合は分割を検討

### 引数の数
- 目安: 3つ以内
- 超える場合はオブジェクト引数を使用
```typescript
// ❌ 引数が多い
function createUser(name: string, email: string, age: number, role: string) {}

// ✅ オブジェクト引数
function createUser(params: CreateUserParams) {}
```

### 早期リターン
```typescript
// ❌ ネストが深い
function process(user) {
  if (user) {
    if (user.isActive) {
      // 処理
    }
  }
}

// ✅ 早期リターン
function process(user) {
  if (!user) return;
  if (!user.isActive) return;
  // 処理
}
```

## コメント

### いつ書くか
- ✅ 「なぜ」の説明（意図、背景）
- ✅ 複雑なアルゴリズムの説明
- ✅ TODO、FIXME
- ❌ 「何を」の説明（コードを読めばわかる）

```typescript
// ❌ 不要なコメント
// ユーザーを取得する
const user = getUser(id);

// ✅ 有用なコメント
// レガシーAPIとの互換性のため、nullではなく空オブジェクトを返す
return user ?? {};
```

## エラーハンドリング

### try-catch
```typescript
// ✅ 具体的なエラーハンドリング
try {
  await saveSkill(skill);
} catch (error) {
  if (error instanceof ValidationError) {
    // バリデーションエラー処理
  } else if (error instanceof NetworkError) {
    // ネットワークエラー処理
  } else {
    // 予期せぬエラー
    throw error;
  }
}
```

### Result型パターン
```typescript
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

function parseSkill(input: string): Result<Skill, ParseError> {
  // ...
}
```
