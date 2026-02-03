// Copyright 2018-2026 the Deno authors. MIT license.
import { test } from "node:test";
import { equal, ok, rejects, throws, unreachable } from "@frostyeti/assert";
import { readFile, readFileSync } from "./read_file.ts";
import { NotFound } from "./unstable_errors.ts";
import { isDeno } from "./_utils.ts";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { globals } from "./globals.ts";

const moduleDir = dirname(fileURLToPath(import.meta.url));
const testdataDir = resolve(moduleDir, "testdata");
const testFile = join(testdataDir, "copy_file.txt");

test("readFile() reads a file", async () => {
  const decoder = new TextDecoder("utf-8");
  const data = await readFile(testFile);

  ok(data.byteLength > 0);
  equal(decoder.decode(data), "txt");
});

test("readFile() is called repeatedly", async () => {
  for (let i = 0; i < 256; i++) {
    await readFile(testFile);
  }
});

test("readFile() rejects with Error when reading a file path to a directory", async () => {
  await rejects(async () => {
    await readFile(testdataDir);
  }, Error);
});

test("readFile() handles an AbortSignal", async () => {
  const ac = new AbortController();
  queueMicrotask(() => ac.abort());

  const error = await rejects(async () => {
    await readFile(testFile, { signal: ac.signal });
  }, Error);
  equal(error.name, "AbortError");
});

test("readFile() handles an AbortSignal with a reason", async () => {
  const ac = new AbortController();
  const reasonErr = new Error("Custom abort reason");
  queueMicrotask(() => ac.abort(reasonErr));

  const error = await rejects(async () => {
    await readFile(testFile, { signal: ac.signal });
  }, Error);

  if (isDeno) {
    equal(error, ac.signal.reason);
  } else if (typeof globals.Bun !== "undefined") {
    equal(error.message, ac.signal.reason?.message);
  } else {
    equal(error.cause, ac.signal.reason);
  }
});

test("readFile() handles an AbortSignal with a primitive reason value", async () => {
  const ac = new AbortController();
  const reasonErr = "Some string";
  queueMicrotask(() => ac.abort(reasonErr));

  try {
    await readFile(testFile, { signal: ac.signal });
    unreachable();
  } catch (error) {
    if (isDeno || typeof globals.Bun !== "undefined") {
      equal(error, ac.signal.reason);
    } else {
      const errorValue = error as Error;
      equal(errorValue.cause, ac.signal.reason);
    }
  }
});

test("readFile() handles cleanup of an AbortController", async () => {
  const ac = new AbortController();
  await readFile(testFile, { signal: ac.signal });
});

test("readFile() rejects with NotFound when reading from a non-existent file", async () => {
  await rejects(async () => {
    await readFile("non-existent-file.txt");
  }, NotFound);
});

test("readFileSync() reads a file", () => {
  const decoder = new TextDecoder("utf-8");
  const data = readFileSync(testFile);

  ok(data.byteLength > 0);
  equal(decoder.decode(data), "txt");
});

test("readFileSync() is called repeatedly", () => {
  for (let i = 0; i < 256; i++) {
    readFileSync(testFile);
  }
});

test("readFileSync() throws with Error when reading a file path to a directory", () => {
  throws(() => {
    readFileSync(testdataDir);
  }, Error);
});

test("readFileSync() throws with NotFound when reading from a non-existent file", () => {
  throws(() => {
    readFileSync("non-existent-file.txt");
  }, NotFound);
});