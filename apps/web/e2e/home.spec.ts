import { expect, test } from "@playwright/test";

test("homepage displays Clatelier title", async ({ page }) => {
	await page.goto("/");
	await expect(page.locator("h1")).toContainText("Clatelier");
});

test("homepage displays skill cards", async ({ page }) => {
	await page.goto("/");
	await expect(page.locator("text=example-skill")).toBeVisible();
});

test("API health check returns ok", async ({ request }) => {
	const response = await request.get("/api/health");
	expect(response.ok()).toBeTruthy();
	const json = await response.json();
	expect(json.status).toBe("ok");
});

test("API skills returns skill list", async ({ request }) => {
	const response = await request.get("/api/skills");
	expect(response.ok()).toBeTruthy();
	const skills = await response.json();
	expect(Array.isArray(skills)).toBeTruthy();
	expect(skills.length).toBeGreaterThan(0);
	expect(skills[0]).toHaveProperty("id");
	expect(skills[0]).toHaveProperty("name");
});
