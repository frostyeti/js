// Copyright 2018-2026 the Deno authors. MIT license.
import { test } from "node:test";
import { equal, exists, ok, rejects, throws } from "@frostyeti/assert";
import { AlreadyExists } from "./unstable_errors.ts";
import { mkdir, mkdirSync } from "./mkdir.ts";
import { mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { lstatSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { platform, tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { umask } from "./umask.ts";

umask(0o022);

function assertDirectory(path: string, expectMode?: number) {
    const dirStat = lstatSync(path);
    ok(dirStat.isDirectory());
    if (platform() !== "win32" && expectMode !== undefined) {
        exists(dirStat.mode);
        equal(dirStat.mode & 0o777, expectMode & ~umask(0o022));
    }
}

test("mkdir() creates a directory with the default mode", async () => {
    const tempDirPath = await mkdtemp(resolve(tmpdir(), "mkdir_"));
    const testDir = join(tempDirPath, "testDir");

    await mkdir(testDir);
    assertDirectory(testDir, 0o755);

    await rm(tempDirPath, { recursive: true, force: true });
});

test("mkdir() creates a directory with a user-defined mode", async () => {
    const tempDirPath = await mkdtemp(resolve(tmpdir(), "mkdir_"));
    const testDir = join(tempDirPath, "testDir");

    await mkdir(testDir, { mode: 0o700 });
    assertDirectory(testDir, 0o700);

    await rm(tempDirPath, { recursive: true, force: true });
});

test("mkdir() recursively creates directories with the default mode", async () => {
    const tempDirPath = await mkdtemp(resolve(tmpdir(), "mkdir_"));
    const recurPath = join(tempDirPath, "nested/dir");
    const nestedDir = join(tempDirPath, "nested");

    await mkdir(recurPath, { recursive: true });
    assertDirectory(recurPath, 0o755);
    assertDirectory(nestedDir, 0o755);

    await rm(tempDirPath, { recursive: true, force: true });
});

test("mkdir() allows creating the same directory with the recursive flag", async () => {
    const tempDirPath = await mkdtemp(resolve(tmpdir(), "mkdir_"));
    const testDir = join(tempDirPath, "dir");

    await mkdir(testDir);
    await mkdir(testDir, { recursive: true });
    await mkdir(testDir, { recursive: true, mode: 0o731 });

    // The directory retains the same mode when initially created.
    assertDirectory(testDir, 0o755);

    await rm(tempDirPath, { recursive: true, force: true });
});

test("mkdir() rejects with AlreadyExists when creating an existing directory", async () => {
    await rejects(async () => {
        await mkdir(".");
    }, AlreadyExists);
});

test("mkdir() rejects with AlreadyExists when creating a directory that is the same name as a regular file", async () => {
    const tempDirPath = await mkdtemp(resolve(tmpdir(), "mkdir_"));
    const testFile = join(tempDirPath, "a-file.txt");
    await writeFile(testFile, "Hello, Standard Library");

    await rejects(async () => {
        await mkdir(testFile, { recursive: false });
    }, AlreadyExists);

    await rejects(async () => {
        await mkdir(testFile, { recursive: true });
    }, AlreadyExists);

    await rm(tempDirPath, { recursive: true, force: true });
});

test("mkdir() rejects with AlreadyExists when creating a directory on symlinks", {
    skip: platform() === "win32",
}, async () => {
    const tempDirPath = await mkdtemp(resolve(tmpdir(), "mkdir_"));
    const testDir = join(tempDirPath, "dir");
    const noFile = join(tempDirPath, "nonexistent");
    const testDirLink = join(tempDirPath, "testDirLink");
    const noFileLink = join(tempDirPath, "noFileSymlink");

    await mkdir(testDir);
    await symlink(testDir, testDirLink);
    await symlink(noFile, noFileLink);

    await rejects(async () => {
        await mkdir(noFileLink);
    }, AlreadyExists);

    await rejects(async () => {
        await mkdir(testDirLink);
    }, AlreadyExists);

    await rm(tempDirPath, { recursive: true, force: true });
});

test("mkdirSync() creates a directory with the default mode", () => {
    const tempDirPath = mkdtempSync(resolve(tmpdir(), "mkdirSync_"));
    const testDir = join(tempDirPath, "testDir");

    mkdirSync(testDir);
    assertDirectory(testDir, 0o755);

    rmSync(tempDirPath, { recursive: true, force: true });
});

test("mkdirSync() creates a directory with a user-defined mode", () => {
    const tempDirPath = mkdtempSync(resolve(tmpdir(), "mkdirSync_"));
    const testDir = join(tempDirPath, "testDir");

    mkdirSync(testDir, { mode: 0o700 });
    assertDirectory(testDir, 0o700);

    rmSync(tempDirPath, { recursive: true, force: true });
});

test("mkdirSync() recursively creates directories with the default mode", () => {
    const tempDirPath = mkdtempSync(resolve(tmpdir(), "mkdirSync_"));
    const recurPath = join(tempDirPath, "nested/dir");
    const nestedDir = join(tempDirPath, "nested");

    mkdirSync(recurPath, { recursive: true });
    assertDirectory(recurPath, 0o755);
    assertDirectory(nestedDir, 0o755);

    rmSync(tempDirPath, { recursive: true, force: true });
});

test("mkdirSync() allows creating the same directory with the recursive flag", () => {
    const tempDirPath = mkdtempSync(resolve(tmpdir(), "mkdirSync_"));
    const testDir = join(tempDirPath, "dir");

    mkdirSync(testDir);
    mkdirSync(testDir, { recursive: true });
    mkdirSync(testDir, { recursive: true, mode: 0o731 });

    // The directory retains the same mode when initially created.
    assertDirectory(testDir, 0o755);

    rmSync(tempDirPath, { recursive: true, force: true });
});

test("mkdirSync() throws with AlreadyExists when creating an existing directory", () => {
    throws(() => {
        mkdirSync(".");
    }, AlreadyExists);
});

test("mkdirSync() throws with AlreadyExists when creating a directory that is the same name as a regular file", () => {
    const tempDirPath = mkdtempSync(resolve(tmpdir(), "mkdirSync_"));
    const testFile = join(tempDirPath, "a-file.txt");
    writeFileSync(testFile, "Hello, Standard Library");

    throws(() => {
        mkdirSync(testFile, { recursive: false });
    }, AlreadyExists);

    throws(() => {
        mkdirSync(testFile, { recursive: true });
    }, AlreadyExists);

    rmSync(tempDirPath, { recursive: true, force: true });
});

test("mkdirSync() throws with AlreadyExists when creating a directory on symlinks", {
    skip: platform() === "win32",
}, () => {
    const tempDirPath = mkdtempSync(resolve(tmpdir(), "mkdirSync_"));
    const testDir = join(tempDirPath, "dir");
    const noFile = join(tempDirPath, "nonexistent");
    const testDirLink = join(tempDirPath, "testDirLink");
    const noFileLink = join(tempDirPath, "noFileSymlink");

    mkdirSync(testDir);
    symlinkSync(testDir, testDirLink);
    symlinkSync(noFile, noFileLink);

    throws(() => {
        mkdirSync(noFileLink);
    }, AlreadyExists);

    throws(() => {
        mkdirSync(testDirLink);
    }, AlreadyExists);

    rmSync(tempDirPath, { recursive: true, force: true });
});
