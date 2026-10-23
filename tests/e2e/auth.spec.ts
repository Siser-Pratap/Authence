import { test, expect } from "@playwright/test";
import { randomUUID } from "node:crypto";

test("registration, sign-in, reload, and sign-out through the browser", async ({ page, context }) => {
  const name = "browser_" + randomUUID().replaceAll("-", "").slice(0,12);
  const email = name + "@example.test";
  const password = randomUUID() + "!Strong";
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/sign-in$/);
  await page.getByRole("link", { name: "Create an account" }).click();
  await page.getByLabel("Username", { exact: true }).fill(name);
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Confirm password", { exact: true }).fill(password + "different");
  await page.getByRole("button", { name: "Create account", exact: true }).click();
  await expect(page.locator("form").getByRole("alert")).toHaveText("Your passwords do not match.");
  await page.getByLabel("Confirm password", { exact: true }).fill(password);
  await page.getByLabel("Confirm password", { exact: true }).press("Enter");
  await expect(page).toHaveURL(/\/sign-in\?registered=1$/);
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Welcome, " + name + "." })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Welcome, " + name + "." })).toBeVisible();
  const sessionCookie = (await context.cookies()).find((cookie) => cookie.name.includes("session_token"));
  expect(sessionCookie?.httpOnly).toBe(true);
  expect(sessionCookie?.secure).toBe(true);
  expect((await context.request.get("/api/me")).status()).toBe(200);
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(page).toHaveURL(/\/sign-in$/);
  expect((await context.request.get("/api/me")).status()).toBe(401);
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/sign-in$/);
  await page.goBack();
  await expect(page.getByRole("heading", { name: "Welcome, " + name + "." })).not.toBeVisible();
  expect(pageErrors).toEqual([]);
});

test("sign-in rejects wrong credentials with useful feedback and clears pending state", async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByLabel("Email", { exact: true }).fill("missing_" + randomUUID() + "@example.test");
  await page.getByLabel("Password", { exact: true }).fill(randomUUID());
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText("We could not sign you in.");
  await expect(page.getByRole("button", { name: "Sign in", exact: true })).toBeEnabled();
});

test("auth forms fit a narrow viewport and legacy login redirects", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/login/");
  await expect(page).toHaveURL(/\/sign-in$/);
  await expect(page.getByRole("heading", { name: "Sign in", exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});


test("network failure allows retry without leaving the form pending", async ({ page }) => {
  await page.goto("/sign-in");
  await page.route("**/api/auth/sign-in/email", (route) => route.abort("failed"));
  await page.getByLabel("Email", { exact: true }).fill("network@example.test");
  await page.getByLabel("Password", { exact: true }).fill(randomUUID());
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText(/temporarily unavailable|could not reach/i);
  await expect(page.getByRole("button", { name: "Sign in", exact: true })).toBeEnabled();
});
