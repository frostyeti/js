// Copyright 2018-2026 the Deno authors. MIT license.
import { test } from "node:test";
import { equal, ok, rejects, throws } from "@frostyeti/assert";
import { create, createSync } from "./create.ts";
import { mkdtemp, rm, stat, writeFile } from "node:fs/promises";
import { mkdtempSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

test("create() creates a file", async () => {
    const tempDirPath = await mkdtemp(resolve(tmpdir(), "create_"));
    const testFile = join(tempDirPath, "createFile.txt");

    const fh = await create(testFile);

    let fileStat = await fh.stat();
    ok(fileStat.isFile);
    equal(fileStat.size, 0);

    const encoder = new TextEncoder();
    const data = encoder.encode("Hello, Standard Library");
    await fh.write(data);

    fileStat = await fh.stat();
    equal(fileStat.size, 23);

    fh.close();
    await rm(tempDirPath, { recursive: true, force: true });
});

test("create() truncates an existing file path", async () => {
    const tempDirPath = await mkdtemp(resolve(tmpdir(), "create_"));
    const tempFile = join(tempDirPath, "create_file.txt");
    await writeFile(tempFile, "Hello, Standard Library");

    const fh = await create(tempFile);

    const fileStat = await stat(tempFile);
    equal(fileStat.size, 0);

    fh.close();
    await rm(tempDirPath, { recursive: true, force: true });
});

test("create() rejects with Error when using a file path that is not a regular file", async () => {
    const tempDir = await mkdtemp(resolve(tmpdir(), "create_"));

    await rejects(async () => {
        await create(tempDir);
    }, Error);

    await rm(tempDir, { recursive: true, force: true });
});

test("createSync() creates a new file", () => {
    const tempDirPath = mkdtempSync(resolve(tmpdir(), "createSync_"));
    const testFile = join(tempDirPath, "createFile.txt");

    const fh = createSync(testFile);

    let fileStat = fh.statSync();
    ok(fileStat.isFile);
    equal(fileStat.size, 0);

    const encoder = new TextEncoder();
    const data = encoder.encode("Hello, Standard Library");
    fh.writeSync(data);

    fileStat = fh.statSync();
    equal(fileStat.size, 23);

    fh.close();
    rmSync(tempDirPath, { recursive: true, force: true });
});

test("createSync() truncates an existing file path", () => {
    const tempDirPath = mkdtempSync(resolve(tmpdir(), "createSync_"));
    const tempFile = join(tempDirPath, "create_file.txt");
    writeFileSync(tempFile, "Hello, Standard Library");

    const fh = createSync(tempFile);

    const fileStat = statSync(tempFile);
    equal(fileStat.size, 0);

    fh.close();
    rmSync(tempDirPath, { recursive: true, force: true });
});

test("createSync() throws with Error when using a file path that is not a regular file", () => {
    const tempDir = mkdtempSync(resolve(tmpdir(), "createSync_"));

    throws(() => {
        createSync(tempDir);
    }, Error);

    rmSync(tempDir, { recursive: true, force: true });
});
