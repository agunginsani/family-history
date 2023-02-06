import { faker } from "@faker-js/faker";
import { test, expect } from "@playwright/test";
import { login, logout } from "./utils/authentication";

test("Admin can CRUD menu", async ({ page }) => {
  await page.goto("/");

  const main = page.getByRole("main");
  const table = main.getByRole("table", { name: "Role Menus" });
  const name = faker.word.noun();

  await login({ page });

  /* -------------------------------- Add menu ------------------------------- */
  await page
    .getByRole("list", { name: "Menu" })
    .getByRole("link", { name: "Menu", exact: true })
    .click();

  await main.getByRole("button", { name: "Add" }).click();

  await main.getByLabel("Name").fill(name);
  await main.getByLabel("path").fill(faker.internet.domainWord());

  await main.getByRole("button", { name: "Submit" }).click();
  await main.getByRole("button", { name: "Cancel" }).click();
  
  /* -------------------------------------------------------------------------- */

  /* ------------------------------ Add role menu ----------------------------- */
   
  await page
    .getByRole("list", { name: "Menu" })
    .getByRole("link", { name: "Role Menu", exact: true })
    .click();

  await expect(page.getByRole("heading", { name: "Role Menus" })).toBeVisible();

  await main.getByRole("button", { name: "Add" }).click();

  await expect(
    page.getByRole("heading", { name: "Add Role Menu" })
  ).toBeVisible();

  await main.getByLabel("Role").click();
  await page
    .getByRole("listbox")
    .getByRole("option", { name: "ADMIN" })
    .click();

  await main.getByLabel("Menu").click();
  await page.getByRole("listbox").getByRole("option", { name }).click();

  await main.getByRole("button", { name: "Submit" }).click();
  await expect(main.getByRole("alert")).toHaveText(
    `ADMIN role can access ${name} menu now!`
  );

  await main.getByRole("button", { name: "Cancel" }).click();
  
  /* -------------------------------------------------------------------------- */

  await expect(table.getByRole("row").filter({ hasText: name })).toBeVisible();

  await table
    .getByRole("row")
    .filter({ hasText: name })
    .getByRole("button", { name: "Delete" })
    .click();

  await expect(
    table.getByRole("row").filter({ hasText: name })
  ).not.toBeVisible();

  await logout(page);
});
