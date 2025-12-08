import { test } from "node:test";
import { equal, ok } from "@frostyeti/assert";
import { makeTempFile, makeTempFileSync } from "./make_temp_file.js";
import { join } from "@frostyeti/path";
import { globals } from "./globals.js";
import { makeDir } from "./make_dir.js";
import { remove } from "./remove.js";
import { exists, existsSync } from "./exists.js";
// deno-lint-ignore no-explicit-any
const g = globals;
const testData = join(import.meta.dirname, "test-data", "make_temp_file");
test("fs::makeTempFile creates a temporary file with default options", async () => {
  const file = await makeTempFile();
  console.log(file);
  ok(await exists(file), "File should exist");
  await remove(file);
});
test("fs::makeTempFile creates a file with custom prefix and suffix", async () => {
  const file = await makeTempFile({ prefix: "test-", suffix: ".txt" });
  ok(await exists(file));
  const tmp = globals.process.env.TEMP ?? globals.process.env.TMPDIR ?? "/tmp";
  ok(file.startsWith(join(tmp, "test-")));
  ok(file.endsWith(".txt"));
  await remove(file);
});
test("fs::makeTempFile creates a file in custom directory", async () => {
  const customDir = join(testData, "custom-temp");
  await makeDir(customDir, { recursive: true });
  const file = await makeTempFile({ dir: customDir });
  ok(await exists(file), `File ${file} should exist in ${customDir}`);
  ok(file.includes(customDir));
  await remove(customDir, { recursive: true });
});
test("fs::makeTempFileSync creates a temporary file with default options", async () => {
  const file = makeTempFileSync();
  ok(existsSync(file));
  await remove(file, { recursive: true });
});
test("fs::makeTempFileSync creates a file with custom prefix and suffix", async () => {
  const file = makeTempFileSync({ prefix: "test-", suffix: ".txt" });
  ok(existsSync(file));
  const tmp = globals.process.env.TEMP ?? globals.process.env.TMPDIR ?? "/tmp";
  ok(file.startsWith(join(tmp, "test-")));
  ok(file.endsWith(".txt"));
  await remove(file, { recursive: true });
});
test("fs::makeTempFileSync creates a file in custom directory", async () => {
  const customDir = join(testData, "custom-temp-sync");
  await makeDir(customDir, { recursive: true });
  const file = makeTempFileSync({ dir: customDir });
  ok(existsSync(file));
  ok(file.includes(customDir));
  await remove(customDir, { recursive: true });
});
test("fs::makeTempFile uses Deno.makeTempFile when available", async () => {
  const originalDeno = g.Deno;
  delete g["Deno"];
  const testFile = "/tmp/test-deno-file";
  try {
    g.Deno = {
      makeTempFile: () => Promise.resolve(testFile),
    };
    const file = await makeTempFile();
    equal(file, testFile);
  } finally {
    g.Deno = originalDeno;
  }
});
test("fs::makeTempFileSync uses Deno.makeTempFileSync when available", () => {
  const originalDeno = g.Deno;
  delete g["Deno"];
  const testFile = "/tmp/test-deno-file-sync";
  try {
    g.Deno = {
      makeTempFileSync: () => testFile,
    };
    const file = makeTempFileSync();
    equal(file, testFile);
  } finally {
    g.Deno = originalDeno;
  }
});
