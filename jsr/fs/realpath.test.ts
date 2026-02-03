// Copyright 2018-2026 the Deno authors. MIT license.
import { test } from "node:test";
import { match, ok, rejects, throws } from "@frostyeti/assert";
import { realpath, realpathSync } from "./realpath.ts";
import { NotFound } from "./unstable_errors.ts";
import { platform } from "node:os";
import { fromFileUrl, dirname, join} from "@frostyeti/path";
import { cwd } from "node:process";
import { relative } from "node:path";


const __dirname = import.meta.dirname ?? dirname(fromFileUrl(import.meta.url));
const pwd = cwd();
const testdataDir = join(__dirname, "testdata");
const relTestDataDir = relative(pwd, testdataDir);


test("realpath() returns the absolute path from a relative file path", async () => {
  const testFileRelative = `${relTestDataDir}/0.ts`;
  const testFileReal = await realpath(testFileRelative);
  if (platform() === "win32") {
    match(testFileReal, /^[A-Z]:\\/);
    ok(testFileReal.endsWith(testFileRelative.replace(/\//g, "\\")));
  } else {
    ok(testFileReal.startsWith("/"));
    ok(testFileReal.endsWith(testFileRelative));
  }
});

test("realpath() returns the absolute path of the linked file via symlink", async () => {
  // `fs/testdata/0-link` is symlinked to file `fs/testdata/0.ts`.
  const testFileSymlink = `${relTestDataDir}/0-link`;
  const testFileReal = await realpath(testFileSymlink);
  if (platform() === "win32") {
    match(testFileReal, /^[A-Z]:\\/);
    ok(testFileReal.endsWith("testdata/0.ts".replace(/\//g, "\\")));
  } else {
    ok(testFileReal.startsWith("/"));
    ok(testFileReal.endsWith("testdata/0.ts"));
  }
});

test("realpath() rejects with NotFound for a non-existent file", async () => {
  await rejects(async () => {
    await realpath("non-existent-file.txt");
  }, NotFound);
});

test("realpathSync() returns the absolute path of a relative file", () => {
  const testFileRelative = `${relTestDataDir}/0.ts`;
  const testFileReal = realpathSync(testFileRelative);
  if (platform() === "win32") {
    match(testFileReal, /^[A-Z]:\\/);
    ok(testFileReal.endsWith(testFileRelative.replace(/\//g, "\\")));
  } else {
    ok(testFileReal.startsWith("/"));
    ok(testFileReal.endsWith(testFileRelative));
  }
});

test("realpathSync() returns the absolute path of the linked file via symlink", () => {
  // `fs/testdata/0-link` is symlinked to file `fs/testdata/0.ts`.
  const testFileSymlink = `${relTestDataDir}/0-link`;
  const testFileReal = realpathSync(testFileSymlink);
  if (platform() === "win32") {
    match(testFileReal, /^[A-Z]:\\/);
    ok(testFileReal.endsWith("/testdata/0.ts".replace(/\//g, "\\")));
  } else {
    ok(testFileReal.startsWith("/"));
    ok(testFileReal.endsWith("/testdata/0.ts"));
  }
});

test("realpathSync() throws with NotFound for a non-existent file", () => {
  throws(() => {
    realpathSync("non-existent-file.txt");
  }, NotFound);
});