import { faker } from "@faker-js/faker";
import { test, expect } from "@playwright/test";

test("User can login and logout", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Who are you?" })
  ).toBeVisible();

  const email = "admin@test.com";
  const password = "admin";
  const name = "Admin";

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Submit" }).click();

  await page.getByRole("button", { name: "Open avatar menu" }).click();
  await expect(page.getByText(name)).toBeVisible();
  await page.getByRole("button", { name: "Log out" }).click();

  await expect(
    page.getByRole("heading", { name: "Who are you?" })
  ).toBeVisible();
});

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
