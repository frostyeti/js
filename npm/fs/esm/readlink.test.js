// Copyright 2018-2026 the Deno authors. MIT license.
import { test } from "node:test";
import { equal, rejects, throws } from "@frostyeti/assert";
import { readlink, readlinkSync } from "./readlink.js";
import { NotFound } from "./unstable_errors.js";
import { linkSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { link, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
test("readlink() can read through symlink", async () => {
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "readlink_"));
  const testFile = join(tempDirPath, "testFile.txt");
  const symlinkFile = join(tempDirPath, "testFile.txt.link");
  await writeFile(testFile, "Hello, Standard Library");
  await symlink(testFile, symlinkFile);
  const realFile = await readlink(symlinkFile);
  equal(testFile, realFile);
  await rm(tempDirPath, { recursive: true, force: true });
});
test("readlink() rejects with Error when reading from a hard link", async () => {
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "readlink_"));
  const testFile = join(tempDirPath, "testFile.txt");
  const linkFile = join(tempDirPath, "testFile.txt.hlink");
  await writeFile(testFile, "Hello, Standard Library");
  await link(testFile, linkFile);
  await rejects(async () => {
    await readlink(linkFile);
  }, Error);
  await rm(tempDirPath, { recursive: true, force: true });
});
test("readlink() rejects with NotFound when reading through a non-existent file", async () => {
  await rejects(async () => {
    await readlink("non-existent-file.txt.link");
  }, NotFound);
});
test("readlinkSync() can read through symlink", () => {
  const tempDirPath = mkdtempSync(resolve(tmpdir(), "readlink_"));
  const testFile = join(tempDirPath, "testFile.txt");
  const symlinkFile = join(tempDirPath, "testFile.txt.link");
  writeFileSync(testFile, "Hello, Standard Library");
  symlinkSync(testFile, symlinkFile);
  const realFile = readlinkSync(symlinkFile);
  equal(testFile, realFile);
  rmSync(tempDirPath, { recursive: true, force: true });
});
test("readlinkSync() throws Error when reading from a hard link", () => {
  const tempDirPath = mkdtempSync(resolve(tmpdir(), "readlinkSync_"));
  const testFile = join(tempDirPath, "testFile.txt");
  const linkFile = join(tempDirPath, "testFile.txt.hlink");
  writeFileSync(testFile, "Hello, Standard Library!");
  linkSync(testFile, linkFile);
  throws(() => {
    readlinkSync(linkFile);
  }, Error);
  rmSync(tempDirPath, { recursive: true, force: true });
});
test("readlinkSync() throws NotFound when reading through a non-existent file", () => {
  throws(() => {
    readlinkSync("non-existent-file.txt.hlink");
  }, NotFound);
});
