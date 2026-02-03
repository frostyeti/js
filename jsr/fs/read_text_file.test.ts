// Copyright 2018-2026 the Deno authors. MIT license.
import { test } from "node:test";
import { equal, ok, rejects, throws } from "@frostyeti/assert";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { isDeno } from "./_utils.ts";
import { NotFound } from "./unstable_errors.ts";
import { readTextFile, readTextFileSync } from "./read_text_file.ts";
import { globals } from "./globals.ts";

const moduleDir = dirname(fileURLToPath(import.meta.url));
const testDir = resolve(moduleDir, "testdata");
const testFile = join(testDir, "copy_file.txt");
const testFile2 = join(testDir, "copy_file_bom.txt");

test("readTextFile() reads content from txt file", async () => {
    const content = await readTextFile(testFile);

    ok(content.length > 0);
    ok(content === "txt");
});

test("readTextFile() reads a file with byte order mark", async () => {
    const content = await readTextFile(testFile2);

    equal(content, "\ufeffhello");
});

test("readTextFile() throws an Error when reading a directory", async () => {
    await rejects(async () => {
        await readTextFile(testDir);
    }, Error);
});

test("readTextFile() handles an AbortSignal", async () => {
    const ac = new AbortController();
    queueMicrotask(() => ac.abort());

    const error = await rejects(async () => {
        await readTextFile(testFile, { signal: ac.signal });
    }, Error);

    equal(error.name, "AbortError");
});

test("readTextFile() handles an AbortSignal with a reason", async () => {
    const ac = new AbortController();
    const reasonErr = new Error();
    queueMicrotask(() => ac.abort(reasonErr));

    const error = await rejects(async () => {
        await readTextFile(testFile, { signal: ac.signal });
    }, Error);

    if (isDeno) {
        equal(error, ac.signal.reason);
    } else if (typeof globals.Bun !== "undefined") {
        equal(error.message, ac.signal.reason?.message);
    } else {
        equal(error.cause, ac.signal.reason);
    }
});

test("readTextFileSync() reads content from txt file", () => {
    const content = readTextFileSync(testFile);

    ok(content.length > 0);
    ok(content === "txt");
});

test("readTextFileSync() reads a file with byte order mark", () => {
    const content = readTextFileSync(testFile2);

    equal(content, "\ufeffhello");
});

test("readTextFileSync() throws an Error when reading a directory", () => {
    throws(() => {
        readTextFileSync(testDir);
    }, Error);
});

test("readTextFileSync() throws NotFound when reading through a non-existent file", () => {
    throws(() => {
        readTextFileSync("no-this-file.txt");
    }, NotFound);
});
