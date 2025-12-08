// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
import { test } from "node:test";
import { walk, WalkError, type WalkOptions, walkSync } from "./walk.ts";
import { arrayIncludes, equal, rejects, throws } from "@frostyeti/assert";
import { fromFileUrl, resolve } from "@frostyeti/path";
import { makeDir } from "./make_dir.ts";
import { remove } from "./remove.ts";
import { exists as existsAsync } from "./exists.ts";
import { globals, WIN } from "./globals.ts";
import { exec } from "./_testutils.ts";

const g : Record<string, unknown> = globalThis as Record<string, unknown>;
const isBun = g.Bun !== undefined;

const o : test.TestOptions = {};
if (!isBun && WIN) {
    o.skip = true;
}

const testdataDir = resolve(fromFileUrl(import.meta.url), "../testdata/walk");

async function assertWalkPaths(
    rootPath: string,
    expectedPaths: string[],
    options?: WalkOptions,
) {
    const root = resolve(testdataDir, rootPath);
    const entries = await Array.fromAsync(walk(root, options));

    const expected = expectedPaths.map((path) => resolve(root, path));
    equal(entries.length, expected.length);

    arrayIncludes(entries.map(({ path }) => path), expected);
}

function assertWalkSyncPaths(
    rootPath: string,
    expectedPaths: string[],
    options?: WalkOptions,
) {
    const root = resolve(testdataDir, rootPath);
    const entriesSync = Array.from(walkSync(root, options));

    const expected = expectedPaths.map((path) => resolve(root, path));
    equal(entriesSync.length, expected.length);
    arrayIncludes(entriesSync.map(({ path }) => path), expected);
}

test("fs::walk() returns current dir for empty dir", async () => {
    const emptyDir = resolve(testdataDir, "empty_dir");
    if (await existsAsync(emptyDir)) {
        await remove(emptyDir);
    }
    await makeDir(emptyDir);
    try {
        await assertWalkPaths("empty_dir", ["."]);
    } finally {
        await remove(emptyDir);
    }
});

test("fs::walkSync() returns current dir for empty dir", async () => {
    const emptyDir = resolve(testdataDir, "empty_dir");
    if (await existsAsync(emptyDir)) {
        await remove(emptyDir);
    }
    await makeDir(emptyDir);

    try {
        assertWalkSyncPaths("empty_dir", ["."]);
    } finally {
        await remove(emptyDir);
    }
});

test("fs::walk() returns current dir and single file", async () =>
    await assertWalkPaths("single_file", [".", "x"]));

test("fs::walkSync() returns current dir and single file", () =>
    assertWalkSyncPaths("single_file", [".", "x"]));

test("fs::walk() returns current dir, subdir, and nested file", async () =>
    await assertWalkPaths("nested_single_file", [".", "a", "a/x"]));

test("fs::walkSync() returns current dir, subdir, and nested file", () =>
    assertWalkSyncPaths("nested_single_file", [".", "a", "a/x"]));

test("fs::walk() accepts maxDepth option", async () =>
    await assertWalkPaths("depth", [".", "a", "a/b", "a/b/c"], { maxDepth: 3 }));

test("fs::walkSync() accepts maxDepth option", () =>
    assertWalkSyncPaths("depth", [".", "a", "a/b", "a/b/c"], { maxDepth: 3 }));

test("fs::walk() accepts includeDirs option set to false", async () =>
    await assertWalkPaths("depth", ["a/b/c/d/x"], { includeDirs: false }));

test("fs::walkSync() accepts includeDirs option set to false", () =>
    assertWalkSyncPaths("depth", ["a/b/c/d/x"], { includeDirs: false }));

test("fs::walk() accepts includeFiles option set to false", async () =>
    await assertWalkPaths("depth", [".", "a", "a/b", "a/b/c", "a/b/c/d"], {
        includeFiles: false,
    }));

test("fs::walkSync() accepts includeFiles option set to false", () =>
    assertWalkSyncPaths("depth", [".", "a", "a/b", "a/b/c", "a/b/c/d"], {
        includeFiles: false,
    }));

test("fs::walk() accepts ext option as strings", async () =>
    await assertWalkPaths("ext", ["y.rs", "x.ts"], {
        exts: [".rs", ".ts"],
    }));

test("fs::walkSync() accepts ext option as strings", () =>
    assertWalkSyncPaths("ext", ["y.rs", "x.ts"], {
        exts: [".rs", ".ts"],
    }));

test("fs::walk() accepts ext option as regExps", async () =>
    await assertWalkPaths("match", ["x1", "y1"], {
        match: [/x1/, /y1/],
    }));

test("fs::walkSync() accepts ext option as regExps", () =>
    assertWalkSyncPaths("match", ["x1", "y1"], {
        match: [/x1/, /y1/],
    }));

