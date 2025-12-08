import { test } from "node:test";
import { equal, ok } from "@frostyeti/assert";
import { makeTempDir, makeTempDirSync } from "./make_temp_dir.js";
import { globals, WIN } from "./globals.js";
import { makeDir } from "./make_dir.js";
import { remove } from "./remove.js";
import { exists, existsSync } from "./exists.js";
// deno-lint-ignore no-explicit-any
const g = globals;
test("fs::makeTempDir creates temporary directory with default options", async () => {
  const tempDir = await makeTempDir();
  ok(await exists(tempDir));
  await remove(tempDir, { recursive: true });
});
test("fs::makeTempDir creates directory with prefix", async () => {
  const tempDir = await makeTempDir({ prefix: "test-" });
  ok(await exists(tempDir));
  ok(tempDir.includes("test-"), `Expected prefix 'test-' in ${tempDir}`);
  await remove(tempDir, { recursive: true });
});
test("fs::makeTempDir creates directory with suffix", async () => {
  const tempDir = await makeTempDir({ suffix: "-tmp" });
  ok(await exists(tempDir));
  ok(tempDir.endsWith("-tmp"), `Expected suffix '.tmp' in ${tempDir}`);
  await remove(tempDir, { recursive: true });
});
test("fs::makeTempDir creates directory in specified dir", async () => {
  const baseDir = !WIN ? "/tmp/test-base" : (globals.process.env.TEMP + "\\test-base");
  await makeDir(baseDir, { recursive: true });
  const tempDir = await makeTempDir({ dir: baseDir });
  ok(tempDir.startsWith(baseDir));
  ok(await exists(tempDir));
  await remove(baseDir, { recursive: true });
});
test("fs::makeTempDir uses Deno.makeTempDir when available", async () => {
  const { Deno: od } = globals;
  delete g["Deno"];
  try {
    g.Deno = {
      makeTempDir: () => Promise.resolve("/fake/temp/dir"),
    };
    const dir = await makeTempDir();
    equal(dir, "/fake/temp/dir");
  } finally {
    globals.Deno = od;
  }
});
test("fs::makeTempDirSync creates temporary directory with default options", async () => {
  const tempDir = makeTempDirSync();
  ok(existsSync(tempDir));
  await remove(tempDir, { recursive: true });
});
test("fs::makeTempDirSync creates directory with prefix", async () => {
  const tempDir = makeTempDirSync({ prefix: "test-" });
  ok(existsSync(tempDir));
  ok(tempDir.includes("test-"));
  await remove(tempDir, { recursive: true });
});
test("fs::makeTempDirSync creates directory with suffix", async () => {
  const tempDir = makeTempDirSync({ suffix: "-tmp" });
  ok(existsSync(tempDir));
  ok(tempDir.endsWith("-tmp"));
  await remove(tempDir, { recursive: true });
});
test("fs::makeTempDirSync creates directory in specified dir", async () => {
  const baseDir = !WIN ? "/tmp/test-base" : (globals.process.env.TEMP + "\\test-base");
  await makeDir(baseDir, { recursive: true });
  const tempDir = makeTempDirSync({ dir: baseDir });
  ok(tempDir.startsWith(baseDir));
  ok(existsSync(tempDir));
  await remove(baseDir, { recursive: true });
});
test("fs::makeTempDirSync uses Deno.makeTempDirSync when available", () => {
  const { Deno: od } = globals;
  delete g["Deno"];
  try {
    g.Deno = {
      makeTempDirSync: () => "/fake/temp/dir",
    };
    const dir = makeTempDirSync();
    equal(dir, "/fake/temp/dir");
  } finally {
    globals.Deno = od;
  }
});
