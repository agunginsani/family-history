import { faker } from "@faker-js/faker";
import { test, expect } from "@playwright/test";
import { formatDate } from "~/utils/date";

test("Admin can CRUD user", async ({ page }) => {
  await page.goto("/");

  const main = page.getByRole("main");
  const table = main.getByRole("table", { name: "Users" });

  await expect(
    page.getByRole("heading", { name: "Who are you?" })
  ).toBeVisible();

  const email = "admin@test.com";
  const password = "admin";

  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Submit" }).click();

  await page
    .getByRole("list", { name: "Menu" })
    .getByRole("link", { name: "User" })
    .click();

  await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();

  /**
   * Add user.
   */

  await main.getByRole("button", { name: "Add" }).click();

  await expect(page.getByRole("heading", { name: "Add User" })).toBeVisible();

  let name = faker.name.fullName();

  await main.getByLabel("Name").fill(name);
  await main.getByLabel("Email").fill(faker.internet.email());
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
  await expect(main.getByRole("alert")).toHaveText(`${name} has been added!`);

  await main.getByRole("button", { name: "Cancel" }).click();

  await expect(table.getByRole("cell", { name, exact: true })).toBeVisible();

  /**
   * Edit user.
   */

  await table.getByRole("link", { name: `Edit ${name}` }).click();

  await expect(page.getByRole("heading", { name: "Edit User" })).toBeVisible();

  name = faker.name.fullName();

  await main.getByLabel("Name").fill(name);

  await main.getByRole("button", { name: "Submit" }).click();
  await expect(main.getByRole("alert")).toHaveText(`Update success!`);

  await main.getByRole("button", { name: "Cancel" }).click();

  await expect(table.getByRole("cell", { name, exact: true })).toBeVisible();

  /**
   * Delete user.
   */

  await table.getByRole("button", { name: `Delete ${name}` }).click();
  await expect(
    table.getByRole("cell", { name, exact: true })
  ).not.toBeVisible();

  await page.getByRole("button", { name: "Open avatar menu" }).click();
  await page.getByRole("button", { name: "Log out" }).click();
});