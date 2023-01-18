import { faker } from "@faker-js/faker";
import { test, expect } from "@playwright/test";
import { login, logout } from "./utils/authentication";

test("Admin can CRUD menu", async ({ page }) => {
  await page.goto("/");

  const main = page.getByRole("main");
  const table = main.getByRole("table", { name: "Menus" });

  await login(page);

  await page
    .getByRole("list", { name: "Menu" })
    .getByRole("link", { name: "Menu", exact: true })
    .click();

  await expect(page.getByRole("heading", { name: "Menus" })).toBeVisible();

  /**
   * Add menu.
   */

  await main.getByRole("button", { name: "Add" }).click();

  await expect(page.getByRole("heading", { name: "Add Menu" })).toBeVisible();

  let name = faker.word.noun();

  await main.getByLabel("Name").fill(name);
  await main.getByLabel("path").fill(faker.internet.domainWord());

  await main.getByRole("button", { name: "Submit" }).click();
  await expect(main.getByRole("alert")).toHaveText(`${name} has been added!`);

  await main.getByRole("button", { name: "Cancel" }).click();

  await expect(table.getByRole("cell", { name, exact: true })).toBeVisible();

  /**
   * Edit menu.
   */

  await table.getByRole("link", { name: `Edit ${name}` }).click();

  await expect(page.getByRole("heading", { name: "Edit Menu" })).toBeVisible();

  name = faker.word.noun();

  await main.getByLabel("Name").fill(name);

  await main.getByRole("button", { name: "Submit" }).click();
  await expect(main.getByRole("alert")).toHaveText(`Update success!`);

  await main.getByRole("button", { name: "Cancel" }).click();

  await expect(table.getByRole("cell", { name, exact: true })).toBeVisible();

  /**
   * Delete menu.
   */

  await table.getByRole("button", { name: `Delete ${name}` }).click();
  await expect(
    table.getByRole("cell", { name, exact: true })
  ).not.toBeVisible();

  await logout(page);
});
