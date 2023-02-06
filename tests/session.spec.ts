import { faker } from "@faker-js/faker";
import { test, expect } from "@playwright/test";
import { formatDate } from "~/utils/date";
import { login, logout } from "./utils/authentication";

test("Admin can CRUD session", async ({ page }) => {
  await page.goto("/");

  const main = page.getByRole("main");
  const table = main.getByRole("table", { name: "Sessions" });
  const name = faker.name.fullName();
  const email = faker.internet.email();
  const password = "P@ssw0rd";

  await login({ page });

  /* -------------------------------- Add user -------------------------------- */

  await page
    .getByRole("list", { name: "Menu" })
    .getByRole("link", { name: "User" })
    .click();

  await main.getByRole("button", { name: "Add" }).click();

  await main.getByLabel("Name").fill(name);
  await main.getByLabel("Email").fill(email);
  await main.getByLabel("Male", { exact: true }).check();
  await main
    .getByLabel("Date of Birth")
    .fill(formatDate(faker.date.birthdate(), "yyyy-MM-dd"));
  await main.getByLabel("Role").click();
  await page
    .getByRole("listbox")
    .getByRole("option", { name: "ADMIN" })
    .click();

  await main.getByRole("button", { name: "Submit" }).click();

  /* -------------------------------------------------------------------------- */

  await logout(page);

  await login({ page, email, password });

  await page
    .getByRole("list", { name: "Menu" })
    .getByRole("link", { name: "Session" })
    .click();

  await expect(page.getByRole("heading", { name: "Sessions" })).toBeVisible();

  await expect(table.getByRole("row").filter({ hasText: email })).toBeVisible();

  await table
    .getByRole("row")
    .filter({ hasText: email })
    .getByRole("button", { name: "Delete" })
    .click();

  await expect(
    page.getByRole("heading", { name: "Who are you?" })
  ).toBeVisible();

  await login({ page });

  await page
    .getByRole("list", { name: "Menu" })
    .getByRole("link", { name: "User" })
    .click();

  await page
    .getByRole("table", { name: "Users" })
    .getByRole("row")
    .filter({ hasText: email })
    .getByRole("button", { name: "Delete" })
    .click();

  await logout(page);
});
