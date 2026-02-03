// Copyright 2018-2026 the Deno authors. MIT license.
import { test } from "node:test";
import { ok, rejects, throws } from "@frostyeti/assert";
import { stat, statSync } from "./stat.js";
import { NotFound } from "./unstable_errors.js";
import { dirname, fromFileUrl, join } from "@frostyeti/path";
import { globals } from "./globals.js";
const __dirname = import.meta.dirname ?? dirname(fromFileUrl(import.meta.url));
const isDeno = globals.Deno !== undefined;
test("stat() and statSync() return FileInfo for a file", async () => {
  const file = isDeno ? join(__dirname, "README.md") : join(__dirname, "..", "README.md");
  {
    const fileInfo = await stat(file);
    ok(fileInfo.isFile);
  }
  {
    const fileInfo = statSync(file);
    ok(fileInfo.isFile);
  }
});
test("stat() and statSync() return FileInfo for a directory", async () => {
  {
    const fileInfo = await stat(__dirname);
    ok(fileInfo.isDirectory);
  }
  {
    const fileInfo = statSync(__dirname);
    ok(fileInfo.isDirectory);
  }
});
test("stat() and statSync() throw with NotFound for a non-existent file", async () => {
  await rejects(async () => {
    await stat(join(__dirname, "../non_existent_file"));
  }, NotFound);
  throws(() => {
    statSync(join(__dirname, "../non_existent_file"));
  }, NotFound);
});
