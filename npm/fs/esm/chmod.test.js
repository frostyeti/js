// Copyright 2018-2026 the Deno authors. MIT license.
import { test } from "node:test";
import { equal, exists, rejects, throws } from "@frostyeti/assert";
import { chmod, chmodSync } from "./chmod.js";
import { NotFound } from "./unstable_errors.js";
import { platform, tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { mkdir, mkdtemp, open, rm, stat, symlink } from "node:fs/promises";
import {
  closeSync,
  mkdirSync,
  mkdtempSync,
  openSync,
  rmSync,
  statSync,
  symlinkSync,
} from "node:fs";
test("chmod() sets read only permission bits on regular files", {
  skip: platform() === "win32",
}, async () => {
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "chmod_"));
  const testFile = join(tempDirPath, "chmod_file.txt");
  const tempFh = await open(testFile, "w");
  // Check initial testFile permissions are 0o644 (-rw-r--r--).
  const fileStatBefore = await stat(testFile);
  exists(fileStatBefore.mode, "mode property is null");
  equal(fileStatBefore.mode & 0o644, 0o644);
  // Set testFile permission bits to read only, 0o444 (-r--r--r--).
  await chmod(testFile, 0o444);
  const fileStatAfter = await stat(testFile);
  exists(fileStatAfter.mode, "mode property is null");
  equal(fileStatAfter.mode & 0o444, 0o444);
  await tempFh.close();
  await rm(tempDirPath, { recursive: true, force: true });
});
test("fs::chmod() sets read only permission bits on a directory", {
  skip: platform() === "win32",
}, async () => {
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "chmod_"));
  const testDir = resolve(tempDirPath, "testDir");
  await mkdir(testDir);
  // Check initial testDir permissions are 0o755 (drwxr-xr-x).
  const dirStatBefore = await stat(testDir);
  exists(dirStatBefore.mode, "mode property is null");
  equal(dirStatBefore.mode & 0o755, 0o755);
  // Set testDir permission bits to read only to 0o444 (dr--r--r--).
  await chmod(testDir, 0o444);
  const dirStatAfter = await stat(testDir);
  exists(dirStatAfter.mode, "mode property is null");
  equal(dirStatAfter.mode & 0o444, 0o444);
  await rm(tempDirPath, { recursive: true, force: true });
});
test(
  "fs::chmod() sets write only permission bits of regular file via symlink",
  {
    skip: platform() === "win32",
  },
  async () => {
    const tempDirPath = await mkdtemp(resolve(tmpdir(), "chmod_"));
    const testFile = resolve(tempDirPath, "chmod_file.txt");
    const testSymlink = resolve(tempDirPath, "chmod_file.txt.link");
    const tempFh = await open(testFile, "w");
    await symlink(testFile, testSymlink);
    // Check initial testFile permission bits are 0o644 (-rw-r-xr-x) reading through testSymlink.
    const symlinkStatBefore = await stat(testSymlink);
    exists(symlinkStatBefore.mode, "mode property via symlink is null");
    equal(symlinkStatBefore.mode & 0o644, 0o644);
    // Set write only permission bits of testFile through testSymlink to 0o222 (--w--w--w-).
    await chmod(testSymlink, 0o222);
    const symlinkStatAfter = await stat(testSymlink);
    exists(symlinkStatAfter.mode, "mode property via symlink is null");
    const fileStatAfter = await stat(testFile);
    exists(fileStatAfter.mode, "mode property via file is null");
    // Check if both regular file mode and the mode read through symlink are both write only.
    equal(symlinkStatAfter.mode, fileStatAfter.mode);
    await tempFh.close();
    await rm(tempDirPath, { recursive: true, force: true });
  },
);
test("fs::chmod() rejects with NotFound for a non-existent file", async () => {
  await rejects(async () => {
    await chmod("non_existent_file.txt", 0o644);
  }, NotFound);
});
test("fs::chmodSync() sets read-only permission bits on regular files", {
  skip: platform() === "win32",
}, () => {
  const tempDirPath = mkdtempSync(resolve(tmpdir(), "chmodSync_"));
  const testFile = resolve(tempDirPath, "chmod_file.txt");
  const tempFd = openSync(testFile, "w");
  // Check initial testFile permissions are 0o644 (-rw-r--r--).
  const fileStatBefore = statSync(testFile);
  exists(fileStatBefore.mode, "mode property is null");
  equal(fileStatBefore.mode & 0o644, 0o644);
  // Set testFile permission bits to read only, 0o444 (-r--r--r--).
  chmodSync(testFile, 0o444);
  const fileStatAfter = statSync(testFile);
  exists(fileStatAfter.mode, "mode property is null");
  equal(fileStatAfter.mode & 0o444, 0o444);
  closeSync(tempFd);
  rmSync(tempDirPath, { recursive: true, force: true });
});
test("fs::chmodSync() sets read-only permissions bits on directories", {
  skip: platform() === "win32",
}, () => {
  const tempDirPath = mkdtempSync(resolve(tmpdir(), "chmodSync_"));
  const testDir = resolve(tempDirPath, "testDir");
  mkdirSync(testDir);
  // Check initial testDir permissions are 0o755 (drwxr-xr-x).
  const dirStatBefore = statSync(testDir);
  exists(dirStatBefore.mode, "mode property is null");
  equal(dirStatBefore.mode & 0o755, 0o755);
  // Set testDir permission bits to read only to 0o444 (dr--r--r--).
  chmodSync(testDir, 0o444);
  const dirStatAfter = statSync(testDir);
  exists(dirStatAfter.mode, "mode property is null");
  equal(dirStatAfter.mode & 0o444, 0o444);
  rmSync(tempDirPath, { recursive: true, force: true });
});
test(
  "fs::chmodSync() sets write only permission on a regular file via symlink",
  {
    skip: platform() === "win32",
  },
  () => {
    const tempDirPath = mkdtempSync(resolve(tmpdir(), "chmodSync_"));
    const testFile = resolve(tempDirPath, "chmod_file.txt");
    const testSymlink = resolve(tempDirPath, "chmod_file.txt.link");
    const tempFd = openSync(testFile, "w");
    symlinkSync(testFile, testSymlink);
    // Check initial testFile permission bits are 0o644 (-rw-r-xr-x) reading through testSymlink.
    const symlinkStatBefore = statSync(testSymlink);
    exists(symlinkStatBefore.mode, "mode property via symlink is null");
    equal(symlinkStatBefore.mode & 0o644, 0o644);
    // Set write only permission bits of testFile through testSymlink to 0o222 (--w--w--w-).
    chmodSync(testSymlink, 0o222);
    const symlinkStatAfter = statSync(testSymlink);
    exists(symlinkStatAfter.mode, "mode property via symlink is null");
    const fileStatAfter = statSync(testFile);
    exists(fileStatAfter.mode, "mode property via file is null");
    // Check if both regular file mode and the mode read through symlink are both write only.
    equal(symlinkStatAfter.mode, fileStatAfter.mode);
    closeSync(tempFd);
    rmSync(tempDirPath, { recursive: true, force: true });
  },
);
test("fs::chmodSync() throws with NotFound for a non-existent file", () => {
  throws(() => {
    chmodSync("non_existent_file.txt", 0o644);
  }, NotFound);
});
