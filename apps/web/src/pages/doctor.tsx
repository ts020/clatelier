import { useCallback, useEffect, useState } from "react";

interface CheckResult {
	name: string;
	status: "ok" | "error";
	message: string;
	latency?: number;
}

interface DoctorResponse {
	status: "healthy" | "unhealthy";
	timestamp: string;
	checks: CheckResult[];
}

export function DoctorPage() {
	const [data, setData] = useState<DoctorResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchDoctorData = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/doctor");
			if (!res.ok) {
				throw new Error(`HTTP ${res.status}`);
			}
			const json = await res.json();
			setData(json);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Unknown error");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchDoctorData();
	}, [fetchDoctorData]);

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-2xl mx-auto">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Doctor</h1>
					<button
						type="button"
						onClick={fetchDoctorData}
						disabled={loading}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
					>
						{loading ? "Checking..." : "Refresh"}
					</button>
				</div>

				{error && (
					<div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-800">
						Error: {error}
					</div>
				)}

				{data && (
					<>
						<div
							className={`mb-6 p-4 rounded-lg ${
								data.status === "healthy"
									? "bg-green-100 border border-green-300"
									: "bg-red-100 border border-red-300"
							}`}
						>
							<div className="flex items-center gap-2">
								<span
									className={`w-3 h-3 rounded-full ${
										data.status === "healthy" ? "bg-green-500" : "bg-red-500"
									}`}
								/>
								<span className="font-semibold text-lg">
									{data.status === "healthy"
										? "All Systems Operational"
										: "Issues Detected"}
								</span>
							</div>
							<p className="text-sm text-gray-600 mt-1">
								Last checked: {new Date(data.timestamp).toLocaleString()}
							</p>
						</div>

						<div className="space-y-3">
							{data.checks.map((check) => (
								<div
									key={check.name}
									className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<span
												className={`w-2.5 h-2.5 rounded-full ${
													check.status === "ok" ? "bg-green-500" : "bg-red-500"
												}`}
											/>
											<span className="font-medium text-gray-900">
												{check.name}
											</span>
										</div>
										{check.latency !== undefined && (
											<span className="text-sm text-gray-500">
												{check.latency}ms
											</span>
										)}
									</div>
									<p className="mt-1 text-sm text-gray-600 ml-5">
										{check.message}
									</p>
								</div>
							))}
						</div>
					</>
				)}
			</div>
		</div>
	);
}
