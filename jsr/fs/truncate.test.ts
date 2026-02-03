// Copyright 2018-2026 the Deno authors. MIT license.
import { test } from "node:test";
import { equal, rejects, throws } from "@frostyeti/assert";
import { truncate, truncateSync } from "./truncate.ts";
import { NotFound } from "./unstable_errors.ts";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";

test("truncate() succeeds in truncating file sizes", async () => {
  const tempDataDir = await mkdtemp(resolve(tmpdir(), "truncate_"));
  const testFile = join(tempDataDir, "truncFile.txt");
  await writeFile(testFile, "Hello, Standard Library");

  await truncate(testFile, 30);
  equal((await readFile(testFile)).length, 30);
  await truncate(testFile, 10);
  equal((await readFile(testFile)).length, 10);
  await truncate(testFile, -5);
  equal((await readFile(testFile)).length, 0);

  await rm(tempDataDir, { recursive: true, force: true });
});

test("truncate() truncates the file to zero when 'len' is not provided", async () => {
  const tempDataDir = await mkdtemp(resolve(tmpdir(), "truncate_"));
  const testFile = join(tempDataDir, "truncFile.txt");
  await writeFile(testFile, "Hello, Standard Library");

  await truncate(testFile);
  equal((await readFile(testFile)).length, 0);

  await rm(tempDataDir, { recursive: true, force: true });
});

test("truncate() rejects with Error when passing a non-regular file", async () => {
  const tempDataDir = await mkdtemp(resolve(tmpdir(), "truncate_"));

  await rejects(async () => {
    await truncate(tempDataDir);
  }, Error);

  await rm(tempDataDir, { recursive: true, force: true });
});

test("truncate() rejects with NotFound with a non-existent file", async () => {
  await rejects(async () => {
    await truncate("non-existent-file.txt");
  }, NotFound);
});

test("truncateSync() succeeds in truncating file sizes", () => {
  const tempDataDir = mkdtempSync(resolve(tmpdir(), "truncateSync_"));
  const testFile = join(tempDataDir, "truncFile.txt");
  writeFileSync(testFile, "Hello, Standard Library");

  truncateSync(testFile, 30);
  equal((readFileSync(testFile)).length, 30);
  truncateSync(testFile, 10);
  equal((readFileSync(testFile)).length, 10);
  truncateSync(testFile, -5);
  equal((readFileSync(testFile)).length, 0);

  rmSync(tempDataDir, { recursive: true, force: true });
});

test("truncateSync() truncates the file to zero when 'len' is not provided", () => {
  const tempDataDir = mkdtempSync(resolve(tmpdir(), "truncateSync_"));
  const testFile = join(tempDataDir, "truncFile.txt");
  writeFileSync(testFile, "Hello, Standard Library");

  truncateSync(testFile);
  equal((readFileSync(testFile)).length, 0);

  rmSync(tempDataDir, { recursive: true, force: true });
});

test("truncateSync() throws with Error with a non-regular file", () => {
  const tempDataDir = mkdtempSync(resolve(tmpdir(), "truncateSync_"));

  throws(() => {
    truncateSync(tempDataDir);
  }, Error);

  rmSync(tempDataDir, { recursive: true, force: true });
});

test("truncateSync() throws with NotFound with a non-existent file", () => {
  throws(() => {
    truncateSync("non-existent-file.txt");
  }, NotFound);
});