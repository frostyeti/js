// Copyright 2018-2026 the Deno authors. MIT license.
import { test } from "node:test";
import { equal, ok, rejects, throws } from "@frostyeti/assert";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readdir, readdirSync } from "./readdir.ts";
import { NotFound } from "./unstable_errors.ts";

const moduleDir = dirname(fileURLToPath(import.meta.url));
const testdataDir = resolve(moduleDir, "testdata");

test("readdir() reads from the directory and its subdirectories", async () => {
  const files = [];
  for await (const e of readdir(testdataDir)) {
    files.push(e);
  }

  let counter = 0;
  for (const f of files) {
    if (f.name === "walk") {
      ok(f.isDirectory);
      counter++;
    }
  }

  equal(counter, 1);
});

test("readdir() rejects when the path is not a directory", async () => {
  await rejects(async () => {
    const testFile = join(testdataDir, "0.ts");
    await readdir(testFile)[Symbol.asyncIterator]().next();
  }, Error);
});

test("readdir() rejects when the directory does not exist", async () => {
  await rejects(async () => {
    await readdir("non_existent_dir")[Symbol.asyncIterator]().next();
  }, NotFound);
});

test("readdirSync() reads from the directory and its subdirectories", () => {
  const files = [];
  for (const e of readdirSync(testdataDir)) {
    files.push(e);
  }

  let counter = 0;
  for (const f of files) {
    if (f.name === "walk") {
      ok(f.isDirectory);
      counter++;
    }
  }

  equal(counter, 1);
});

test("readdirSync() throws with Error when the path is not a directory", () => {
  throws(() => {
    const testFile = join(testdataDir, "0.ts");
    readdirSync(testFile)[Symbol.iterator]().next();
  }, Error);
});

test("readdirSync() throws with NotFound when a directory does not exist", () => {
  throws(() => {
    readdirSync("non_existent_dir")[Symbol.iterator]().next();
  }, NotFound);
});