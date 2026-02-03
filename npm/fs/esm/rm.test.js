// Copyright 2018-2026 the Deno authors. MIT license.
import { test } from "node:test";
import { ok, rejects, throws } from "@frostyeti/assert";
import { rmSync, writeFileSync } from "node:fs";
import { rm as nodeRm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { mkdtemp } from "node:fs/promises";
import { mkdtempSync } from "node:fs";
import { NotFound } from "./unstable_errors.js";
import { rm, rmSync as fsRmSync } from "./rm.js";
import { statSync } from "./stat.js";
import { exists, existsSync } from "./exists.js";
import { isdir } from "./isdir.js";
test("rm() removes an existing and empty directory", async () => {
  const tempDir = await mkdtemp(resolve(tmpdir(), "rm_async_"));
  const existedCheck = await isdir(tempDir);
  ok(existedCheck);
  try {
    await rm(tempDir);
    const existed = await exists(tempDir);
    ok(existed === false);
  } finally {
    if (await exists(tempDir)) {
      await nodeRm(tempDir, { recursive: true, force: true });
    }
  }
});
test("rm() removes a non empty directory", async () => {
  const tempDir1 = await mkdtemp(resolve(tmpdir(), "rm_async_"));
  const tempDir2 = await mkdtemp(resolve(tempDir1, "rm_async_"));
  const testFile1 = join(tempDir1, "test.txt");
  const testFile2 = join(tempDir2, "test.txt");
  const encoder = new TextEncoder();
  const data = encoder.encode("This is a test content");
  await writeFile(testFile1, data, { mode: 0o777 });
  await writeFile(testFile2, data, { mode: 0o777 });
  try {
    await rejects(async () => {
      await rm(tempDir1);
    }, Error);
    await rm(tempDir1, { recursive: true });
    const existed = await exists(tempDir1);
    ok(existed === false);
  } finally {
    if (await exists(tempDir1)) {
      await nodeRm(tempDir1, { recursive: true, force: true });
    }
  }
});
test("rm() removes a non existed directory", async () => {
  const tempDir = await mkdtemp(resolve(tmpdir(), "rm_async_"));
  const nonExistedDir = join(tempDir, "non", "existed", "dir");
  try {
    await rejects(async () => {
      await rm(nonExistedDir);
    }, NotFound);
    await rm(tempDir);
    const existed = await exists(tempDir);
    ok(existed === false);
  } finally {
    if (await exists(tempDir)) {
      await nodeRm(tempDir, { recursive: true, force: true });
    }
  }
});
test("rm() removes a non existed directory with option", async () => {
  const tempDir = await mkdtemp(resolve(tmpdir(), "rm_async_"));
  const nonExistedDir = join(tempDir, "non", "existed", "dir");
  try {
    await rejects(async () => {
      await rm(nonExistedDir, { recursive: true });
    }, NotFound);
    await rm(tempDir);
    const existed = await exists(tempDir);
    ok(existed === false);
  } finally {
    if (await exists(tempDir)) {
      await nodeRm(tempDir, { recursive: true, force: true });
    }
  }
});
test("rmSync() removes an existed and empty directory", () => {
  const tempDir = mkdtempSync(resolve(tmpdir(), "rm_sync_"));
  ok(statSync(tempDir).isDirectory === true);
  try {
    fsRmSync(tempDir);
    ok(existsSync(tempDir) === false);
  } finally {
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
  }
});
test("rmSync() removes a non empty directory", () => {
  const tempDir1 = mkdtempSync(resolve(tmpdir(), "rm_sync_"));
  const tempDir2 = mkdtempSync(resolve(tempDir1, "rm_async_"));
  const testFile1 = join(tempDir1, "test.txt");
  const testFile2 = join(tempDir2, "test.txt");
  const encoder = new TextEncoder();
  const data = encoder.encode("This is a test content");
  writeFileSync(testFile1, data, { mode: 0o777 });
  writeFileSync(testFile2, data, { mode: 0o777 });
  try {
    throws(() => {
      fsRmSync(tempDir1);
    }, Error);
    fsRmSync(tempDir1, { recursive: true });
    ok(existsSync(tempDir1) === false);
  } finally {
    if (existsSync(tempDir1)) {
      rmSync(tempDir1, { recursive: true, force: true });
    }
  }
});
test("rmSync() removes a non existed directory", () => {
  const tempDir = mkdtempSync(resolve(tmpdir(), "rm_sync_"));
  const nonExistedDir = join(tempDir, "non", "existed", "dir");
  try {
    throws(() => {
      fsRmSync(nonExistedDir);
    }, NotFound);
    fsRmSync(tempDir, { recursive: true });
    ok(existsSync(tempDir) === false);
  } finally {
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
  }
});
test("rmSync() removes a non existed directory with option", () => {
  const tempDir = mkdtempSync(resolve(tmpdir(), "rm_sync_"));
  const nonExistedDir = join(tempDir, "non", "existed", "dir");
  try {
    throws(() => {
      fsRmSync(nonExistedDir, { recursive: true });
    }, NotFound);
    fsRmSync(tempDir, { recursive: true });
    ok(existsSync(tempDir) === false);
  } finally {
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
  }
});
