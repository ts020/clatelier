import devServer from "@hono/vite-dev-server";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		devServer({
			entry: "./src/server.ts",
			exclude: [
				/^\/@.+$/,
				/.*\.(ts|tsx|css|html|js|jsx|json|png|jpg|jpeg|gif|svg|ico|woff|woff2)(\?.*)?$/,
				/^\/src\/.+$/,
				/^\/node_modules\/.+$/,
				/^\/$/,
				/^\/doctor$/,
			],
		}),
	],
	appType: "spa",
	test: {
		exclude: ["**/node_modules/**", "**/e2e/**"],
	},
});
