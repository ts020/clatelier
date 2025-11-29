# スキル・エージェントのテストガイド

スキルやサブエージェントが期待通りに動作するかをテストする実践的なガイド。

## 基本的なテスト方法

### 非対話モードでテスト

```bash
claude -p "テストプロンプト"
```

新しいプロセスが起動するため、最新のスキル/エージェント定義が読み込まれる。

### JSON 出力で詳細を確認

```bash
claude -p "テストプロンプト" --output-format json
```

どのツールが呼ばれたか、どのエージェントが使われたかを確認できる。

### 使用ツールの抽出

```bash
claude -p "プロンプト" --output-format json 2>&1 | \
  jq -r '[.[] | select(.type == "assistant") | .message.content[] | select(.type == "tool_use") | .name] | join(" -> ")'
```

出力例: `Task -> Read -> Bash`

### サブエージェントの確認

```bash
claude -p "プロンプト" --output-format json 2>&1 | \
  jq -r '.[] | select(.type == "assistant") | .message.content[] | select(.type == "tool_use" and .name == "Task") | .input.subagent_type'
```

出力例: `line-counter`

## スキルのテスト

### スキルが認識されているか確認

```bash
claude -p "テスト" --output-format json 2>&1 | \
  jq -r '.[] | select(.type == "system") | .skills'
```

出力例: `["tech-stack", "coding-style"]`

### Skill ツールが呼ばれたか確認

```bash
claude -p "プロンプト" --output-format json 2>&1 | \
  jq -r '.[] | select(.type == "assistant") | .message.content[] | select(.type == "tool_use" and .name == "Skill") | .input.skill'
```

### スキルを確実に発動させる方法

| 方法 | コマンド |
|------|---------|
| Skill ツールを許可 | `--allowed-tools "Skill,Read,Bash"` |
| 全権限バイパス | `--dangerously-skip-permissions` |
| settings.json で永続設定 | `"allow": ["Skill(*)"]` |

**テスト例:**

```bash
# Skill ツール許可なし（発動しにくい）
claude -p "テストコードを書いて"

# Skill ツール許可あり（発動する）
claude -p "テストコードを書いて" --allowed-tools "Skill,Read,Write"

# 明示的に参照（最も確実）
claude -p "このプロジェクトの規約に従ってテストコードを書いて" --allowed-tools "Skill,Read,Write"
```

## サブエージェントのテスト

### エージェントが認識されているか確認

```bash
claude -p "テスト" --output-format json 2>&1 | \
  jq -r '.[] | select(.type == "system") | .agents'
```

出力例: `["general-purpose", "Explore", "line-counter"]`

### エージェントが呼ばれたか確認

```bash
claude -p "プロンプト" --output-format json 2>&1 | \
  jq -r '.[] | select(.type == "assistant") | .message.content[] | select(.type == "tool_use" and .name == "Task") | .input'
```

### 発動率を上げるコツ

#### 1. description を最適化

```yaml
# ❌ 曖昧
description: ファイルを処理する

# ✅ 具体的なトリガーを列挙
description: ファイルの行数をカウント。「行数を数えて」「何行ある？」「wc して」で使用。
```

#### 2. CLAUDE.md にルールを追加（最も効果的）

```markdown
# CLAUDE.md

## line-counter エージェント

ユーザーが以下のいずれかを尋ねた場合、**必ず** Task ツールで
`line-counter` エージェント（subagent_type='line-counter'）を使用すること：

- ファイルの行数について（例: 「行数を数えて」「何行ある？」）
- 行のカウントについて（例: 「カウントして」「wc して」）

直接 Bash で処理せず、必ず line-counter エージェントに委譲すること。
```

#### 3. 発動率の比較テスト

```bash
# CLAUDE.md なし
claude -p "sample.txt の行数を数えて" --output-format json 2>&1 | \
  jq -r '.[] | select(.type == "assistant") | .message.content[] | select(.type == "tool_use" and .name == "Task") | .input.subagent_type // "NOT_CALLED"'

# CLAUDE.md あり（同じプロンプトで再テスト）
# → 発動率が向上することを確認
```

## 出力形式のテスト

### サブエージェントの出力形式が守られるか

```bash
# 親が再フォーマットする可能性あり
claude -p "line-counter でファイルを分析して"

# 「そのまま表示して」で形式を保持
claude -p "line-counter でファイルを分析して。結果をそのまま表示して"
```

## A/B テストの実施

### 複数パターンを比較

```bash
#!/bin/bash

PROMPTS=(
  "行数を数えて"
  "何行ある？"
  "wc して"
  "ライン数は？"
)

for prompt in "${PROMPTS[@]}"; do
  echo "=== $prompt ==="
  result=$(claude -p "$prompt sample.txt" --output-format json 2>&1 | \
    jq -r '.[] | select(.type == "assistant") | .message.content[] | select(.type == "tool_use" and .name == "Task") | .input.subagent_type // "DIRECT"')
  echo "→ $result"
done
```

## チェックリスト

### スキル作成時

- [ ] `name` は小文字・数字・ハイフンのみ（64文字以内）
- [ ] `description` にトリガーとなる語句を含める
- [ ] `allowed-tools` はカンマ区切り文字列
- [ ] テスト: `claude -p` で発動確認

### サブエージェント作成時

- [ ] `.claude/agents/` に配置
- [ ] `description` に具体的なトリガー例を列挙
- [ ] CLAUDE.md に起動ルールを追加（推奨）
- [ ] テスト: Task ツールが呼ばれるか確認

### 発動しない場合のトラブルシューティング

| 症状 | 原因 | 対策 |
|------|------|------|
| スキルが適用されない | Skill ツールが許可されていない | `--allowed-tools "Skill"` |
| エージェントが呼ばれない | description がマッチしない | CLAUDE.md にルール追加 |
| 出力形式が崩れる | 親が再フォーマット | 「そのまま表示して」を追加 |
| 権限エラー | ツールがブロックされている | `--allowed-tools` で許可 |

## 便利なワンライナー

```bash
# スキル一覧
claude -p "test" --output-format json 2>&1 | jq -r '.[] | select(.type == "system") | .skills'

# エージェント一覧
claude -p "test" --output-format json 2>&1 | jq -r '.[] | select(.type == "system") | .agents'

# 使用ツール一覧
claude -p "プロンプト" --output-format json 2>&1 | jq -r '[.[] | select(.type == "assistant") | .message.content[] | select(.type == "tool_use") | .name] | unique'

# 権限拒否の確認
claude -p "プロンプト" --output-format json 2>&1 | jq -r '.[] | select(.type == "result") | .permission_denials'
```

## 関連ドキュメント

- [スキルの検証詳細](./test-skills.md) - 実験結果と詳細な分析
- [SKILL.md 形式](../reference/skill-md.md) - スキルの仕様
- [スキルを作成する](./create-skill.md) - 基本的な作成手順
