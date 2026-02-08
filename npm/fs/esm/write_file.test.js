// Copyright 2018-2026 the Deno authors. MIT license.
import { test } from "node:test";
import { equal, exists, ok, rejects, throws, unreachable } from "@frostyeti/assert";
import { isDeno } from "./_utils.js";
import { writeFile, writeFileSync } from "./write_file.js";
import { readFile, readFileSync } from "./read_file.js";
import { stat, statSync } from "./stat.js";
import { AlreadyExists, NotFound } from "./unstable_errors.js";
import { mkdtempSync, rmSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { platform, tmpdir } from "node:os";
import { join, resolve } from "node:path";
import process from "node:process";
import { globals } from "./globals.js";
const mask = process.umask();
const defaultFileMode = 0o666 & ~mask;
function assertMissing(path) {
  if (pathExists(path)) {
    throw new Error("File: ${path} exists");
  }
}
function pathExists(path) {
  try {
    statSync(path);
    return true;
  } catch {
    return false;
  }
}
test("writeFile() writes to a file", async () => {
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "writeFile_"));
  const testFile = join(tempDirPath, "testFile.txt");
  const encoder = new TextEncoder();
  const data = encoder.encode("Hello");
  await writeFile(testFile, data);
  const dataRead = await readFile(testFile);
  const decoder = new TextDecoder("utf-8");
  const actualData = decoder.decode(dataRead);
  equal(actualData, "Hello");
  await rm(tempDirPath, { recursive: true, force: true });
});
test("writeFile() handles 'append' to a file", async () => {
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "writeFile_"));
  const testFile = join(tempDirPath, "testFile.txt");
  const encoder = new TextEncoder();
  const data = encoder.encode("Hello");
  await writeFile(testFile, data);
  const dataRead = await readFile(testFile);
  const decoder = new TextDecoder("utf-8");
  const initialData = decoder.decode(dataRead);
  equal(initialData, "Hello");
  const appendData = encoder.encode(", Standard Library");
  await writeFile(testFile, appendData, { append: true });
  const appendRead = await readFile(testFile);
  const afterAppendData = decoder.decode(appendRead);
  equal(afterAppendData, "Hello, Standard Library");
  await rm(tempDirPath, { recursive: true, force: true });
});
test("writeFile() handles 'create' when writing to a file", async () => {
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "writeFile_"));
  const testFile = join(tempDirPath, "testFile.txt");
  const encoder = new TextEncoder();
  const data = encoder.encode("Hello");
  // Rejects with NotFound when file does not initally exist.
  await rejects(async () => {
    await writeFile(testFile, data, { create: false });
  });
  // Creates a file that does not initially exist. (This is default behavior).
  await writeFile(testFile, data, { create: true });
  const dataRead = await readFile(testFile);
  const decoder = new TextDecoder("utf-8");
  const initialData = decoder.decode(dataRead);
  equal(initialData, "Hello");
  // Overwrites the existing file with new content.
  const dataAgain = encoder.encode("Hello, Standard Library");
  await writeFile(testFile, dataAgain, { create: false });
  const dataReadAgain = await readFile(testFile);
  const readDataAgain = decoder.decode(dataReadAgain);
  equal(readDataAgain, "Hello, Standard Library");
  await rm(tempDirPath, { recursive: true, force: true });
});
test("writeFile() handles 'createNew' when writing to a file", async () => {
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "writeFile_"));
  const testFile = join(tempDirPath, "testFile.txt");
  const encoder = new TextEncoder();
  const data = encoder.encode("Hello");
  await writeFile(testFile, data, { createNew: true });
  await rejects(async () => {
    await writeFile(testFile, data, { createNew: true });
  }, AlreadyExists);
  await rm(tempDirPath, { recursive: true, force: true });
});
test("writeFile() can change the mode of a file", {
  skip: platform() === "win32",
}, async () => {
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "writeFile_"));
  const testFile = join(tempDirPath, "testFile.txt");
  const encoder = new TextEncoder();
  const data = encoder.encode("Hello");
  await writeFile(testFile, data);
  const testFileStatBefore = await stat(testFile);
  exists(testFileStatBefore.mode, "mode is null");
  equal(testFileStatBefore.mode & 0o777, defaultFileMode);
  await writeFile(testFile, data, { mode: 0o222 });
  const testFileStatAfter = await stat(testFile);
  exists(testFileStatAfter.mode, "mode is null");
  equal(testFileStatAfter.mode & 0o777, 0o222);
  await rm(tempDirPath, { recursive: true, force: true });
});
test("writeFile() writes to a file with a ReadableStream instance", async () => {
  const readStream = new ReadableStream({
    pull(controller) {
      controller.enqueue(new Uint8Array([1]));
      controller.enqueue(new Uint8Array([2]));
      controller.close();
    },
  });
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "writeFile_"));
  const testFile = join(tempDirPath, "testFile.txt");
  await writeFile(testFile, readStream);
  equal(await readFile(testFile), new Uint8Array([1, 2]));
  await rm(tempDirPath, { recursive: true, force: true });
});
test("writeFile() handles an AbortSignal", async () => {
  const ac = new AbortController();
  queueMicrotask(() => ac.abort());
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "writeFile_"));
  const testFile = join(tempDirPath, "testFile.txt");
  const encoder = new TextEncoder();
  const data = encoder.encode("Hello");
  const error = await rejects(async () => {
    await writeFile(testFile, data, { signal: ac.signal });
  }, Error);
  equal(error.name, "AbortError");
  await rm(tempDirPath, { recursive: true, force: true });
});
test("writeFile() handles an AbortSignal with a reason", async () => {
  const ac = new AbortController();
  const reasonErr = new Error();
  queueMicrotask(() => ac.abort(reasonErr));
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "writeFile_"));
  const testFile = join(tempDirPath, "testFile.txt");
  const encoder = new TextEncoder();
  const data = encoder.encode("Hello");
  const error = await rejects(async () => {
    await writeFile(testFile, data, { signal: ac.signal });
  }, Error);
  if (isDeno) {
    equal(error, ac.signal.reason);
  } else if (typeof globals.Bun !== "undefined") {
    equal(error.message, ac.signal.reason?.message);
  } else {
    equal(error.cause, ac.signal.reason);
  }
  await rm(tempDirPath, { recursive: true, force: true });
});
test("writeFile() handles an AbortSignal with a primitive value", async () => {
  const ac = new AbortController();
  const reasonErr = "This is a primitive string";
  queueMicrotask(() => ac.abort(reasonErr));
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "writeFile_"));
  const testFile = join(tempDirPath, "testFile.txt");
  const encoder = new TextEncoder();
  const data = encoder.encode("Hello");
  try {
    await writeFile(testFile, data, { signal: ac.signal });
  } catch (error) {
    if (isDeno) {
      equal(error, ac.signal.reason);
    } else if (typeof globals.Bun !== "undefined") {
      equal(error, ac.signal.reason);
    } else {
      const errorValue = error;
      equal(errorValue.cause, ac.signal.reason);
    }
    await rm(tempDirPath, { recursive: true, force: true });
  }
});
test("writeFile() writes to a file successfully with an attached AbortSignal", async () => {
  const ac = new AbortController();
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "writeFile_"));
  const testFile = join(tempDirPath, "testFile.txt");
  const encoder = new TextEncoder();
  const data = encoder.encode("Hello");
  await writeFile(testFile, data, { signal: ac.signal });
  await rm(tempDirPath, { recursive: true, force: true });
});
test("writeFile() handles an AbortSignal invoked prior to writing the file", async () => {
  const ac = new AbortController();
  ac.abort();
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "writeFile_"));
  const testFile = join(tempDirPath, "testFile.txt");
  const encoder = new TextEncoder();
  const data = encoder.encode("Hello");
  try {
    await writeFile(testFile, data, { signal: ac.signal });
    unreachable();
  } catch (error) {
    ok(error instanceof Error);
    ok(error.name === "AbortError");
  }
  assertMissing(testFile);
  await rm(tempDirPath, { recursive: true, force: true });
});
test("writeFile() rejects with NotFound when writing data to a non-existent path", async () => {
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "writeFile_"));
  // The path contains a non-existent directory making the path non-existent.
  const notFoundPath = join("dir/testFile.txt");
  const encoder = new TextEncoder();
  const data = encoder.encode("Hello");
  await rejects(async () => {
    await writeFile(notFoundPath, data);
  }, NotFound);
  await rm(tempDirPath, { recursive: true, force: true });
});
test("writeFileSync() writes to a file", () => {
  const tempDirPath = mkdtempSync(resolve(tmpdir(), "writeFileSync_"));
  const testFile = join(tempDirPath, "testFile.txt");
  const encoder = new TextEncoder();
  const data = encoder.encode("Hello");
  writeFileSync(testFile, data);
  const dataRead = readFileSync(testFile);
  const decoder = new TextDecoder("utf-8");
  const actualData = decoder.decode(dataRead);
  equal(actualData, "Hello");
  rmSync(tempDirPath, { recursive: true, force: true });
});
test("writeFileSync() handles 'append' to a file", () => {
  const tempDirPath = mkdtempSync(resolve(tmpdir(), "writeFileSync_"));
  const testFile = join(tempDirPath, "testFile.txt");
  const encoder = new TextEncoder();
  const data = encoder.encode("Hello");
  writeFileSync(testFile, data);
  const dataRead = readFileSync(testFile);
  const decoder = new TextDecoder("utf-8");
  const initialData = decoder.decode(dataRead);
  equal(initialData, "Hello");
  const appendData = encoder.encode(", Standard Library");
  writeFileSync(testFile, appendData, { append: true });
  const appendRead = readFileSync(testFile);
  const afterAppendData = decoder.decode(appendRead);
  equal(afterAppendData, "Hello, Standard Library");
  rmSync(tempDirPath, { recursive: true, force: true });
});
test("writeFileSync() handles 'create' when writing to a file", () => {
  const tempDirPath = mkdtempSync(resolve(tmpdir(), "writeFileSync_"));
  const testFile = join(tempDirPath, "testFile.txt");
  const encoder = new TextEncoder();
  const data = encoder.encode("Hello");
  // Throws with NotFound when file does not initally exist.
  throws(() => {
    writeFileSync(testFile, data, { create: false });
  }, NotFound);
  // Creates a file that does not initially exist. (This is default behavior).
  writeFileSync(testFile, data, { create: true });
  const dataRead = readFileSync(testFile);
  const decoder = new TextDecoder("utf-8");
  const initialData = decoder.decode(dataRead);
  equal(initialData, "Hello");
  // Overwrites the existing file with new content.
  const dataAgain = encoder.encode("Hello, Standard Library");
  writeFileSync(testFile, dataAgain, { create: false });
  const dataReadAgain = readFileSync(testFile);
  const readDataAgain = decoder.decode(dataReadAgain);
  equal(readDataAgain, "Hello, Standard Library");
  rmSync(tempDirPath, { recursive: true, force: true });
});
test("writeFileSync() handles 'createNew' when writing to a file", () => {
  const tempDirPath = mkdtempSync(resolve(tmpdir(), "writeFileSync_"));
  const testFile = join(tempDirPath, "testFile.txt");
  const encoder = new TextEncoder();
  const data = encoder.encode("Hello");
  writeFileSync(testFile, data, { createNew: true });
  throws(() => {
    writeFileSync(testFile, data, { createNew: true });
  }, AlreadyExists);
  rmSync(tempDirPath, { recursive: true, force: true });
});
test("writeFileSync() can change the mode of a file", {
  skip: platform() === "win32",
}, () => {
  const tempDirPath = mkdtempSync(resolve(tmpdir(), "writeFileSync_"));
  const testFile = join(tempDirPath, "testFile.txt");
  const encoder = new TextEncoder();
  const data = encoder.encode("Hello");
  writeFileSync(testFile, data);
  const testFileStatBefore = statSync(testFile);
  exists(testFileStatBefore.mode, "mode is null");
  equal(testFileStatBefore.mode & 0o777, defaultFileMode);
  writeFileSync(testFile, data, { mode: 0o222 });
  const testFileStatAfter = statSync(testFile);
  exists(testFileStatAfter.mode, "mode is null");
  equal(testFileStatAfter.mode & 0o777, 0o222);
  rmSync(tempDirPath, { recursive: true, force: true });
});
test("writeFileSync() throws NotFound when writing data to a non-existent path", () => {
  const tempDirPath = mkdtempSync(resolve(tmpdir(), "writeFileSync_"));
  // The path contains a non-existent directory making the path non-existent.
  const notFoundPath = join("dir/testFile.txt");
  const encoder = new TextEncoder();
  const data = encoder.encode("Hello");
  throws(() => {
    writeFileSync(notFoundPath, data);
  }, NotFound);
  rmSync(tempDirPath, { recursive: true, force: true });
});
