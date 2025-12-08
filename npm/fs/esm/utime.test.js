import { test } from "node:test";
import { equal } from "@frostyeti/assert";
import { utime, utimeSync } from "./utime.js";
import { globals } from "./globals.js";
import { join } from "@frostyeti/path";
import { exec } from "./_testutils.js";
import { stat } from "./stat.js";
// deno-lint-ignore no-explicit-any
const g = globals;
const testData = join(import.meta.dirname, "test-data", "utime");
test("fs::utime changes access and modification times", async () => {
  await exec("mkdir", ["-p", testData]);
  const testFile = join(testData, "utime-test.txt");
  const newAtime = new Date(2023, 0, 1);
  const newMtime = new Date(2023, 0, 2);
  try {
    await exec("touch", [testFile]);
    await utime(testFile, newAtime, newMtime);
    const o = await stat(testFile);
    const { atime, mtime } = o;
    equal(atime.getFullYear(), 2023);
    equal(mtime.getFullYear(), 2023);
  } finally {
    await exec("rm", ["-f", testFile]);
  }
});
test("fs::utimeSync changes access and modification times synchronously", () => {
  const { Deno: od } = globals;
  delete g["Deno"];
  try {
    let called = false;
    g.Deno = {
      utimeSync: (_path, _atime, _mtime) => {
        called = true;
      },
    };
    utimeSync("test.txt", new Date(), new Date());
    equal(called, true);
  } finally {
    globals.Deno = od;
  }
});
