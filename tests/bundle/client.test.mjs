import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => {
    const path = directory + "/" + entry.name;
    return entry.isDirectory() ? files(path) : [path];
  }))).flat();
}

test("production browser bundles do not contain server configuration", async () => {
  const paths = (await files(".next/static")).filter((path) => /\.(js|map)$/.test(path));
  assert.ok(paths.length > 0, "Build the application before checking browser bundles");
  for (const path of paths) {
    const content = await readFile(path, "utf8");
    for (const value of [process.env.BETTER_AUTH_SECRET, process.env.MONGODB_URI]) {
      if (value) assert.ok(!content.includes(value), "Server configuration leaked into a browser bundle");
    }
    assert.ok(!content.includes("MONGODB_URI"), "A database configuration reference reached a browser bundle");
  }
});
