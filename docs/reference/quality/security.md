# セキュリティ基準

## OWASP Top 10 対策

### 1. インジェクション
```typescript
// ❌ SQLインジェクション脆弱
const query = `SELECT * FROM users WHERE id = '${userId}'`;

// ✅ パラメータ化クエリ
const query = 'SELECT * FROM users WHERE id = $1';
await db.query(query, [userId]);
```

```typescript
// ❌ コマンドインジェクション脆弱
exec(`ls ${userInput}`);

// ✅ 引数を分離
execFile('ls', [sanitizedPath]);
```

### 2. 認証の不備
- パスワードは bcrypt でハッシュ化（コスト12以上）
- セッションは HttpOnly + Secure Cookie
- JWT の秘密鍵は環境変数で管理

### 3. 機密データの露出
```typescript
// ❌ ログに機密情報
console.log('User password:', password);

// ✅ 機密情報をマスク
console.log('User authenticated:', userId);
```

### 4. XSS（クロスサイトスクリプティング）
```typescript
// ❌ dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ テキストとして出力
<div>{userInput}</div>

// ✅ やむを得ない場合はサニタイズ
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
```

### 5. アクセス制御の不備
```typescript
// ✅ 認可チェック必須
async function updateSkill(userId: string, skillId: string) {
  const skill = await getSkill(skillId);

  // 所有者チェック
  if (skill.ownerId !== userId) {
    throw new ForbiddenError('Not authorized');
  }

  // 更新処理
}
```

## 入力検証

### バリデーション必須
```typescript
// zod によるスキーマ検証
const SkillInputSchema = z.object({
  name: z.string()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9-]+$/),
  description: z.string()
    .max(1024),
});

function createSkill(input: unknown) {
  const validated = SkillInputSchema.parse(input);
  // 検証済みデータで処理
}
```

### ファイルパス検証
```typescript
// ❌ パストラバーサル脆弱
const path = `./uploads/${userFilename}`;

// ✅ パス正規化 + ホワイトリスト
import path from 'path';

function getSafePath(filename: string): string {
  const normalized = path.normalize(filename);

  // 親ディレクトリ参照を禁止
  if (normalized.includes('..')) {
    throw new Error('Invalid path');
  }

  const fullPath = path.join(UPLOAD_DIR, normalized);

  // ベースディレクトリ内かチェック
  if (!fullPath.startsWith(UPLOAD_DIR)) {
    throw new Error('Path traversal detected');
  }

  return fullPath;
}
```

## 依存関係セキュリティ

### 脆弱性チェック
```bash
# 定期実行
npm audit

# CI/CD で自動チェック
npm audit --audit-level=high
```

### 依存関係の更新
- 月次で依存関係更新
- セキュリティパッチは即時適用
- メジャーバージョン更新は慎重に

## 機密情報管理

### 環境変数
```typescript
// ✅ 環境変数から取得
const apiKey = process.env.API_KEY;

// ❌ ハードコード禁止
const apiKey = 'sk-1234567890';
```

### .gitignore 必須項目
```
.env
.env.local
*.pem
*.key
credentials.json
```

## チェックリスト

### 実装時
- [ ] ユーザー入力は全てバリデーション
- [ ] SQLはパラメータ化クエリ
- [ ] HTMLエスケープ（React標準）
- [ ] 認可チェック実装
- [ ] 機密情報は環境変数

### レビュー時
- [ ] インジェクション脆弱性なし
- [ ] XSS脆弱性なし
- [ ] 認可チェック漏れなし
- [ ] 機密情報のログ出力なし
- [ ] エラーメッセージに内部情報なし

### デプロイ前
- [ ] npm audit で脆弱性なし
- [ ] HTTPS強制
- [ ] セキュリティヘッダー設定
- [ ] 本番環境でデバッグモードOFF
