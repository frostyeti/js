// Copyright 2018-2026 the Deno authors. MIT license.
import { test } from "node:test";
import { ok, rejects, throws } from "@frostyeti/assert";
import { utime, utimeSync } from "./utime.js";
import { NotFound } from "./unstable_errors.js";
import { statSync } from "node:fs";
import { dirname, fromFileUrl, join } from "@frostyeti/path";
const __dirname = import.meta.dirname ?? dirname(fromFileUrl(import.meta.url));
const now = new Date();
const filePath = join(__dirname, "testdata/copy_file.txt");
test("utime() change atime and mtime date", async () => {
  const fileBefore = statSync(filePath);
  await utime(filePath, now, now);
  const fileAfter = statSync(filePath);
  ok(fileBefore.atime != fileAfter.atime);
  ok(fileBefore.mtime != fileAfter.mtime);
});
test("utime() fail on NotFound file", async () => {
  const randomFile = join(__dirname, "foo.txt");
  await rejects(async () => {
    await utime(randomFile, now, now);
  }, NotFound);
});
test("utimeSync() change atime and mtime data", () => {
  const fileBefore = statSync(filePath);
  utimeSync(filePath, now, now);
  const fileAfter = statSync(filePath);
  ok(fileBefore.atime != fileAfter.atime);
  ok(fileBefore.mtime != fileAfter.mtime);
});
test("utimeSync() fail on NotFound file", () => {
  const randomFile = join(__dirname, "foo.txt");
  throws(() => {
    utimeSync(randomFile, now, now);
  }, NotFound);
});
