// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// TODO(axetroy): Add test for Windows once symlink is implemented for Windows.
import { test } from "node:test";
import { equal, rejects, throws } from "@frostyeti/assert";
import * as path from "@frostyeti/path";
import { ensureSymlink, ensureSymlinkSync } from "./ensure_symlink.js";
import { lstat, lstatSync } from "./lstat.js";
import { mkdir, mkdirSync } from "./mkdir.js";
import { readlink, readlinkSync } from "./readlink.js";
import { readTextFile, readTextFileSync } from "./read_text_file.js";
import { stat, statSync } from "./stat.js";
import { symlink, symlinkSync } from "./symlink.js";
import { rm, rmSync } from "./rm.js";
import { writeFile, writeFileSync } from "./write_file.js";
import { writeTextFile, writeTextFileSync } from "./write_text_file.js";
import { exists, existsSync } from "./exists.js";
const moduleDir = path.dirname(path.fromFileUrl(import.meta.url));
const testdataDir = path.resolve(moduleDir, "testdata");
test("ensureSymlink() rejects if file does not exist", async function () {
  const testDir = path.join(testdataDir, "link_file_1");
  const testFile = path.join(testDir, "test.txt");
  await rejects(async () => {
    await ensureSymlink(testFile, path.join(testDir, "test1.txt"));
  });
  await rejects(async () => {
    await stat(testFile).then(() => {
      throw new Error("test file should exist.");
    });
  });
});
test("ensureSymlinkSync() throws if file does not exist", function () {
  const testDir = path.join(testdataDir, "link_file_2");
  const testFile = path.join(testDir, "test.txt");
  throws(() => {
    ensureSymlinkSync(testFile, path.join(testDir, "test1.txt"));
  });
  throws(() => {
    statSync(testFile);
    throw new Error("test file should exist.");
  });
});
test("ensureSymlink() ensures linkName links to target", async function () {
  const testDir = path.join(testdataDir, "link_file_3");
  const testFile = path.join(testDir, "test.txt");
  const linkFile = path.join(testDir, "link.txt");
  try {
    if (await exists(testDir)) {
      await rm(testDir, { recursive: true });
    }
  } catch {
    // ignore
  }
  try {
    await mkdir(testDir, { recursive: true });
    await writeFile(testFile, new Uint8Array());
    await ensureSymlink(testFile, linkFile);
    await ensureSymlink(testFile, linkFile);
    const srcStat = await lstat(testFile);
    const linkStat = await lstat(linkFile);
    equal(srcStat.isFile, true);
    equal(linkStat.isSymlink, true);
  } finally {
    await rm(testDir, { recursive: true });
  }
});
test("ensureSymlinkSync() ensures linkName links to target", function () {
  const testDir = path.join(testdataDir, "link_file_4");
  const testFile = path.join(testDir, "test.txt");
  const linkFile = path.join(testDir, "link.txt");
  try {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true });
    }
  } catch {
    // ignore
  }
  try {
    mkdirSync(testDir, { recursive: true });
    writeFileSync(testFile, new Uint8Array());
    ensureSymlinkSync(testFile, linkFile);
    ensureSymlinkSync(testFile, linkFile);
    const srcStat = lstatSync(testFile);
    const linkStat = lstatSync(linkFile);
    equal(srcStat.isFile, true);
    equal(linkStat.isSymlink, true);
  } finally {
    rmSync(testDir, { recursive: true });
  }
});
test("ensureSymlink() rejects if the linkName path already exist", async function () {
  const testDir = path.join(testdataDir, "link_file_5");
  const linkFile = path.join(testDir, "test.txt");
  const linkDir = path.join(testDir, "test_dir");
  const linkSymlink = path.join(testDir, "test_symlink");
  const targetFile = path.join(testDir, "target.txt");
  await mkdir(testDir, { recursive: true });
  await writeTextFile(linkFile, "linkFile");
  await mkdir(linkDir);
  await symlink("non-existent", linkSymlink, { type: "file" });
  await writeTextFile(targetFile, "targetFile");
  await rejects(async () => {
    await ensureSymlink(targetFile, linkFile);
  });
  await rejects(async () => {
    await ensureSymlink(targetFile, linkDir);
  });
  await rejects(async () => {
    await ensureSymlink(targetFile, linkSymlink);
  });
  equal(await readTextFile(linkFile), "linkFile");
  equal((await stat(linkDir)).isDirectory, true);
  equal(await readlink(linkSymlink), "non-existent");
  equal(await readTextFile(targetFile), "targetFile");
  await rm(testDir, { recursive: true });
});
test("ensureSymlinkSync() throws if the linkName path already exist", function () {
  const testDir = path.join(testdataDir, "link_file_6");
  const linkFile = path.join(testDir, "test.txt");
  const linkDir = path.join(testDir, "test_dir");
  const linkSymlink = path.join(testDir, "test_symlink");
  const targetFile = path.join(testDir, "target.txt");
  mkdirSync(testDir, { recursive: true });
  writeTextFileSync(linkFile, "linkFile");
  mkdirSync(linkDir);
  symlinkSync("non-existent", linkSymlink, { type: "file" });
  writeTextFileSync(targetFile, "targetFile");
  throws(() => {
    ensureSymlinkSync(targetFile, linkFile);
  });
  throws(() => {
    ensureSymlinkSync(targetFile, linkDir);
  });
  throws(() => {
    ensureSymlinkSync(targetFile, linkSymlink);
  });
  equal(readTextFileSync(linkFile), "linkFile");
  equal(statSync(linkDir).isDirectory, true);
  equal(readlinkSync(linkSymlink), "non-existent");
  equal(readTextFileSync(targetFile), "targetFile");
  rmSync(testDir, { recursive: true });
});
test("ensureSymlink() ensures dir linkName links to dir target", async function () {
  const testDir = path.join(testdataDir, "link_file_origin_3");
  const linkDir = path.join(testdataDir, "link_file_link_3");
  const testFile = path.join(testDir, "test.txt");
  try {
    await mkdir(testDir, { recursive: true });
    await writeFile(testFile, new Uint8Array());
    await ensureSymlink(testDir, linkDir);
    await ensureSymlink(testDir, linkDir);
    const testDirStat = await lstat(testDir);
    const linkDirStat = await lstat(linkDir);
    const testFileStat = await lstat(testFile);
    equal(testFileStat.isFile, true);
    equal(testDirStat.isDirectory, true);
    equal(linkDirStat.isSymlink, true);
  } finally {
    await rm(linkDir, { recursive: true });
    await rm(testDir, { recursive: true });
  }
});
test("ensureSymlinkSync() ensures dir linkName links to dir target", function () {
  const testDir = path.join(testdataDir, "link_file_origin_3");
  const linkDir = path.join(testdataDir, "link_file_link_3");
  const testFile = path.join(testDir, "test.txt");
  mkdirSync(testDir, { recursive: true });
  writeFileSync(testFile, new Uint8Array());
  ensureSymlinkSync(testDir, linkDir);
  ensureSymlinkSync(testDir, linkDir);
  const testDirStat = lstatSync(testDir);
  const linkDirStat = lstatSync(linkDir);
  const testFileStat = lstatSync(testFile);
  equal(testFileStat.isFile, true);
  equal(testDirStat.isDirectory, true);
  equal(linkDirStat.isSymlink, true);
  rmSync(linkDir, { recursive: true });
  rmSync(testDir, { recursive: true });
});
test("ensureSymlink() creates symlink with relative target", async function () {
  const testDir = path.join(testdataDir, "symlink-relative");
  const testLinkName = path.join(testDir, "link.txt");
  const testFile = path.join(testDir, "target.txt");
  await mkdir(testDir);
  await writeFile(testFile, new Uint8Array());
  await ensureSymlink("target.txt", testLinkName);
  const testDirStat = await lstat(testDir);
  const linkDirStat = await lstat(testLinkName);
  const testFileStat = await lstat(testFile);
  equal(testFileStat.isFile, true);
  equal(testDirStat.isDirectory, true);
  equal(linkDirStat.isSymlink, true);
  await rm(testDir, { recursive: true });
});
test("ensureSymlinkSync() creates symlink with relative target", function () {
  const testDir = path.join(testdataDir, "symlink-relative-sync");
  const testLinkName = path.join(testDir, "link.txt");
  const testFile = path.join(testDir, "target.txt");
  mkdirSync(testDir);
  writeFileSync(testFile, new Uint8Array());
  ensureSymlinkSync("target.txt", testLinkName);
  const testDirStat = lstatSync(testDir);
  const linkDirStat = lstatSync(testLinkName);
  const testFileStat = lstatSync(testFile);
  equal(testFileStat.isFile, true);
  equal(testDirStat.isDirectory, true);
  equal(linkDirStat.isSymlink, true);
  rmSync(testDir, { recursive: true });
});
