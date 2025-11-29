import type { Skill } from "@clatelier/shared";
import { SkillCard } from "@clatelier/ui";
import { useEffect, useState, useSyncExternalStore } from "react";
import { DoctorPage } from "./pages/doctor";

function useLocation() {
	return useSyncExternalStore(
		(callback) => {
			window.addEventListener("popstate", callback);
			return () => window.removeEventListener("popstate", callback);
		},
		() => window.location.pathname,
	);
}

function HomePage() {
	const [skills, setSkills] = useState<Skill[]>([]);

	useEffect(() => {
		fetch("/api/skills")
			.then((res) => res.json())
			.then(setSkills);
	}, []);

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<h1 className="text-3xl font-bold text-gray-900 mb-8">Clatelier</h1>
			<div className="grid gap-4">
				{skills.map((skill) => (
					<SkillCard key={skill.id} skill={skill} />
				))}
			</div>
			<div className="mt-8">
				<a href="/doctor" className="text-blue-600 hover:underline">
					System Status
				</a>
			</div>
		</div>
	);
}

export function App() {
	const pathname = useLocation();

	if (pathname === "/doctor") {
		return <DoctorPage />;
	}

	return <HomePage />;
}
