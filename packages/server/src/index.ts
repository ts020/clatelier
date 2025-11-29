import type { Skill } from "@clatelier/shared";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";

const app = new Hono();

const startTime = Date.now();

interface CheckResult {
	name: string;
	status: "ok" | "error";
	message: string;
	latency?: number;
}

const routes = app
	.get("/api/health", (c) => {
		return c.json({ status: "ok" });
	})
	.get("/api/doctor", async (c) => {
		const checks: CheckResult[] = [];

		// API Health Check
		const apiStart = Date.now();
		checks.push({
			name: "API Server",
			status: "ok",
			message: "Hono server is running",
			latency: Date.now() - apiStart,
		});

		// Uptime
		const uptimeMs = Date.now() - startTime;
		const uptimeSec = Math.floor(uptimeMs / 1000);
		checks.push({
			name: "Uptime",
			status: "ok",
			message: `${uptimeSec} seconds`,
		});

		// Memory Usage
		const memUsage = process.memoryUsage();
		const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
		const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
		checks.push({
			name: "Memory",
			status: heapUsedMB < heapTotalMB * 0.9 ? "ok" : "error",
			message: `${heapUsedMB}MB / ${heapTotalMB}MB`,
		});

		// Node.js Version
		checks.push({
			name: "Node.js",
			status: "ok",
			message: process.version,
		});

		// Environment
		checks.push({
			name: "Environment",
			status: "ok",
			message: process.env.NODE_ENV || "development",
		});

		const allOk = checks.every((check) => check.status === "ok");

		return c.json({
			status: allOk ? "healthy" : "unhealthy",
			timestamp: new Date().toISOString(),
			checks,
		});
	})
	.get("/api/skills", (c) => {
		const skills: Skill[] = [
			{ id: "1", name: "example-skill", description: "An example skill" },
		];
		return c.json(skills);
	})
	.get("/api/skills/:id", (c) => {
		const id = c.req.param("id");
		return c.json({
			id,
			name: "example-skill",
			description: "An example skill",
		});
	})
	.get("/api/stream", (c) => {
		return streamSSE(c, async (stream) => {
			await stream.writeSSE({
				data: JSON.stringify({ type: "chunk", data: "Hello from stream" }),
			});
			await stream.writeSSE({
				data: JSON.stringify({ type: "done", data: "" }),
			});
		});
	});

export type AppType = typeof routes;
export default app;
