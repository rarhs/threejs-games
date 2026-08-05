import { expect, test } from "@playwright/test";

test("boots and renders without errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(String(err)));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  await page.goto("/");
  await expect(page.locator("canvas")).toBeVisible();

  // Let the render loop run a few frames so per-frame errors surface.
  await page.waitForTimeout(500);
  expect(errors).toEqual([]);
});
