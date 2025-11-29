# エンティティ定義

## Skill

スキルの基本構造。

```typescript
interface Skill {
  id: string;           // 一意識別子（UUID）
  name: string;         // 小文字・ハイフン・数字のみ（64文字以内）
  description: string;  // 説明（1024文字以内）
  nodes: SkillNode[];   // 構成ノード
  metadata: SkillMetadata;
}

interface SkillMetadata {
  createdAt: Date;
  updatedAt: Date;
  version: string;
}
```

## SkillNode

スキルグラフを構成するノード。

```typescript
interface SkillNode {
  id: string;
  type: 'instruction' | 'tool' | 'example' | 'decision';
  content: string;
  position: { x: number; y: number };
  edges: SkillEdge[];
}
```

### ノードタイプ別の構造

```typescript
// instruction ノード
interface InstructionNode extends SkillNode {
  type: 'instruction';
  content: string;  // 手順・指示内容
}

// tool ノード
interface ToolNode extends SkillNode {
  type: 'tool';
  content: string;  // ツール名とパターン（例: "Bash(npm:*)"）
}

// example ノード
interface ExampleNode extends SkillNode {
  type: 'example';
  content: string;  // 入力例と期待出力
}

// decision ノード
interface DecisionNode extends SkillNode {
  type: 'decision';
  content: string;  // 条件式
}
```

## SkillEdge

ノード間の接続。

```typescript
interface SkillEdge {
  id: string;
  source: string;  // 接続元ノードID
  target: string;  // 接続先ノードID
  label?: string;  // 条件ラベル（decisionノード用: "Yes"/"No"）
}
```

## 集約

```
Skill（集約ルート）
  └── SkillNode[]
        └── SkillEdge[]
```

- **Skill** が集約ルートとして SkillNode を所有
- SkillNode が SkillEdge を所有
- Skill の外から直接 SkillNode を操作しない

## 境界づけられたコンテキスト

```
┌─────────────────────────────────────┐
│  スキル管理コンテキスト               │
│  - Skill CRUD                       │
│  - SkillGraph 編集                  │
│  - SKILL.md 生成                    │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Claude Code 実行コンテキスト         │
│  - Skill 読み込み                    │
│  - Agent 実行                       │
│  - Command 実行                     │
└─────────────────────────────────────┘
```
