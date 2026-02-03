// Copyright 2018-2026 the Deno authors. MIT license.
import { test } from "node:test";
import { walk, type WalkOptions, walkSync } from "./walk.ts";
import { arrayIncludes, equal, rejects, throws } from "@frostyeti/assert";
import { copy, copySync } from "./copy.ts";
import { fromFileUrl, resolve } from "@frostyeti/path";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { platform, tmpdir } from "node:os";
import { NotFound } from "./unstable_errors.ts";
import { globals } from "./globals.ts";
import { isDeno } from "./_utils.ts";

const testdataDir = resolve(fromFileUrl(import.meta.url), "../testdata/walk");

async function assertWalkPaths(
  parentDir: string,
  rootPath: string,
  expectedPaths: string[],
  options?: WalkOptions,
) {
  const root = resolve(parentDir, rootPath);
  const entries = await Array.fromAsync(walk(root, options));

  const expected = expectedPaths.map((path) => resolve(root, path));
  equal(entries.length, expected.length);
  arrayIncludes(entries.map(({ path }) => path), expected);
}

function assertWalkSyncPaths(
  parentDir: string,
  rootPath: string,
  expectedPaths: string[],
  options?: WalkOptions,
) {
  const root = resolve(parentDir, rootPath);
  const entriesSync = Array.from(walkSync(root, options));

  const expected = expectedPaths.map((path) => resolve(root, path));
  equal(entriesSync.length, expected.length);
  arrayIncludes(entriesSync.map(({ path }) => path), expected);
}

test("walk() returns current dir for empty dir", async () => {
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "deno_std_walk_"));
  const emptyDir = resolve(tempDirPath, "empty_dir");
  await mkdir(emptyDir);
  await assertWalkPaths(tempDirPath, "empty_dir", ["."]);
  await rm(tempDirPath, { recursive: true });
});

test("walkSync() returns current dir for empty dir", () => {
  const tempDirPath = mkdtempSync(resolve(tmpdir(), "deno_std_walk_sync_"));
  const emptyDir = resolve(tempDirPath, "empty_dir");
  mkdirSync(emptyDir);
  assertWalkSyncPaths(tempDirPath, "empty_dir", ["."]);
  rmSync(tempDirPath, { recursive: true });
});

test("walk() returns current dir and single file", async () =>
  await assertWalkPaths(testdataDir, "single_file", [".", "x"]));

test("walkSync() returns current dir and single file", () =>
  assertWalkSyncPaths(testdataDir, "single_file", [".", "x"]));

test("walk() returns current dir, subdir, and nested file", async () =>
  await assertWalkPaths(testdataDir, "nested_single_file", [".", "a", "a/x"]));

test("walkSync() returns current dir, subdir, and nested file", () =>
  assertWalkSyncPaths(testdataDir, "nested_single_file", [".", "a", "a/x"]));

test("walk() accepts maxDepth option", async () =>
  await assertWalkPaths(testdataDir, "depth", [".", "a", "a/b", "a/b/c"], {
    maxDepth: 3,
  }));

test("walkSync() accepts maxDepth option", () =>
  assertWalkSyncPaths(testdataDir, "depth", [".", "a", "a/b", "a/b/c"], {
    maxDepth: 3,
  }));

test("walk() accepts includeDirs option set to false", async () =>
  await assertWalkPaths(testdataDir, "depth", ["a/b/c/d/x"], {
    includeDirs: false,
  }));

test("walkSync() accepts includeDirs option set to false", () =>
  assertWalkSyncPaths(testdataDir, "depth", ["a/b/c/d/x"], {
    includeDirs: false,
  }));

test("walk() accepts includeFiles option set to false", async () =>
  await assertWalkPaths(testdataDir, "depth", [
    ".",
    "a",
    "a/b",
    "a/b/c",
    "a/b/c/d",
  ], {
    includeFiles: false,
  }));

test("walkSync() accepts includeFiles option set to false", () =>
  assertWalkSyncPaths(testdataDir, "depth", [
    ".",
    "a",
    "a/b",
    "a/b/c",
    "a/b/c/d",
  ], {
    includeFiles: false,
  }));

test("walk() accepts ext option as strings", async () =>
  await assertWalkPaths(testdataDir, "ext", ["y.rs", "x.ts"], {
    exts: [".rs", ".ts"],
  }));

test("walk() accepts ext option as strings (excluding period prefix)", async () =>
  await assertWalkPaths(testdataDir, "ext", ["y.rs", "x.ts"], {
    exts: ["rs", "ts"],
  }));

test("walkSync() accepts ext option as strings", () =>
  assertWalkSyncPaths(testdataDir, "ext", ["y.rs", "x.ts"], {
    exts: [".rs", ".ts"],
  }));

test("walkSync() accepts ext option as strings (excluding period prefix)", () =>
  assertWalkSyncPaths(testdataDir, "ext", ["y.rs", "x.ts"], {
    exts: [".rs", ".ts"],
  }));

test("walk() accepts ext option as regExps", async () =>
  await assertWalkPaths(testdataDir, "match", ["x", "y"], {
    match: [/x/, /y/],
  }));

test("walkSync() accepts ext option as regExps", () =>
  assertWalkSyncPaths(testdataDir, "match", ["x", "y"], {
    match: [/x/, /y/],
  }));

test("walk() accepts skip option as regExps", async () =>
  await assertWalkPaths(testdataDir, "match", [".", "z"], {
    skip: [/x/, /y/],
  }));

test("walkSync() accepts skip option as regExps", () =>
  assertWalkSyncPaths(testdataDir, "match", [".", "z"], {
    skip: [/x/, /y/],
  }));

