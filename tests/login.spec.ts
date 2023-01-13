import { test, expect } from "@playwright/test";
import { user } from "./utils/global-setup";

test("User can login and logout", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Who are you?" })
  ).toBeVisible();

  await page.getByRole("textbox", { name: "Email" }).type(user.email);
  await page.getByRole("textbox", { name: "Password" }).type(user.password);
  await page.getByRole("button", { name: "Submit" }).click();

  const logOutButton = page.getByRole("button", { name: "Log out" });
  const userFullNameText = page.getByText(user.name);
  await expect(logOutButton).not.toBeVisible();
  await expect(userFullNameText).not.toBeVisible();
  await page.getByRole("button", { name: "Open avatar menu" }).click();
  await expect(userFullNameText).toBeVisible();
  await logOutButton.click();

  await expect(
    page.getByRole("heading", { name: "Who are you?" })
  ).toBeVisible();
});
