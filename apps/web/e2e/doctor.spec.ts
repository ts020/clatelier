import { expect, test } from "@playwright/test";

test("doctor page displays system status", async ({ page }) => {
	await page.goto("/doctor");
	await expect(page.locator("h1")).toContainText("Doctor");
});

test("doctor page shows health checks", async ({ page }) => {
	await page.goto("/doctor");
	await expect(page.locator("text=All Systems Operational")).toBeVisible();
	await expect(page.locator("text=API Server")).toBeVisible();
	await expect(page.locator("text=Node.js")).toBeVisible();
});

test("doctor API returns healthy status", async ({ request }) => {
	const response = await request.get("/api/doctor");
	expect(response.ok()).toBeTruthy();
	const json = await response.json();
	expect(json.status).toBe("healthy");
	expect(json.checks).toBeDefined();
	expect(Array.isArray(json.checks)).toBeTruthy();
});

test("doctor page refresh button works", async ({ page }) => {
	await page.goto("/doctor");
	const refreshButton = page.locator("button", { hasText: "Refresh" });
	await expect(refreshButton).toBeVisible();
	await refreshButton.click();
	await expect(page.locator("text=All Systems Operational")).toBeVisible();
});
