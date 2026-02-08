// Copyright 2018-2026 the Deno authors. MIT license.
import { test } from "node:test";
import {
  equal,
  exists,
  ok,
  rejects,
  throws,
  unreachable,
} from "@frostyeti/assert";
import { isDeno } from "./_utils.js";
import { writeTextFile, writeTextFileSync } from "./write_text_file.js";
import { AlreadyExists, NotFound } from "./unstable_errors.js";
import { readTextFile, readTextFileSync } from "./read_text_file.js";
import { stat, statSync } from "./stat.js";
import { rm, rmSync } from "./rm.js";
import { join, resolve } from "node:path";
import { platform, tmpdir } from "node:os";
import { mkdtempSync } from "node:fs";
import { mkdtemp } from "node:fs/promises";
import process from "node:process";
import { globals } from "./globals.js";
const mask = process.umask();
const defaultFileMode = 0o666 & ~mask;
function assertMissing(path) {
  if (pathExists(path)) {
    throw new Error(`File: ${path} exists`);
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
test("writeTextFile() succeeds in writing to a file", async () => {
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "writeTextFile_"));
  const testFile = join(tempDirPath, "testFile.txt");
  await writeTextFile(testFile, "Hello");
  const data = await readTextFile(testFile);
  equal(data, "Hello");
  await rm(tempDirPath, { recursive: true });
});
test("writeTextFile() writes with a ReadableStream object", async () => {
  const readStream = new ReadableStream({
    pull(controller) {
      controller.enqueue("Hello");
      controller.enqueue(", Standard");
      controller.enqueue(" Library");
      controller.close();
    },
  });
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "writeTextFile_"));
  const testFile = join(tempDirPath, "testFile.txt");
  await writeTextFile(testFile, readStream);
  const data = await readTextFile(testFile);
  equal(data, "Hello, Standard Library");
  await rm(tempDirPath, { recursive: true });
});
test("writeTextFile() handles 'append' to a file", async () => {
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "writeTextFile_"));
  const testFile = join(tempDirPath, "testFile.txt");
  await writeTextFile(testFile, "Hello");
  const readBefore = await readTextFile(testFile);
  equal(readBefore, "Hello");
  await writeTextFile(testFile, ", Standard Library", { append: true });
  const readAfter = await readTextFile(testFile);
  equal(readAfter, "Hello, Standard Library");
  // Turn off append to overwrite file.
  await writeTextFile(testFile, "Standard Library", { append: false });
  const readAfterOverwrite = await readTextFile(testFile);
  equal(readAfterOverwrite, "Standard Library");
  await rm(tempDirPath, { recursive: true });
});
test("writeTextFile() handles 'create' for a file", async () => {
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "writeTextFile_"));
  const testFile = join(tempDirPath, "testFile.txt");
  await rejects(async () => {
    await writeTextFile(testFile, "Hello", { create: false });
  }, NotFound);
  await writeTextFile(testFile, "Hello", { create: true });
  const readData = await readTextFile(testFile);
  equal(readData, "Hello");
  await rm(tempDirPath, { recursive: true });
});
test("writeTextFile() handles 'createNew' for a file", async () => {
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "writeTextFile_"));
  const testFile = join(tempDirPath, "testFile.txt");
  await writeTextFile(testFile, "Hello", { createNew: true });
  const readData = await readTextFile(testFile);
  equal(readData, "Hello");
  await rejects(async () => {
    await writeTextFile(testFile, "Hello", { createNew: true });
  }, AlreadyExists);
  await rm(tempDirPath, { recursive: true });
});
test("writeTextFile() can change the mode of a file", {
  skip: platform() === "win32",
}, async () => {
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "writeTextFile_"));
  const testFile = join(tempDirPath, "testFile.txt");
  await writeTextFile(testFile, "Hello");
  const fileStatBefore = await stat(testFile);
  exists(fileStatBefore.mode, "mode is null");
  equal(
    getOctMode(fileStatBefore.mode & 0o777),
    getOctMode(defaultFileMode),
    `Unexpected file mode: ${
      getOctMode(fileStatBefore.mode)
    } (${fileStatBefore.mode}) masked ${
      getOctMode(fileStatBefore.mode & 0o777)
    } vs 0o644 ${0o644}`,
  );
  await writeTextFile(testFile, "Hello", { mode: 0o222 });
  const fileStatAfter = await stat(testFile);
  exists(fileStatAfter.mode, "mode is null");
  equal(
    getOctMode(fileStatAfter.mode & 0o777),
    getOctMode(0o222),
    `Unexpected file mode: ${
      getOctMode(fileStatAfter.mode)
    } (${fileStatAfter.mode}) masked ${
      getOctMode(fileStatAfter.mode & 0o777)
    } vs 0o222 ${0o222}`,
  );
  await rm(tempDirPath, { recursive: true });
});
test("writeTextFile() handles an AbortSignal", async () => {
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "writeTextFile_"));
  const testFile = join(tempDirPath, "testFile.txt");
  const ac = new AbortController();
  queueMicrotask(() => ac.abort());
  const error = await rejects(async () => {
    await writeTextFile(testFile, "Hello", { signal: ac.signal });
  }, Error);
  equal(error.name, "AbortError");
  await rm(tempDirPath, { recursive: true });
});
test("writeTextFile() handles an AbortSignal with a reason", async () => {
  const ac = new AbortController();
  const reasonErr = new Error();
  queueMicrotask(() => ac.abort(reasonErr));
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "writeTextFile_"));
  const testFile = join(tempDirPath, "testFile.txt");
  const error = await rejects(async () => {
    await writeTextFile(testFile, "Hello", { signal: ac.signal });
  }, Error);
  if (isDeno) {
    equal(error, ac.signal.reason);
  } else if (typeof globals.Bun !== "undefined") {
    equal(error.message, ac.signal.reason?.message);
  } else {
    equal(error.cause, ac.signal.reason);
  }
  await rm(tempDirPath, { recursive: true });
});
test("writeTextFile() handles an AbortSignal with a primitive reason", async () => {
  const ac = new AbortController();
  const reasonErr = "This is a primitive string.";
  queueMicrotask(() => ac.abort(reasonErr));
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "writeTextFile_"));
  const testFile = join(tempDirPath, "testFile.txt");
  try {
    await writeTextFile(testFile, "Hello", { signal: ac.signal });
  } catch (error) {
    if (isDeno) {
      equal(error, ac.signal.reason);
    } else if (typeof globals.Bun !== "undefined") {
      equal(error, ac.signal.reason);
    } else {
      const errorValue = error;
      equal(errorValue.cause, ac.signal.reason);
    }
  }
  await rm(tempDirPath, { recursive: true });
});
test("writeTextFile() writes to a file successfully with an attached AbortSignal", async () => {
  const ac = new AbortController();
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "writeTextFile_"));
  const testFile = join(tempDirPath, "testFile.txt");
  await writeTextFile(testFile, "Hello", { signal: ac.signal });
  await rm(tempDirPath, { recursive: true });
});
test("writeTextFile() handles an AbortSignal invoked prior to writing the file", async () => {
  const ac = new AbortController();
  ac.abort();
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "writeTextFile_"));
  const testFile = join(tempDirPath, "testFile.txt");
  try {
    await writeTextFile(testFile, "Hello", { signal: ac.signal });
    unreachable();
  } catch (error) {
    ok(error instanceof Error);
    ok(error.name === "AbortError");
  }
  assertMissing(testFile);
  await rm(tempDirPath, { recursive: true });
});
test("writeTextFile() rejects with a NotFound when writing to a nonexistent path", async () => {
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "writeTextFile_"));
  const testPath = join(tempDirPath, "dir/testFile.txt");
  await rejects(async () => {
    await writeTextFile(testPath, "Hello, Standard Library");
  }, NotFound);
  await rm(tempDirPath, { recursive: true });
});
test("writeTextFileSync() succeeds in writing to a file", () => {
  const tempDirPath = mkdtempSync(resolve(tmpdir(), "writeTextFileSync_"));
  const testFile = join(tempDirPath, "testFile.txt");
  writeTextFileSync(testFile, "Hello");
  const data = readTextFileSync(testFile);
  equal(data, "Hello");
  rmSync(tempDirPath, { recursive: true });
});
function getOctMode(mode) {
  if (mode === undefined) {
    return "undefined";
  }
  return "0o" + (mode & 0o777).toString(8).padStart(3, "0");
}
test("writeTextFileSync() can change the mode of a file", {
  skip: platform() === "win32",
}, () => {
  const tempDirPath = mkdtempSync(resolve(tmpdir(), "writeTextFileSync_"));
  const testFile = join(tempDirPath, "testFile.txt");
  writeTextFileSync(testFile, "Hello");
  const fileStatBefore = statSync(testFile);
  exists(fileStatBefore.mode, "mode is null");
  equal(
    fileStatBefore.mode & 0o777,
    defaultFileMode,
    `Unexpected file mode: ${
      getOctMode(fileStatBefore.mode)
    } (${fileStatBefore.mode}) masked ${
      getOctMode(fileStatBefore.mode & 0o777)
    } vs 0o644 ${0o644}`,
  );
  writeTextFileSync(testFile, "Hello", { mode: 0o222 });
  const fileStatAfter = statSync(testFile);
  exists(fileStatAfter.mode, "mode is null");
  equal(
    fileStatAfter.mode & 0o777,
    0o222,
    `Unexpected file mode: ${
      getOctMode(fileStatAfter.mode)
    } (${fileStatAfter.mode}) masked ${
      getOctMode(fileStatAfter.mode & 0o777)
    } vs 0o222 ${0o222}`,
  );
  rmSync(tempDirPath, { recursive: true });
});
test("writeTextFileSync() handles 'append' to a file", () => {
  const tempDirPath = mkdtempSync(resolve(tmpdir(), "writeTextFileSync_"));
  const testFile = join(tempDirPath, "testFile.txt");
  writeTextFileSync(testFile, "Hello");
  const readBefore = readTextFileSync(testFile);
  equal(readBefore, "Hello");
  writeTextFileSync(testFile, ", Standard Library", { append: true });
  const readAfter = readTextFileSync(testFile);
  equal(readAfter, "Hello, Standard Library");
  // Turn off append to overwrite file.
  writeTextFileSync(testFile, "Standard Library", { append: false });
  const readAfterOverwrite = readTextFileSync(testFile);
  equal(readAfterOverwrite, "Standard Library");
  rmSync(tempDirPath, { recursive: true });
});
test("writeTextFileSync() handles 'create' for a file", () => {
  const tempDirPath = mkdtempSync(resolve(tmpdir(), "writeTextFileSync_"));
  const testFile = join(tempDirPath, "testFile.txt");
  throws(() => {
    writeTextFileSync(testFile, "Hello", { create: false });
  }, NotFound);
  writeTextFileSync(testFile, "Hello", { create: true });
  const readData = readTextFileSync(testFile);
  equal(readData, "Hello");
  rmSync(tempDirPath, { recursive: true });
});
test("writeTextFileSync() handles 'createNew' for a file", () => {
  const tempDirPath = mkdtempSync(resolve(tmpdir(), "writeTextFileSync_"));
  const testFile = join(tempDirPath, "testFile.txt");
  writeTextFileSync(testFile, "Hello", { createNew: true });
  const readData = readTextFileSync(testFile);
  equal(readData, "Hello");
  throws(() => {
    writeTextFileSync(testFile, "Hello", { createNew: true });
  }, AlreadyExists);
  rmSync(tempDirPath, { recursive: true });
});
test("writeTextFileSync() throws with a NotFound when writing to a nonexistent path", () => {
  const tempDirPath = mkdtempSync(resolve(tmpdir(), "writeTextFileSync_"));
  const testPath = join(tempDirPath, "dir/testFile.txt");
  throws(() => {
    writeTextFileSync(testPath, "Hello, Standard Library");
  }, NotFound);
  rmSync(tempDirPath, { recursive: true });
});
