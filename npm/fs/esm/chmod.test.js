import { test } from "node:test";
import { equal, ok } from "@frostyeti/assert";
import { chmod, chmodSync } from "./chmod.js";
import { join } from "@frostyeti/path";
import { WIN } from "./globals.js";
import { exec } from "./_testutils.js";
import { stat } from "./stat.js";
import { ensureFile, ensureFileSync } from "./ensure_file.js";
const testFile = join(import.meta.dirname, "chmod_test.txt");
const g = globalThis;
test("fs::chmod changes permissions async", async (t) => {
  if (WIN) {
    if (g.Bun) {
      ok(
        true,
        "Skipping test: Bun on Windows does not support nested tests using node:test, including the skip",
      );
      return;
    }
    t.skip("Skipping test: chmod is not supported on Windows");
    return;
  }
  await ensureFile(testFile);
  try {
    await exec("chmod", ["644", testFile]);
    await chmod(testFile, 0o755);
    const o = await stat(testFile);
    // 0o755 in octal = 493 in decimal
    equal(o.mode & 0o777, 0o755);
  } finally {
    await exec("rm", [testFile]);
  }
});
test("fs::chmodSync changes permissions sync", async (t) => {
  if (WIN) {
    if (g.Bun) {
      ok(
        true,
        "Skipping test: Bun on Windows does not support nested tests using node:test, including the skip",
      );
      return;
    }
    t.skip("Skipping test: chmod is not supported on Windows");
    return;
  }
  ensureFileSync(testFile);
  try {
    await exec("chmod", ["644", testFile]);
    chmodSync(testFile, 0o755);
    const o = await stat(testFile);
    // 0o755 in octal = 493 in decimal
    equal(o.mode & 0o777, 0o755);
  } finally {
    await exec("rm", [testFile]);
  }
});
