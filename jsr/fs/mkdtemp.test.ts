// Copyright 2018-2026 the Deno authors. MIT license.
import { test } from "node:test";
import { ok, rejects, throws } from "@frostyeti/assert";
import { mkdtemp, mkdtempSync } from "./mkdtemp.ts";
import { NotFound } from "./unstable_errors.ts";
import { rmSync } from "node:fs";
import { rm } from "node:fs/promises";

test("mkdtemp() creates temporary directories in the default temp directory path", async () => {
    const dir1 = await mkdtemp({ prefix: "standard", suffix: "library" });
    const dir2 = await mkdtemp({ prefix: "standard", suffix: "library" });

    try {
        ok(dir1 !== dir2);

        for (const dir of [dir1, dir2]) {
            const tempDirName = dir.replace(/^.*[\\\/]/, "");
            ok(tempDirName.startsWith("standard"));
            ok(tempDirName.endsWith("library"));
        }
    } finally {
        await rm(dir1, { recursive: true, force: true });
        await rm(dir2, { recursive: true, force: true });
    }
});

test("mkdtemp() creates temporary directories with the 'dir' option", async () => {
    const tempParent = await mkdtemp({ prefix: "first", suffix: "last" });
    const dir = await mkdtemp({ dir: tempParent });

    try {
        ok(dir.startsWith(tempParent));
        ok(/^[\\\/]/.test(dir.slice(tempParent.length)));
    } finally {
        await rm(tempParent, { recursive: true, force: true });
    }
});

test("mkdtemp() rejects with NotFound when passing a 'dir' path that does not exist", async () => {
    await rejects(async () => {
        await mkdtemp({ dir: "/non-existent-dir" });
    }, NotFound);
});

test("mkdtempSync() creates temporary directories in the default temp directory path", () => {
    const dir1 = mkdtempSync({ prefix: "standard", suffix: "library" });
    const dir2 = mkdtempSync({ prefix: "standard", suffix: "library" });

    try {
        ok(dir1 !== dir2);

        for (const dir of [dir1, dir2]) {
            const tempDirName = dir.replace(/^.*[\\\/]/, "");
            ok(tempDirName.startsWith("standard"));
            ok(tempDirName.endsWith("library"));
        }
    } finally {
        rmSync(dir1, { recursive: true, force: true });
        rmSync(dir2, { recursive: true, force: true });
    }
});

test("mkdtempSync() creates temporary directories with the 'dir' option", () => {
    const tempParent = mkdtempSync({ prefix: "first", suffix: "last" });
    const dir = mkdtempSync({ dir: tempParent });

    try {
        ok(dir.startsWith(tempParent));
        ok(/^[\\\/]/.test(dir.slice(tempParent.length)));
    } finally {
        rmSync(tempParent, { recursive: true, force: true });
    }
});

test("mkdtempSync() throws with NotFound when passing a 'dir' path that does not exist", () => {
    throws(() => {
        mkdtempSync({ dir: "/non-existent-dir" });
    }, NotFound);
});
