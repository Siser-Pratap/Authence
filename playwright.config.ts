import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.AUTHENCE_TEST_URL || "https://localhost:3443";
if (!process.env.MONGODB_DB_NAME?.startsWith("authence_test") || !["localhost", "127.0.0.1"].includes(new URL(baseURL).hostname)) {
  throw new Error("Browser tests require a loopback server and an authence_test database");
}

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  use: {
    baseURL,
    // Only the short-lived, locally generated CI certificate is self-signed.
    ignoreHTTPSErrors: true,
    trace: "off",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  reporter: "list",
});
