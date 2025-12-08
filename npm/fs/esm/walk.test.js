var __addDisposableResource = (this && this.__addDisposableResource) ||
  function (env, value, async) {
    if (value !== null && value !== void 0) {
      if (typeof value !== "object" && typeof value !== "function") {
        throw new TypeError("Object expected.");
      }
      var dispose, inner;
      if (async) {
        if (!Symbol.asyncDispose) {
          throw new TypeError("Symbol.asyncDispose is not defined.");
        }
        dispose = value[Symbol.asyncDispose];
      }
      if (dispose === void 0) {
        if (!Symbol.dispose) {
          throw new TypeError("Symbol.dispose is not defined.");
        }
        dispose = value[Symbol.dispose];
        if (async) inner = dispose;
      }
      if (typeof dispose !== "function") {
        throw new TypeError("Object not disposable.");
      }
      if (inner) {
        dispose = function () {
          try {
            inner.call(this);
          } catch (e) {
            return Promise.reject(e);
          }
        };
      }
      env.stack.push({ value: value, dispose: dispose, async: async });
    } else if (async) {
      env.stack.push({ async: true });
    }
    return value;
  };
var __disposeResources = (this && this.__disposeResources) ||
  (function (SuppressedError) {
    return function (env) {
      function fail(e) {
        env.error = env.hasError
          ? new SuppressedError(
            e,
            env.error,
            "An error was suppressed during disposal.",
          )
          : e;
        env.hasError = true;
      }
      var r, s = 0;
      function next() {
        while (r = env.stack.pop()) {
          try {
            if (!r.async && s === 1) {
              return s = 0, env.stack.push(r), Promise.resolve().then(next);
            }
            if (r.dispose) {
              var result = r.dispose.call(r.value);
              if (r.async) {
                return s |= 2,
                  Promise.resolve(result).then(next, function (e) {
                    fail(e);
                    return next();
                  });
              }
            } else s |= 1;
          } catch (e) {
            fail(e);
          }
        }
        if (s === 1) {
          return env.hasError ? Promise.reject(env.error) : Promise.resolve();
        }
        if (env.hasError) throw env.error;
      }
      return next();
    };
  })(
    typeof SuppressedError === "function"
      ? SuppressedError
      : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError",
          e.error = error,
          e.suppressed = suppressed,
          e;
      },
  );
// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
import { test } from "node:test";
import { walk, WalkError, walkSync } from "./walk.js";
import { arrayIncludes, equal, rejects, throws } from "@frostyeti/assert";
import { fromFileUrl, resolve } from "@frostyeti/path";
import { makeDir } from "./make_dir.js";
import { remove } from "./remove.js";
import { exists as existsAsync } from "./exists.js";
import { globals, WIN } from "./globals.js";
import { exec } from "./_testutils.js";
const g = globalThis;
const isBun = g.Bun !== undefined;
const o = {};
if (!isBun && WIN) {
  o.skip = true;
}
const testdataDir = resolve(fromFileUrl(import.meta.url), "../testdata/walk");
async function assertWalkPaths(rootPath, expectedPaths, options) {
  const root = resolve(testdataDir, rootPath);
  const entries = await Array.fromAsync(walk(root, options));
  const expected = expectedPaths.map((path) => resolve(root, path));
  equal(entries.length, expected.length);
  arrayIncludes(entries.map(({ path }) => path), expected);
}
function assertWalkSyncPaths(rootPath, expectedPaths, options) {
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
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
          const _listener = __addDisposableResource(
            env_1,
            globals.Deno.listen({ path, transport: "unix" }),
            false,
          );
          await assertWalkPaths("socket", [".", "a.sock", ".gitignore"], {
            followSymlinks: true,
          });
        } catch (e_1) {
          env_1.error = e_1;
          env_1.hasError = true;
        } finally {
          __disposeResources(env_1);
        }
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
        const env_2 = { stack: [], error: void 0, hasError: false };
        try {
          const _listener = __addDisposableResource(
            env_2,
            globals.Deno.listen({ path, transport: "unix" }),
            false,
          );
          assertWalkSyncPaths("socket", [".", "a.sock", ".gitignore"], {
            followSymlinks: true,
          });
        } catch (e_2) {
          env_2.error = e_2;
          env_2.hasError = true;
        } finally {
          __disposeResources(env_2);
        }
      } finally {
        await remove(path);
      }
    },
  });
}