test("fs::walk() accepts skip option as regExps", async () =>
    await assertWalkPaths("match", [".", "z1"], {
        skip: [/x1/, /y1/],
    }));

test("fs::walkSync() accepts skip option as regExps", () =>
    assertWalkSyncPaths("match", [".", "z1"], {
        skip: [/x1/, /y1/],
    }));

// https://github.com/denoland/deno_std/issues/1358
test("fs::walk() accepts followSymlinks option set to true", async () =>
    await assertWalkPaths("symlink", [".", "a", "a/z", "a", "a/z", "x", "x"], {
        followSymlinks: true,
    }));

test("fs::walkSync() accepts followSymlinks option set to true", () =>
    assertWalkSyncPaths("symlink", [".", "a", "a/z", "a", "a/z", "x", "x"], {
        followSymlinks: true,
    }));

test("fs::walk() accepts followSymlinks option set to true with canonicalize option set to false", async () =>
    await assertWalkPaths("symlink", [".", "a", "a/z", "b", "b/z", "x", "y"], {
        followSymlinks: true,
        canonicalize: false,
    }));

test("fs::walkSync() accepts followSymlinks option set to true with canonicalize option set to false", () =>
    assertWalkSyncPaths("symlink", [".", "a", "a/z", "b", "b/z", "x", "y"], {
        followSymlinks: true,
        canonicalize: false,
    }));

test("fs::walk() accepts followSymlinks option set to false", async () => {
    await assertWalkPaths("symlink", [".", "a", "a/z", "b", "x", "y"], {
        followSymlinks: false,
    });
});

test("fs::walkSync() accepts followSymlinks option set to false", () => {
    assertWalkSyncPaths("symlink", [".", "a", "a/z", "b", "x", "y"], {
        followSymlinks: false,
    });
});

// https://github.com/denoland/deno_std/issues/1789
test("fs::walk() walks fifo files on unix", o, async () => {
    if (isBun && WIN) {
        equal(
            true,
            true,
            "Skipping test: Bun on Windows does not support nested tests using node:test, including the skip",
        );
        return;
    }

    await exec("mkfifo", [resolve(testdataDir, "fifo", "fifo")]);
    try {
        await assertWalkPaths("fifo", [".", "fifo", ".gitignore"], {
            followSymlinks: true,
        });
    } finally {
        await remove(resolve(testdataDir, "fifo", "fifo"));
    }
});

test("fs::walkSync() walks fifo files on unix", o, async () => {
    if (isBun && WIN) {
        equal(
            true,
            true,
            "Skipping test: Bun on Windows does not support nested tests using node:test, including the skip",
        );
        return;
    }

    await exec("mkfifo", [resolve(testdataDir, "fifo", "fifo")]);
    try {
        assertWalkSyncPaths("fifo", [".", "fifo", ".gitignore"], {
            followSymlinks: true,
        });
    } finally {
        await remove(resolve(testdataDir, "fifo", "fifo"));
    }
});

test("fs::walk() rejects with WalkError when root is removed during execution", async () => {
    const root = resolve(testdataDir, "error");
    await makeDir(root);
    try {
        await rejects(async () => {
            await Array.fromAsync(
                walk(root),
                async () => await remove(root, { recursive: true }),
            );
        }, WalkError);
    } catch (err) {
        await remove(root, { recursive: true });
        throw err;
    }
});

if (globals.Deno) {
    test("fs::walkSync() throws Deno.errors.NotFound for non-existent root", () => {
        const root = resolve(testdataDir, "non_existent");
        throws(() => Array.from(walkSync(root)), globals.Deno.errors.NotFound);
    });

    test("fs::walk() rejects Deno.errors.NotFound for non-existent root", async () => {
        const root = resolve(testdataDir, "non_existent");
        await rejects(
            async () => await Array.fromAsync(walk(root)),
            globals.Deno.errors.NotFound,
        );
    });

    globals.Deno.test({
        name: "fs::walk() walks unix socket",
        ignore: WIN,
        async fn() {
            const path = resolve(testdataDir, "socket", "a.sock");
            try {
                using _listener = globals.Deno.listen({ path, transport: "unix" });
                await assertWalkPaths("socket", [".", "a.sock", ".gitignore"], {
                    followSymlinks: true,
                });
            } finally {
                await remove(path);
            }
        },
    });

    // https://github.com/denoland/deno_std/issues/1789
    globals.Deno.test({
        name: "fs::walkSync() walks unix socket",
        ignore: WIN,
        async fn() {
            const path = resolve(testdataDir, "socket", "a.sock");
            try {
                using _listener = globals.Deno.listen({ path, transport: "unix" });
                assertWalkSyncPaths("socket", [".", "a.sock", ".gitignore"], {
                    followSymlinks: true,
                });
            } finally {
                await remove(path);
            }
        },
    });
}
