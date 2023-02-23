import { test, expect } from "@playwright/test";

test("Star Page", async ({ page }) => {
  await page.goto("http://localhost:3000/users/arippberger");

  await expect(page.getByPlaceholder("username")).toHaveValue("arippberger");

  await page.locator('[id="headlessui-menu-button-\\:r0\\:"]').click();
  await page.getByRole("menuitem", { name: "View" }).click();

  await expect(page.getByRole("link", { name: "Back" })).toBeVisible();
  await expect(page.getByRole("img", { name: "telescope" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
