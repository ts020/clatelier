import { exec } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { platform } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import serverApp from "@clatelier/server";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function openBrowser(url: string) {
	const cmd =
		platform() === "darwin"
			? "open"
			: platform() === "win32"
				? "start"
				: "xdg-open";
	exec(`${cmd} ${url}`);
}

async function main() {
	const port = Number(process.env.PORT) || 3000;
	const host = process.env.HOST || "localhost";
	const noBrowser = process.argv.includes("--no-browser");

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
			const url = `http://${info.address}:${info.port}`;
			console.log(`\nClatelier is running at ${url}`);
			console.log("Press Ctrl+C to stop\n");

			if (!noBrowser) {
				openBrowser(url);
			}
		},
	);
}

main();
