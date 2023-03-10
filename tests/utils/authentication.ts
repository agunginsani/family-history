import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

type LoginArgs = {
  page: Page;
  email?: string;
  password?: string;
};

export async function login({ page, ...args }: LoginArgs) {
  await expect(
    page.getByRole("heading", { name: "Who are you?" })
  ).toBeVisible();

  const email = args.email ?? "admin@test.com";
  const password = args.password ?? "admin";

  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Submit" }).click();
}

export async function logout(page: Page) {
  await page.getByRole("button", { name: "Open avatar menu" }).click();
  await page.getByRole("button", { name: "Log out" }).click();
}
