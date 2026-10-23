import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import { MongoClient } from "mongodb";

const base = process.env.AUTHENCE_TEST_URL || "http://127.0.0.1:3000";
const databaseName = process.env.MONGODB_DB_NAME;
if (!databaseName?.startsWith("authence_test")) throw new Error("Integration tests require an authence_test database");
const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(databaseName);
const password = randomUUID() + "!Strong";
const name = "test_" + randomUUID().replaceAll("-", "").slice(0,16);
const email = name + "@example.test";
const origin = new URL(base).origin;

async function request(path, body, cookie) {
  return fetch(base + path, {
    method: body === undefined ? "GET" : "POST",
    headers: { Origin: origin, ...(body === undefined ? {} : { "Content-Type": "application/json" }), ...(cookie ? { Cookie: cookie } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    redirect: "manual",
  });
}

test("authentication lifecycle against the real server and disposable database", async (t) => {
  await client.connect();
  let cookie;
  try {
    await db.collection("rateLimit").deleteMany({});
    await t.test("protects account data without a session", async () => {
      assert.equal((await request("/api/me")).status, 401);
      assert.equal((await request("/api/me", undefined, "better-auth.session_token=forged")).status, 401);
    });
    await t.test("registration normalizes identifiers and hashes passwords", async () => {
      const response = await request("/api/auth/sign-up/email", { name, email, password });
      assert.equal(response.status, 200);
      const text = await response.text();
      assert.ok(!text.includes(password));
      const user = await db.collection("user").findOne({ email });
      assert.equal(user.name, name);
      assert.equal(user.password, undefined);
      const account = await db.collection("account").findOne({ userId: user._id });
      assert.ok(account?.password && account.password !== password);
    });
    await t.test("rejects wrong credentials and creates a cookie-backed session for correct credentials", async () => {
      assert.ok((await request("/api/auth/sign-in/email", { email, password: password + "wrong" })).status >= 400);
      const response = await request("/api/auth/sign-in/email", { email, password });
      assert.equal(response.status, 200);
      const cookies = response.headers.getSetCookie();
      assert.ok(cookies.some((value) => value.includes("HttpOnly")));
      cookie = cookies.map((value) => value.split(";")[0]).join("; ");
      assert.ok(cookie);
      const me = await request("/api/me", undefined, cookie);
      assert.equal(me.status, 200);
      const payload = await me.json();
      assert.equal(payload.user.email, email);
      assert.deepEqual(Object.keys(payload), ["user"]);
      assert.deepEqual(Object.keys(payload.user).sort(), ["email", "id", "username"]);
      assert.match(me.headers.get("cache-control"), /no-store/);
    });
    await t.test("rejects untrusted origins", async () => {
      const response = await fetch(base + "/api/auth/sign-out", {
        method: "POST", headers: { Origin: "https://untrusted.example", Cookie: cookie, "Content-Type": "application/json" }, body: "{}",
      });
      assert.equal(response.status, 403);
    });
    await t.test("sign-out invalidates a previously issued cookie", async () => {
      assert.equal((await request("/api/auth/sign-out", {}, cookie)).status, 200);
      assert.equal((await request("/api/me", undefined, cookie)).status, 401);
    });
    await t.test("expired sessions cannot access account data", async () => {
      const response = await request("/api/auth/sign-in/email", { email, password });
      const expiredCookie = response.headers.getSetCookie().map((value) => value.split(";")[0]).join("; ");
      const user = await db.collection("user").findOne({ email });
      await db.collection("session").updateMany({ userId: user._id }, { $set: { expiresAt: new Date(0) } });
      assert.equal((await request("/api/me", undefined, expiredCookie)).status, 401);
    });
    await t.test("rate limiting persists in shared MongoDB storage", async () => {
      await db.collection("rateLimit").deleteMany({});
      const statuses = [];
      for (let i = 0; i < 6; i++) {
        statuses.push((await request("/api/auth/sign-in/email", { email, password: password + "wrong" })).status);
      }
      assert.ok(statuses.includes(429), JSON.stringify(statuses));
      assert.ok(await db.collection("rateLimit").countDocuments() > 0);
    });
  } finally {
    await db.collection("rateLimit").deleteMany({});
    await client.close();
  }
});
