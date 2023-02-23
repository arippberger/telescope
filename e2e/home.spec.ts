import { test, expect } from "@playwright/test";

test("Home Page", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.getByPlaceholder("username").click();
  await page.getByPlaceholder("username").fill("arippberger");
  await page.getByRole("link", { name: "Search" }).click();

  await expect(page).toHaveURL("http://localhost:3000/users/arippberger");
  await expect(
    page.getByRole("heading", { name: "arippberger's GitHub Stars" })
  ).toBeVisible();
});
