// Copyright 2018-2026 the Deno authors. MIT license.
import { test } from "node:test";
import { equal, exists, ok, rejects, throws } from "@frostyeti/assert";
import { link, linkSync } from "./link.ts";
import { AlreadyExists, NotFound } from "./unstable_errors.ts";
import { mkdtemp, open, readFile, rm, stat, writeFile } from "node:fs/promises";
import {
  closeSync,
  mkdtempSync,
  openSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { platform, tmpdir } from "node:os";
import { join, resolve } from "node:path";

test("link() creates a hard link to a file and mutate through hard link", async () => {
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "link_"));
  const testFile = join(tempDirPath, "testFile.txt");
  const linkFile = join(tempDirPath, "testFile.txt.hardlink");

  const helloWrite = "Hello";
  await writeFile(testFile, helloWrite);

  // Linux & Mac: A single file implicitly has 1 hard link count to an inode.
  if (platform() !== "win32") {
    const testFileStat = await stat(testFile);
    exists(testFileStat.nlink, "Hard link count is null");
    ok(testFileStat.nlink === 1);
  }

  // Make another hard link with `link` to the same file. (Linux & Mac - inode).
  await link(testFile, linkFile);

  // Linux & Mac: Count hard links.
  if (platform() !== "win32") {
    const testFileStat = await stat(testFile);
    exists(testFileStat.nlink, "Hard link count is null");
    ok(testFileStat.nlink === 2);
  }

  // Read test file content through the hard link.
  const helloRead = await readFile(linkFile, { encoding: "utf8" });
  equal(helloRead, helloWrite);

  // Overwrite file content through hard link and read through testFile.
  const stdWrite = "Standard Library";
  await writeFile(linkFile, stdWrite);
  const stdRead = await readFile(testFile, { encoding: "utf8" });
  equal(stdRead, stdWrite);

  // Remove testFile, count links, and check hard link properties.
  await rm(testFile);

  const linkFileStat = await stat(linkFile);
  ok(linkFileStat.isFile());
  ok(!linkFileStat.isSymbolicLink());

  // Linux & Mac: Count hard links.
  if (platform() !== "win32") {
    exists(linkFileStat.nlink, "Hard link count is null");
    ok(linkFileStat.nlink === 1);
  }

  await rm(tempDirPath, { recursive: true, force: true });
});

test("link() rejects with AlreadyExists when hard linking with an existing path", async () => {
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "link_"));
  const testFile = join(tempDirPath, "testFile.txt");
  const anotherFile = join(tempDirPath, "anotherFile.txt");

  const testFh = await open(testFile, "w");
  await testFh.close();
  const anotherFh = await open(anotherFile, "w");
  await anotherFh.close();

  await rejects(async () => {
    await link(testFile, anotherFile);
  }, AlreadyExists);

  await rm(tempDirPath, { recursive: true, force: true });
});

test("link() rejects with NotFound with a non-existent file", async () => {
  await rejects(async () => {
    await link("non-existent-file.txt", "non-existent-hard-link");
  }, NotFound);
});

test("linkSync() creates a hard link to a file and mutate through hard link", () => {
  const tempDirPath = mkdtempSync(resolve(tmpdir(), "linkSync_"));
  const testFile = join(tempDirPath, "testFile.txt");
  const linkFile = join(tempDirPath, "testFile.txt.hardlink");

  const helloWrite = "Hello";
  writeFileSync(testFile, helloWrite);

  // Linux & Mac: A single file implicitly has 1 hard link to an inode.
  if (platform() !== "win32") {
    const testFileStat = statSync(testFile);
    exists(testFileStat.nlink, "Hard link count is null");
    ok(testFileStat.nlink === 1);
  }

  // Make another hard link with `link` to the same inode.
  linkSync(testFile, linkFile);

  // Linux & Mac: Count hard links.
  if (platform() !== "win32") {
    const testFileStat = statSync(testFile);
    exists(testFileStat.nlink, "Hard link count is null");
    ok(testFileStat.nlink === 2);
  }

  // Read test file content through the hard link.
  const helloRead = readFileSync(linkFile, { encoding: "utf8" });
  equal(helloRead, helloWrite);

  // Overwrite file content through hard link and read through testFile.
  const stdWrite = "Standard Library";
  writeFileSync(linkFile, stdWrite);
  const stdRead = readFileSync(testFile, { encoding: "utf8" });
  equal(stdRead, stdWrite);

  // Remove testFile, count links, and check hard link properties.
  rmSync(testFile);

  const linkFileStat = statSync(linkFile);
  ok(linkFileStat.isFile());
  ok(!linkFileStat.isSymbolicLink());

  // Linux & Mac: Count hard links.
  if (platform() !== "win32") {
    exists(linkFileStat.nlink, "Hard link count is null");
    ok(linkFileStat.nlink === 1);
  }

  rmSync(tempDirPath, { recursive: true, force: true });
});

test("linkSync() throws with AlreadyExists when hard linking with an existing path", () => {
  const tempDirPath = mkdtempSync(resolve(tmpdir(), "link_"));
  const testFile = join(tempDirPath, "testFile.txt");
  const anotherFile = join(tempDirPath, "anotherFile.txt");

  const testFd = openSync(testFile, "w");
  closeSync(testFd);
  const anotherFd = openSync(anotherFile, "w");
  closeSync(anotherFd);

  throws(() => {
    linkSync(testFile, anotherFile);
  }, AlreadyExists);

  rmSync(tempDirPath, { recursive: true, force: true });
});

test("linkSync() throws with NotFound with a non-existent file", () => {
  throws(() => {
    linkSync("non-existent-file.txt", "non-existent-hard-link");
  }, NotFound);
});