// Copyright 2018-2026 the Deno authors. MIT license.
import { test } from "node:test";
import { ok, rejects, throws } from "@frostyeti/assert";
import { lstat, lstatSync } from "./lstat.ts";
import { NotFound } from "./unstable_errors.ts";
import { dirname, fromFileUrl, join } from "@frostyeti/path";
import { globals } from "./globals.ts";

const __dirname = import.meta.dirname ?? dirname(fromFileUrl(import.meta.url));

test("lstat() and lstatSync() return FileInfo for a file", async () => {
    const file = join(__dirname, globals.Deno ? "README.md" : "../README.md");
    {
        const fileInfo = await lstat(file);
        ok(fileInfo.isFile);
    }
    {
        const fileInfo = lstatSync(file);
        ok(fileInfo.isFile);
    }
});

test("lstat() and lstatSync() do not follow symlinks", async () => {
    const linkFile = join(__dirname, "testdata/0-link");
    {
        const fileInfo = await lstat(linkFile);
        ok(fileInfo.isSymlink);
    }
    {
        const fileInfo = lstatSync(linkFile);
        ok(fileInfo.isSymlink);
    }
});

test("lstat() and lstatSync() return FileInfo for a directory", async () => {
    {
        const fileInfo = await lstat(__dirname);
        ok(fileInfo.isDirectory);
    }
    {
        const fileInfo = lstatSync(__dirname);
        ok(fileInfo.isDirectory);
    }
});

test("lstat() and lstatSync() throw with NotFound for a non-existent file", async () => {
    await rejects(async () => {
        await lstat(join(__dirname, "non_existent_file"));
    }, NotFound);
    throws(() => {
        lstatSync(join(__dirname, "non_existent_file"));
    }, NotFound);
});
