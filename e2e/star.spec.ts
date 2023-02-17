import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:3000/users/arippberger");

  await expect(page.getByPlaceholder("arippberger")).toHaveValue("arippberger");

  await page.locator('[id="headlessui-menu-button-\\:r0\\:"]').click();
  await page.getByRole("menuitem", { name: "View" }).click();

  await expect(page.getByRole("link", { name: "Back" })).toBeVisible();
  await expect(
    page.getByRole("img", { name: "telescope repository image" })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "telescope" })).toBeVisible();
});
