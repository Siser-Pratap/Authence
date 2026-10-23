import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  use: {
    baseURL: process.env.AUTHENCE_TEST_URL || "https://localhost:3443",
    // Only the short-lived, locally generated CI certificate is self-signed.
    ignoreHTTPSErrors: true,
    trace: "off",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  reporter: "list",
});
