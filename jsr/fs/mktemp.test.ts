// Copyright 2018-2026 the Deno authors. MIT license.
import { test } from "node:test";
import { ok, rejects, throws } from "@frostyeti/assert";
import { mktemp, mktempSync } from "./mktemp.ts";
import { NotFound } from "./unstable_errors.ts";
import { mkdtemp, mkdtempSync } from "./mkdtemp.ts";
import { rmSync } from "node:fs";
import { rm } from "node:fs/promises";

test("mktemp() creates temporary files in the default temp directory path", async () => {
    const tempFile1 = await mktemp({
        prefix: "standard",
        suffix: "library",
    });
    const tempFile2 = await mktemp({
        prefix: "standard",
        suffix: "library",
    });

    try {
        ok(tempFile1 !== tempFile2);

        for (const file of [tempFile1, tempFile2]) {
            const tempFileName = file.replace(/^.*[\\\/]/, "");
            ok(tempFileName.startsWith("standard"));
            ok(tempFileName.endsWith("library"));
        }
    } finally {
        await rm(tempFile1);
        await rm(tempFile2);
    }
});

test("mktemp() creates temporary files in the 'dir' option", async () => {
    const tempDirPath = await mkdtemp({ prefix: "mktemp_" });
    const tempFile = await mktemp({ dir: tempDirPath });

    try {
        ok(tempFile.startsWith(tempDirPath));
        ok(/^[\\\/]/.test(tempFile.slice(tempDirPath.length)));
    } finally {
        await rm(tempDirPath, { recursive: true, force: true });
    }
});

test("mktemp() rejects with NotFound when passing a 'dir' path that does not exist", async () => {
    await rejects(async () => {
        await mktemp({ dir: "/non-existent-dir" });
    }, NotFound);
});

test("mktempSync() creates temporary files in the default temp directory path", () => {
    const tempFile1 = mktempSync({ prefix: "standard", suffix: "library" });
    const tempFile2 = mktempSync({ prefix: "standard", suffix: "library" });

    try {
        ok(tempFile1 !== tempFile2);

        for (const file of [tempFile1, tempFile2]) {
            const tempFileName = file.replace(/^.*[\\\/]/, "");
            ok(tempFileName.startsWith("standard"));
            ok(tempFileName.endsWith("library"));
        }
    } finally {
        rmSync(tempFile1);
        rmSync(tempFile2);
    }
});

test("mktempSync() creates temporary files in the 'dir' option", () => {
    const tempDirPath = mkdtempSync({ prefix: "mktempSync_" });
    const tempFile = mktempSync({ dir: tempDirPath });

    try {
        ok(tempFile.startsWith(tempDirPath));
        ok(/^[\\\/]/.test(tempFile.slice(tempDirPath.length)));
    } finally {
        rmSync(tempDirPath, { recursive: true, force: true });
    }
});

test("mktempSync() throws with NotFound when passing a 'dir' path that does not exist", () => {
    throws(() => {
        mktempSync({ dir: "/non-existent-dir" });
    }, NotFound);
});
