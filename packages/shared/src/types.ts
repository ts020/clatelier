export interface Skill {
	id: string;
	name: string;
	description: string;
}

export interface SkillGraph {
	id: string;
	name: string;
	nodes: SkillNode[];
	edges: SkillEdge[];
}

export interface SkillNode {
	id: string;
	type: string;
	position: { x: number; y: number };
	data: Record<string, unknown>;
}

export interface SkillEdge {
	id: string;
	source: string;
	target: string;
}

export interface StreamMessage {
	type: "chunk" | "done" | "error";
	data: string;
}
