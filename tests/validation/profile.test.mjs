import assert from "node:assert/strict";
import test from "node:test";
import { normalizeEmail, normalizeUsername } from "../../src/lib/validation/profile.ts";

test("normalizes identifiers consistently", () => {
  assert.equal(normalizeEmail("  USER@Example.COM "), "user@example.com");
  assert.equal(normalizeUsername(" User_123 "), "user_123");
});

test("rejects unsupported or ambiguous usernames", () => {
  for (const name of ["ab", "a".repeat(31), "name with spaces", "user/name", "<script>"]) {
    assert.throws(() => normalizeUsername(name));
  }
});

test("rejects malformed emails", () => {
  for (const email of ["", "a@", "a@example", "a b@example.com"]) assert.throws(() => normalizeEmail(email));
});
