# CLAUDE.md

Clatelier（クラトリエ）プロジェクトの開発ガイドライン。

## プロジェクト概要

Claude Code のスキル・エージェント・スラッシュコマンドを GUI で作成・編集するビジュアルエディタ。

### 対応する Claude Code 機能

| 機能 | 出力ファイル | 説明 |
|-----|-------------|------|
| スキル | `.claude/skills/*/SKILL.md` | Claude の振る舞いを定義 |
| エージェント | `.claude/agents/*.md` | 特化型 AI エージェント |
| スラッシュコマンド | `.claude/commands/*.md` | カスタムコマンド |

## ドキュメント

プロジェクトの知識は `docs/` ディレクトリに Diataxis 形式で整理されています。

### 参照ドキュメント（Reference）
- `docs/reference/domain/glossary.md` - 用語集（ユビキタス言語）
- `docs/reference/domain/entities.md` - エンティティ定義
- `docs/reference/domain/business-rules.md` - ビジネスルール
- `docs/reference/technical/coding-style.md` - コーディング規約
- `docs/reference/technical/tech-stack.md` - 技術スタック
- `docs/reference/quality/testing.md` - テスト方針
- `docs/reference/quality/security.md` - セキュリティ基準

### 説明ドキュメント（Explanation）
- `docs/explanation/architecture.md` - アーキテクチャ設計思想
- `docs/explanation/skill-system.md` - スキル体系の設計思想

---

## ユースケース別コマンド実行ガイド

ユーザーの依頼内容に応じて、以下のコマンドを自動的に実行してください。

### UC-1: 新機能の開発

**トリガー**: ユーザーが以下のような依頼をした場合
- 「〇〇機能を追加して」
- 「〇〇を実装して」
- 「新しく〇〇を作って」

**実行コマンド**:
```
/workflows:feature-dev [機能名]
```

**プロセス概要**:
1. architect エージェントが設計
2. implementer エージェントが実装
3. qa-specialist エージェントがテスト作成
4. code-reviewer エージェントがレビュー（指摘ゼロまで繰り返し）

---

### UC-2: バグ・不具合の修正

**トリガー**: ユーザーが以下のような依頼をした場合
- 「〇〇のバグを直して」
- 「〇〇が動かないので修正して」
- 「Issue #XX を対応して」
- 「〇〇でエラーが出る」

**実行コマンド**:
```
/workflows:bugfix [issue番号 または 問題の説明]
```

**プロセス概要**:
1. debugger エージェントが原因調査
2. implementer エージェントが修正実装
3. qa-specialist エージェントが検証
4. code-reviewer エージェントがレビュー

---

### UC-3: コードレビューの実施

**トリガー**: ユーザーが以下のような依頼をした場合
- 「レビューして」
- 「コードをチェックして」
- 「品質確認して」
- 「セキュリティレビューして」

**実行コマンド**:
```
/review:review-loop [対象]
```

**対象オプション**:
| オプション | 説明 | 使用場面 |
|-----------|------|---------|
| `code` | コードスタイル・品質 | 一般的なコードレビュー |
| `design` | 設計・アーキテクチャ | 設計レビュー |
| `security` | セキュリティ | セキュリティ監査 |
| `all` | 全観点 | 総合レビュー |

**プロセス概要**:
- code-reviewer エージェントが指摘を出す
- implementer エージェントが修正
- 指摘がゼロになるまでループ

---

### UC-4: レビュー状況の確認

**トリガー**: ユーザーが以下のような依頼をした場合
- 「レビューの状況は？」
- 「指摘の残りは？」
- 「進捗を教えて」

**実行コマンド**:
```
/review:review-status
```

---

## エージェント自動選択ルール

ユーザーの依頼内容からキーワードを検出し、適切なエージェントを自動起動してください。

| 検出キーワード | 起動エージェント | 用途 |
|---------------|-----------------|------|
| 設計、構成、アーキテクチャ | `architect` | 設計・構成決定 |
| 実装、コード、作成、追加 | `implementer` | コード実装 |
| レビュー、チェック、確認 | `code-reviewer` | 品質レビュー |
| テスト、検証、QA | `qa-specialist` | テスト作成・実行 |
| バグ、エラー、調査、デバッグ | `debugger` | 問題調査・修正 |
| パッケージ、ライブラリ、npm、最新バージョン | `package-researcher` | 外部パッケージ調査 |

---

## スキル自動適用ルール

タスク実行時、以下のスキルを自動的に参照・適用してください。

### 常時適用（全タスク共通）
| スキル | 適用内容 |
|--------|---------|
| `domain-model` | ドメイン用語を正確に使用 |
| `coding-style` | 命名規則・フォーマットを遵守 |
| `security-standards` | セキュリティ基準を満たす |

### タスク別追加適用
| タスク種別 | 追加スキル |
|-----------|-----------|
| 設計タスク | `architecture`, `tech-stack` |
| テストタスク | `testing-principles` |
| ドキュメントタスク | `diataxis` |

---

## コーディング規約（概要）

詳細は `docs/reference/technical/coding-style.md` を参照。

- 変数・関数: camelCase
- クラス・型: PascalCase
- 定数: UPPER_SNAKE_CASE
- ファイル: kebab-case
- any 使用禁止
- 早期リターン推奨
- 関数は30行以内目安

---

## レビュー基準

### 必須チェック項目
- [ ] coding-style 準拠
- [ ] security-standards 準拠（インジェクション、XSS対策）
- [ ] business-rules 制約を満たす
- [ ] テストが存在する

### 指摘レベル
- **CRITICAL**: セキュリティ・バグ → 必須修正
- **WARNING**: 規約違反 → 修正推奨
- **INFO**: 改善提案 → 任意

---

## 禁止事項

- any 型の使用
- 機密情報のハードコード
- ビジネスルールの制約違反
- テストなしのマージ
