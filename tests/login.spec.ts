import { faker } from "@faker-js/faker";
import { test, expect } from "@playwright/test";

test("User cannot login with invalid credentials", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Who are you?" })
  ).toBeVisible();

  await page.getByLabel("Email").fill(faker.internet.email());
  await page.getByLabel("Password").fill(faker.internet.password());
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page.getByRole("alert")).toHaveText("Invalid credentials!");
});
