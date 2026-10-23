import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";

test("database outage returns a safe server error without reflecting credentials", async () => {
  const base = process.env.AUTHENCE_TEST_URL;
  assert.ok(["localhost", "127.0.0.1"].includes(new URL(base).hostname));
  assert.ok(process.env.MONGODB_DB_NAME?.startsWith("authence_test"));
  const password = randomUUID();
  const response = await fetch(base + "/api/auth/sign-in/email", {
    method: "POST",
    headers: { Origin: new URL(base).origin, "Content-Type": "application/json" },
    body: JSON.stringify({ email: "outage@example.test", password }),
  });
  assert.ok([500, 503].includes(response.status), "Expected a safe server error during database outage");
  const text = await response.text();
  for (const value of [password, process.env.MONGODB_URI, process.env.BETTER_AUTH_SECRET]) {
    if (value) assert.ok(!text.includes(value), "Sensitive input reflected in an outage response");
  }
  assert.match(response.headers.get("cache-control"), /no-store/);
});
