import type { Skill } from "@clatelier/shared";

interface SkillCardProps {
	skill: Skill;
	onClick?: () => void;
}

export function SkillCard({ skill, onClick }: SkillCardProps) {
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			onClick?.();
		}
	};

	return (
		<div
			className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
			onClick={onClick}
			onKeyDown={handleKeyDown}
			tabIndex={onClick ? 0 : undefined}
			role={onClick ? "button" : undefined}
		>
			<h3 className="font-semibold text-gray-900">{skill.name}</h3>
			<p className="text-sm text-gray-600 mt-1">{skill.description}</p>
		</div>
	);
}
