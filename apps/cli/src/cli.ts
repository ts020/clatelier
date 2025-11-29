import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import serverApp from "../../../packages/server/src/index";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
	const port = Number(process.env.PORT) || 3000;
	const host = process.env.HOST || "localhost";

	// Resolve the public directory (built web assets)
	const publicDir = resolve(__dirname, "../public");

	if (!existsSync(publicDir)) {
		console.error(`Error: public directory not found at ${publicDir}`);
		console.error("Make sure to run 'pnpm build' first.");
		process.exit(1);
	}

	const app = new Hono();

	// Mount API routes from server package
	app.route("/", serverApp);

	// Serve static files
	app.use(
		"/*",
		serveStatic({
			root: publicDir,
			rewriteRequestPath: (path) => path,
		}),
	);

	// SPA fallback - serve index.html for all non-API, non-static routes
	app.get("*", (c) => {
		const indexPath = join(publicDir, "index.html");
		const html = readFileSync(indexPath, "utf-8");
		return c.html(html);
	});

	console.log("Starting Clatelier...");

	serve(
		{
			fetch: app.fetch,
			port,
			hostname: host,
		},
		(info) => {
			console.log(
				`\nClatelier is running at http://${info.address}:${info.port}`,
			);
			console.log("Press Ctrl+C to stop\n");
		},
	);
}

main();
