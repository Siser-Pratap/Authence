import assert from "node:assert/strict";
import test from "node:test";
import signup from "../../api/auth/Signup.js";

test("legacy signup rejects requests without reading credentials or connecting to a database", () => {
  const request = { get body() { throw new Error("Credentials must not be accessed"); } };
  let status;
  let payload;
  const response = {
    status(value) { status = value; return this; },
    json(value) { payload = value; return value; },
  };
  signup(request, response);
  assert.equal(status, 503);
  assert.deepEqual(Object.keys(payload), ["message"]);
});
