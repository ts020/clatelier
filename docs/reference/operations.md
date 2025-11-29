# Operations リファレンス

Claude から返される SkillGraph への編集内容は Operation の配列として表現される。

## 共通フィールド

すべての Operation は以下の共通フィールドを持つ。

| フィールド | 型 | 説明 |
|-----------|------|------|
| operationId | string | 操作の一意識別子 |
| kind | OperationKind | 操作種別 |
| humanReadableDescription | string | 操作の説明（人間可読） |

## Operation 種別

### ノード追加（addNode）

新しいノードをグラフに追加する。

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| node | Node | Yes | 新ノードのプロパティ |
| insertAfter | string? | No | このノードの後に挿入 |
| insertBefore | string? | No | このノードの前に挿入 |
| parentHint | string? | No | 親子関係のヒント |

**備考**: ID 採番をサーバ側に任せるか、クライアントが指定するかは実装による。

### ノード削除（deleteNode）

指定したノードをグラフから削除する。

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| nodeId | string | Yes | 削除対象ノード ID |
| edgePolicy | EdgePolicy? | No | 接続エッジの扱い（デフォルト: cascade） |

**EdgePolicy**:
- `cascade`: 接続されているエッジも自動削除（デフォルト）
- `reconnect`: 前後のノードを再接続
- `error`: エッジが存在する場合はエラー

### ノード更新（updateNode）

既存ノードのプロパティを変更する。

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| nodeId | string | Yes | 対象ノード ID |
| label | string? | No | 新しいラベル |
| markdown | string? | No | 新しい Markdown |
| type | SkillGraphNodeType? | No | 新しいノード種別 |
| toolName | string? | No | 新しいツール名 |

**備考**: 指定されたフィールドのみ更新される（部分更新）。

### エッジ追加（addEdge）

2 つのノード間にエッジを追加する。

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| source | string | Yes | 接続元ノード ID |
| target | string | Yes | 接続先ノード ID |
| metadata | object? | No | 条件式などのメタデータ |

**競合時の振る舞い**: 同じ source/target ペアのエッジが存在する場合、デフォルトでは上書きする。

### エッジ削除（deleteEdge）

エッジを削除する。ID またはノードペアで指定可能。

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| edgeId | string? | No* | 対象エッジ ID |
| source | string? | No* | 接続元ノード ID |
| target | string? | No* | 接続先ノード ID |

**\*** `edgeId` または `source` + `target` のいずれかが必須。

## 原子性

1 回の編集リクエストは Operation の集合として扱われる。

- **すべて適用されるか、まったく適用されないか**のどちらか
- 途中まで適用された状態は永続化されない
- いずれかの Operation が不変条件に違反する場合、集合全体が拒否される

## バリデーション

Operation 適用時に以下の検証が行われる：

1. JSON としてパース可能か
2. Operation スキーマに適合するか
3. 適用後も SkillGraph の不変条件が満たされるか

いずれかの検証に失敗した場合、グラフは変更されない。
