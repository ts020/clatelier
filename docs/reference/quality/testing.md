# テスト方針

## テストピラミッド

```
        /\
       /  \     E2E（少）
      /----\    - ユーザーシナリオ
     /      \
    /--------\  統合テスト（中）
   /          \ - API、コンポーネント連携
  /------------\
 /              \ ユニットテスト（多）
/________________\ - 関数、クラス単体
```

## テスト種別

### ユニットテスト
| 対象 | ツール | 基準 |
|------|--------|------|
| 関数・クラス | Vitest | カバレッジ80%以上 |
| ロジック | Vitest | 全パス網羅 |

```typescript
// 例: ユニットテスト
describe('SkillValidator', () => {
  it('should reject name with spaces', () => {
    const result = validateSkillName('my skill');
    expect(result.ok).toBe(false);
    expect(result.error).toBe('INVALID_NAME');
  });
});
```

### 統合テスト
| 対象 | ツール | 基準 |
|------|--------|------|
| API エンドポイント | Vitest + supertest | 全エンドポイント |
| コンポーネント連携 | React Testing Library | 主要フロー |

```typescript
// 例: 統合テスト
describe('SkillEditor', () => {
  it('should save skill when form is valid', async () => {
    render(<SkillEditor />);
    await userEvent.type(screen.getByLabelText('Name'), 'my-skill');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(mockSave).toHaveBeenCalled();
  });
});
```

### E2Eテスト
| 対象 | ツール | 基準 |
|------|--------|------|
| ユーザーフロー | Playwright | クリティカルパス |

## テスト設計

### Given-When-Then形式
```typescript
describe('createSkill', () => {
  it('should create skill with valid input', () => {
    // Given: 有効な入力
    const input = { name: 'my-skill', description: 'Test skill' };

    // When: スキル作成
    const result = createSkill(input);

    // Then: 成功
    expect(result.ok).toBe(true);
    expect(result.value.name).toBe('my-skill');
  });
});
```

### エッジケース必須
以下は必ずテストする：

| ケース | 例 |
|--------|-----|
| 空入力 | `""`, `null`, `undefined` |
| 境界値 | 最大長、最小値 |
| 不正形式 | 不正な文字、型違い |
| エラー状態 | ネットワークエラー、タイムアウト |

### テストケースの網羅性
```typescript
describe('validateSkillName', () => {
  // 正常系
  it.each([
    ['my-skill', true],
    ['skill123', true],
    ['a', true],
  ])('should accept valid name: %s', (name, expected) => {
    expect(validateSkillName(name).ok).toBe(expected);
  });

  // 異常系
  it.each([
    ['My Skill', 'spaces not allowed'],
    ['my_skill', 'underscore not allowed'],
    ['', 'empty not allowed'],
    ['a'.repeat(65), 'too long'],
  ])('should reject invalid name: %s', (name, reason) => {
    expect(validateSkillName(name).ok).toBe(false);
  });
});
```

## カバレッジ基準

| 指標 | 目標 |
|------|------|
| Line | 80% |
| Branch | 75% |
| Function | 85% |

### 除外対象
- 型定義ファイル
- 設定ファイル
- 生成コード

## モック戦略

### モックすべきもの
- 外部API
- データベース
- ファイルシステム
- 時刻（Date）

### モックしないもの
- テスト対象のロジック
- 純粋関数
- 内部モジュール（できるだけ）

```typescript
// ✅ 外部依存のモック
vi.mock('@/services/api', () => ({
  fetchSkills: vi.fn().mockResolvedValue([]),
}));

// ❌ 内部ロジックのモック（避ける）
vi.mock('@/utils/validator'); // 実装もテストすべき
```

## テストの品質

### Arrange-Act-Assert (AAA)
各テストは3セクションで構成：

```typescript
it('should update skill name', () => {
  // Arrange: 準備
  const skill = createTestSkill();

  // Act: 実行
  const updated = updateSkillName(skill, 'new-name');

  // Assert: 検証
  expect(updated.name).toBe('new-name');
});
```

### テストの独立性
- 各テストは独立して実行可能
- 順序に依存しない
- 共有状態を持たない