// https://github.com/denoland/std/issues/1358
test("walk() accepts followSymlinks option set to true", async () =>
  await assertWalkPaths(testdataDir, "symlink", [
    ".",
    "a",
    "a/z",
    "a",
    "a/z",
    "x",
    "x",
  ], {
    followSymlinks: true,
  }));

test("walkSync() accepts followSymlinks option set to true", () =>
  assertWalkSyncPaths(testdataDir, "symlink", [
    ".",
    "a",
    "a/z",
    "a",
    "a/z",
    "x",
    "x",
  ], {
    followSymlinks: true,
  }));

test("walk() accepts followSymlinks option set to true with canonicalize option set to false", async () =>
  await assertWalkPaths(testdataDir, "symlink", [
    ".",
    "a",
    "a/z",
    "b",
    "b/z",
    "x",
    "y",
  ], {
    followSymlinks: true,
    canonicalize: false,
  }));

test("walkSync() accepts followSymlinks option set to true with canonicalize option set to false", () =>
  assertWalkSyncPaths(testdataDir, "symlink", [
    ".",
    "a",
    "a/z",
    "b",
    "b/z",
    "x",
    "y",
  ], {
    followSymlinks: true,
    canonicalize: false,
  }));

test("walk() accepts followSymlinks option set to false", async () => {
  await assertWalkPaths(testdataDir, "symlink", [
    ".",
    "a",
    "a/z",
    "b",
    "x",
    "y",
  ], {
    followSymlinks: false,
  });
});

test("walkSync() accepts followSymlinks option set to false", () => {
  assertWalkSyncPaths(
    testdataDir,
    "symlink",
    [".", "a", "a/z", "b", "x", "y"],
    {
      followSymlinks: false,
    },
  );
});

test("walk() rejects NotFound for non-existent root", async () => {
  const root = resolve(testdataDir, "non_existent");
  await rejects(
    async () => await Array.fromAsync(walk(root)),
    NotFound,
  );
});

test("walkSync() throws NotFound for non-existent root", () => {
  const root = resolve(testdataDir, "non_existent");
  throws(() => Array.from(walkSync(root)), NotFound);
});

// https://github.com/denoland/std/issues/1789
test("walk() walks unix socket",
  { skip: platform() === "win32" || !isDeno },
  async () => {
    if (!isDeno) 
        return;

    const tempDirPath = await mkdtemp(resolve(tmpdir(), "deno_std_walk_"));
    // Copy contents from "walk/socket" into temporary directory.
    await copy(resolve(testdataDir, "socket"), resolve(tempDirPath, "socket"));
    const path = resolve(tempDirPath, "socket", "a.sock");
    try {
      using _listener = globals.Deno.listen({ path, transport: "unix" });
      await assertWalkPaths(tempDirPath, "socket", [
        ".",
        "a.sock",
        ".gitignore",
      ], {
        followSymlinks: true,
      });
    } finally {
      await rm(tempDirPath, { recursive: true });
    }
  });

// https://github.com/denoland/std/issues/1789
test("walkSync() walks unix socket",
  { skip: platform() === "win32" || !isDeno },
  () => {
    if (!isDeno) 
        return;
    const tempDirPath = mkdtempSync(resolve(tmpdir(), "deno_std_walk_sync_"));
    // Copy contents from "walk/socket" into temporary directory.
    copySync(resolve(testdataDir, "socket"), resolve(tempDirPath, "socket"));
    const path = resolve(tempDirPath, "socket", "a.sock");
    try {
      using _listener = globals.Deno.listen({ path, transport: "unix" });
      assertWalkSyncPaths(
        tempDirPath,
        "socket",
        [".", "a.sock", ".gitignore"],
        {
          followSymlinks: true,
        },
      );
    } finally {
      rmSync(tempDirPath, { recursive: true });
    }
  });

test("walk() walks fifo files on unix",
  { skip: platform() === "win32" || !isDeno },
  async () => {
    if (!isDeno) 
        return;

    const tempDirPath = await mkdtemp(resolve(tmpdir(), "deno_std_walk_"));
    // Copy contents from "walk/fifo" into temporary directory.
    await copy(resolve(testdataDir, "fifo"), resolve(tempDirPath, "fifo"));
    const command = new globals.Deno.Command("mkfifo", {
      args: [resolve(tempDirPath, "fifo", "fifo")],
    });
    await command.output();
    await assertWalkPaths(tempDirPath, "fifo", [".", "fifo", ".gitignore"], {
      followSymlinks: true,
    });
    await rm(tempDirPath, { recursive: true });
  });

test("walkSync() walks fifo files on unix",
  { skip: platform() === "win32" || !isDeno },
  () => {
    if (!isDeno)
        return;

    const tempDirPath = mkdtempSync(resolve(tmpdir(), "deno_std_walk_sync_"));
    // Copy contents from "walk/fifo" into temporary directory.
    copySync(resolve(testdataDir, "fifo"), resolve(tempDirPath, "fifo"));
    const command = new globals.Deno.Command("mkfifo", {
      args: [resolve(tempDirPath, "fifo", "fifo")],
    });
    command.outputSync();
    assertWalkSyncPaths(tempDirPath, "fifo", [".", "fifo", ".gitignore"], {
      followSymlinks: true,
    });
    rmSync(tempDirPath, { recursive: true });
  });

test("walk() rejects with NotFound when root is removed during execution", async () => {
  const tempDirPath = await mkdtemp(resolve(tmpdir(), "deno_std_walk_"));
  const root = resolve(tempDirPath, "error");
  await mkdir(root);
  try {
    await rejects(
      async () => {
        await Array.fromAsync(
          walk(root),
          async () => await rm(root, { recursive: true }),
        );
      },
      NotFound,
    );
  } catch (err) {
    await rm(root, { recursive: true, force: true });
    throw err;
  } finally {
    await rm(tempDirPath, { recursive: true, force: true });
  }
});