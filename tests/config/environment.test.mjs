import assert from "node:assert/strict";
import test from "node:test";
import { parseAuthConfig } from "../../src/lib/config.ts";

const valid = {
  MONGODB_URI: "mongodb://127.0.0.1:27017",
  MONGODB_DB_NAME: "authence_test",
  BETTER_AUTH_SECRET: "s".repeat(32),
  BETTER_AUTH_URL: "http://localhost:3000",
  NODE_ENV: "test",
};

test("configuration accepts isolated local development and canonicalizes the origin", () => {
  const config = parseAuthConfig({ ...valid, BETTER_AUTH_URL: "http://localhost:3000/" });
  assert.equal(config.authOrigin, "http://localhost:3000");
  assert.equal(config.databaseName, "authence_test");
});

test("missing configuration names fields without including supplied secrets", () => {
  assert.throws(() => parseAuthConfig({ BETTER_AUTH_SECRET: valid.BETTER_AUTH_SECRET }),
    (error) => error.message.includes("MONGODB_URI") && !error.message.includes(valid.BETTER_AUTH_SECRET));
});

test("rejects insecure production origins, malformed database configuration, and short secrets", () => {
  for (const change of [
    { NODE_ENV: "production" },
    { BETTER_AUTH_URL: "http://example.com" },
    { BETTER_AUTH_URL: "https://example.com/redirect" },
    { BETTER_AUTH_URL: "https://user:password@example.com" },
    { MONGODB_URI: "https://example.com" },
    { MONGODB_DB_NAME: "invalid/name" },
    { BETTER_AUTH_SECRET: "short" },
  ]) assert.throws(() => parseAuthConfig({ ...valid, ...change }));
});

test("database validation errors never include a credential-bearing URI", () => {
  const uri = "https://sensitive:password@example.com";
  assert.throws(() => parseAuthConfig({ ...valid, MONGODB_URI: uri }),
    (error) => error.message === "Invalid MONGODB_URI" && !error.message.includes("password"));
});
