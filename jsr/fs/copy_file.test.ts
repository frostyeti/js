// Copyright 2018-2026 the Deno authors. MIT license.
import { test } from "node:test";
import { ok, rejects, throws } from "@frostyeti/assert";
import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { copyFile, copyFileSync } from "./copy_file.ts";

test("copyFile() copies content to an existed file", async () => {
    const tempDirPath = await mkdtemp(resolve(tmpdir(), "copy_file_async_"));
    const source = join(tempDirPath, "source.txt");
    const target = join(tempDirPath, "target.txt");

    const content = "This is written by `copyFile` API";

    await writeFile(source, content);
    await writeFile(target, "");
    await copyFile(source, target);

    try {
        const targetContent = await readFile(target, "utf-8");
        ok(content === targetContent);
    } finally {
        await rm(tempDirPath, { recursive: true, force: true });
    }
});

test("copyFile() copies content to a directory, which will throw an error", async () => {
    const tempDirPath = await mkdtemp(resolve(tmpdir(), "copy_file_async_"));
    const source = join(tempDirPath, "source.txt");

    const content = "This is written by `copyFile` API";

    await writeFile(source, content);

    try {
        await rejects(async () => {
            await copyFile(source, tmpdir());
        });
    } finally {
        await rm(tempDirPath, { recursive: true, force: true });
    }
});

test("copyFile() copies content to a non existed file", async () => {
    const tempDirPath = await mkdtemp(resolve(tmpdir(), "copy_file_async_"));
    const source = join(tempDirPath, "source.txt");
    const target = join(tempDirPath, "target.txt");

    const content = "This is written by `copyFile` API";

    await writeFile(source, content);
    await copyFile(source, target);

    const fileInfo = await stat(target);
    const targetContent = await readFile(target, "utf-8");

    try {
        ok(fileInfo.isFile());
        ok(content === targetContent);
    } finally {
        await rm(tempDirPath, { recursive: true, force: true });
    }
});

test("copyFileSync() copies content to an existed file", () => {
    const tempDirPath = mkdtempSync(resolve(tmpdir(), "copy_file_sync_"));
    const source = join(tempDirPath, "source.txt");
    const target = join(tempDirPath, "target.txt");

    const content = "This is written by `copyFileSync` API";

    writeFileSync(source, content);
    writeFileSync(target, "");
    copyFileSync(source, target);

    const targetContent = readFileSync(target, "utf-8");
    ok(content === targetContent);

    rmSync(tempDirPath, { recursive: true, force: true });
});

test("copyFileSync() copies content to a directory, which will throw an error", () => {
    const tempDirPath = mkdtempSync(resolve(tmpdir(), "copy_file_sync_"));
    const source = join(tempDirPath, "source.txt");

    const content = "This is written by `copyFile` API";

    writeFileSync(source, content);

    try {
        throws(() => {
            copyFileSync(source, tmpdir());
        });
    } finally {
        rmSync(tempDirPath, { recursive: true, force: true });
    }
});

test("copyFileSync() copies content to a non existed file", () => {
    const tempDirPath = mkdtempSync(resolve(tmpdir(), "copy_file_sync_"));
    const source = join(tempDirPath, "source.txt");
    const target = join(tempDirPath, "target.txt");

    const content = "This is written by `copyFileSync` API";

    writeFileSync(source, content);
    copyFileSync(source, target);

    const targetIsExists = existsSync(target);
    const targetContent = readFileSync(target, "utf-8");

    ok(targetIsExists);
    ok(content === targetContent);

    rmSync(tempDirPath, { recursive: true, force: true });
});
