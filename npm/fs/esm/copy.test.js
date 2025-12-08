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
import { equal, ok, rejects, throws } from "@frostyeti/assert";
import * as path from "@frostyeti/path";
import { copy, copySync } from "./copy.js";
import { existsSync } from "./exists.js";
import { ensureDir, ensureDirSync } from "./ensure_dir.js";
import { ensureFile, ensureFileSync } from "./ensure_file.js";
import { ensureSymlink, ensureSymlinkSync } from "./ensure_symlink.js";
import { lstat, lstatSync } from "./lstat.js";
import { stat, statSync } from "./stat.js";
import { writeTextFile } from "./write_text_file.js";
import { readTextFile } from "./read_text_file.js";
import { readFileSync } from "./read_file.js";
import { writeFileSync } from "./write_file.js";
import { DisposableTempDir } from "./_testutils.js";
const moduleDir = path.dirname(path.fromFileUrl(import.meta.url));
const testdataDir = path.resolve(moduleDir, "testdata");
test("fs::copy() rejects if src does not exist", async () => {
  const env_1 = { stack: [], error: void 0, hasError: false };
  try {
    const tempDir = __addDisposableResource(
      env_1,
      new DisposableTempDir(),
      false,
    );
    const srcFile = path.join(testdataDir, "copy_file_not_exists.txt");
    const destFile = path.join(tempDir.path, "copy_file_not_exists_1.txt");
    await rejects(async () => {
      await copy(srcFile, destFile);
    });
  } catch (e_1) {
    env_1.error = e_1;
    env_1.hasError = true;
  } finally {
    __disposeResources(env_1);
  }
});
test("fs::copy() rejects if src and dest are the same paths", async () => {
  const env_2 = { stack: [], error: void 0, hasError: false };
  try {
    const tempDir = __addDisposableResource(
      env_2,
      new DisposableTempDir(),
      false,
    );
    const srcFile = path.join(tempDir.path, "copy_file_same.txt");
    const destFile = path.join(tempDir.path, "copy_file_same.txt");
    await rejects(
      async () => {
        await copy(srcFile, destFile);
      },
      Error,
      "Source and destination cannot be the same.",
    );
  } catch (e_2) {
    env_2.error = e_2;
    env_2.hasError = true;
  } finally {
    __disposeResources(env_2);
  }
});
test("fs::copy() copies file to new destination", async () => {
  const env_3 = { stack: [], error: void 0, hasError: false };
  try {
    const tempDir = __addDisposableResource(
      env_3,
      new DisposableTempDir(),
      false,
    );
    const srcFile = path.join(testdataDir, "copy_file.txt");
    const destFile = path.join(tempDir.path, "copy_file_copy.txt");
    const srcContent = await readTextFile(srcFile);
    ok(await lstat(srcFile), "source should exist before copy");
    await rejects(
      async () => await lstat(destFile),
      "destination should not exist before copy",
    );
    await copy(srcFile, destFile);
    ok(await lstat(srcFile), "source should exist after copy");
    ok(await lstat(destFile), "destination should exist after copy");
    const destContent = await readTextFile(destFile);
    equal(
      srcContent,
      destContent,
      "source and destination should have the same content",
    );
    // Copy again and it should throw an error.
    await rejects(
      async () => {
        await copy(srcFile, destFile);
      },
      Error,
      `'${destFile}' already exists.`,
    );
    // Modify destination file.
    await writeTextFile(destFile, "txt copy");
    equal(await readTextFile(destFile), "txt copy");
    // Copy again with overwrite option.
    await copy(srcFile, destFile, { overwrite: true });
    // Make sure the file has been overwritten.
    equal(await readTextFile(destFile), "txt");
  } catch (e_3) {
    env_3.error = e_3;
    env_3.hasError = true;
  } finally {
    __disposeResources(env_3);
  }
});
test("fs::copy() copies with preserve timestamps", async () => {
  const env_4 = { stack: [], error: void 0, hasError: false };
  try {
    const tempDir = __addDisposableResource(
      env_4,
      new DisposableTempDir(),
      false,
    );
    const srcFile = path.join(testdataDir, "copy_file.txt");
    const destFile = path.join(tempDir.path, "copy_file_copy.txt");
    const srcStatInfo = await stat(srcFile);
    ok(srcStatInfo.atime instanceof Date);
    ok(srcStatInfo.mtime instanceof Date);
    // Copy with overwrite and preserve timestamps options.
    await copy(srcFile, destFile, {
      overwrite: true,
      preserveTimestamps: true,
    });
    const destStatInfo = await stat(destFile);
    ok(destStatInfo.atime instanceof Date);
    ok(destStatInfo.mtime instanceof Date);
    equal(destStatInfo.atime, srcStatInfo.atime);
    equal(destStatInfo.mtime, srcStatInfo.mtime);
  } catch (e_4) {
    env_4.error = e_4;
    env_4.hasError = true;
  } finally {
    __disposeResources(env_4);
  }
});
test("fs::copy() rejects if destination is its own subdirectory", async () => {
  const env_5 = { stack: [], error: void 0, hasError: false };
  try {
    const tempDir = __addDisposableResource(
      env_5,
      new DisposableTempDir(),
      false,
    );
    const srcDir = path.join(tempDir.path, "parent");
    const destDir = path.join(srcDir, "child");
    await ensureDir(srcDir);
    await rejects(
      async () => {
        await copy(srcDir, destDir);
      },
      Error,
      `Cannot copy '${srcDir}' to a subdirectory of itself, '${destDir}'.`,
    );
  } catch (e_5) {
    env_5.error = e_5;
    env_5.hasError = true;
  } finally {
    __disposeResources(env_5);
  }
});
test("fs::copy() rejects when copying a directory to an existent destination that is not a directory", async () => {
  const env_6 = { stack: [], error: void 0, hasError: false };
  try {
    const tempDir = __addDisposableResource(
      env_6,
      new DisposableTempDir(),
      false,
    );
    const srcDir = path.join(tempDir.path, "parent");
    const destDir = path.join(tempDir.path, "child.txt");
    await ensureDir(srcDir);
    await ensureFile(destDir);
    await rejects(
      async () => {
        await copy(srcDir, destDir);
      },
      Error,
      `Cannot overwrite non-directory '${destDir}' with directory '${srcDir}'.`,
    );
  } catch (e_6) {
    env_6.error = e_6;
    env_6.hasError = true;
  } finally {
    __disposeResources(env_6);
  }
});
test("fs::copy() copies a directory", async () => {
  const env_7 = { stack: [], error: void 0, hasError: false };
  try {
    const tempDir = __addDisposableResource(
      env_7,
      new DisposableTempDir(),
      false,
    );
    const srcDir = path.join(testdataDir, "copy_dir");
    const destDir = path.join(tempDir.path, "copy_dir");
    const srcFile = path.join(srcDir, "0.txt");
    const destFile = path.join(destDir, "0.txt");
    const srcNestFile = path.join(srcDir, "nest", "0.txt");
    const destNestFile = path.join(destDir, "nest", "0.txt");
    await copy(srcDir, destDir);
    ok(await lstat(destFile));
    ok(await lstat(destNestFile));
    // After copy. The source and destination should have the same content.
    equal(await readTextFile(srcFile), await readTextFile(destFile));
    equal(await readTextFile(srcNestFile), await readTextFile(destNestFile));
    // Copy again without overwrite option and it should throw an error.
    await rejects(
      async () => {
        await copy(srcDir, destDir);
      },
      Error,
      `'${destDir}' already exists.`,
    );
    // Modify the file in the destination directory.
    await writeTextFile(destNestFile, "nest copy");
    equal(await readTextFile(destNestFile), "nest copy");
    // Copy again with overwrite option.
    await copy(srcDir, destDir, { overwrite: true });
    // Make sure the file has been overwritten.
    equal(await readTextFile(destNestFile), "nest");
  } catch (e_7) {
    env_7.error = e_7;
    env_7.hasError = true;
  } finally {
    __disposeResources(env_7);
  }
});
test("fs::copy() copies a symlink file", async () => {
  const env_8 = { stack: [], error: void 0, hasError: false };
  try {
    const tempDir = __addDisposableResource(
      env_8,
      new DisposableTempDir(),
      false,
    );
    const dir = path.join(testdataDir, "copy_dir_link_file");
    const srcLink = path.join(dir, "0.txt");
    const destLink = path.join(tempDir.path, "0_copy.txt");
    ok((await lstat(srcLink)).isSymlink, `'${srcLink}' should be symlink type`);
    await copy(srcLink, destLink);
    const statInfo = await lstat(destLink);
    ok(statInfo.isSymlink, `'${destLink}' should be symlink type`);
  } catch (e_8) {
    env_8.error = e_8;
    env_8.hasError = true;
  } finally {
    __disposeResources(env_8);
  }
});
test("fs::copy() copies a symlink directory", async () => {
  const env_9 = { stack: [], error: void 0, hasError: false };
  try {
    const tempDir = __addDisposableResource(
      env_9,
      new DisposableTempDir(),
      false,
    );
    const srcDir = path.join(testdataDir, "copy_dir");
    const srcLink = path.join(tempDir.path, "copy_dir_link");
    const destLink = path.join(tempDir.path, "copy_dir_link_copy");
    await ensureSymlink(srcDir, srcLink);
    ok((await lstat(srcLink)).isSymlink, `'${srcLink}' should be symlink type`);
    await copy(srcLink, destLink);
    const statInfo = await lstat(destLink);
    ok(statInfo.isSymlink);
  } catch (e_9) {
    env_9.error = e_9;
    env_9.hasError = true;
  } finally {
    __disposeResources(env_9);
  }
});
test("fs::copySync() throws if src does not exist", () => {
  const env_10 = { stack: [], error: void 0, hasError: false };
  try {
    const tempDir = __addDisposableResource(
      env_10,
      new DisposableTempDir(),
      false,
    );
    const srcFile = path.join(testdataDir, "copy_file_not_exists_sync.txt");
    const destFile = path.join(tempDir.path, "copy_file_not_exists_1_sync.txt");
    throws(() => {
      copySync(srcFile, destFile);
    });
  } catch (e_10) {
    env_10.error = e_10;
    env_10.hasError = true;
  } finally {
    __disposeResources(env_10);
  }
});
test("fs::copySync() copies with preserve timestamps", () => {
  const env_11 = { stack: [], error: void 0, hasError: false };
  try {
    const tempDir = __addDisposableResource(
      env_11,
      new DisposableTempDir(),
      false,
    );
    const srcFile = path.join(testdataDir, "copy_file.txt");
    const destFile = path.join(tempDir.path, "copy_file_copy.txt");
    const srcStatInfo = statSync(srcFile);
    ok(srcStatInfo.atime instanceof Date);
    ok(srcStatInfo.mtime instanceof Date);
    // Copy with overwrite and preserve timestamps options.
    copySync(srcFile, destFile, {
      overwrite: true,
      preserveTimestamps: true,
    });
    const destStatInfo = statSync(destFile);
    ok(destStatInfo.atime instanceof Date);
    ok(destStatInfo.mtime instanceof Date);
    equal(destStatInfo.atime, srcStatInfo.atime);
    equal(destStatInfo.mtime, srcStatInfo.mtime);
  } catch (e_11) {
    env_11.error = e_11;
    env_11.hasError = true;
  } finally {
    __disposeResources(env_11);
  }
});
test("fs::copySync() throws if src and dest are the same paths", () => {
  const srcFile = path.join(testdataDir, "copy_file_same_sync.txt");
  throws(
    () => {
      copySync(srcFile, srcFile);
    },
    Error,
    "Source and destination cannot be the same.",
  );
});
test("fs::copySync() copies file to new destination", () => {
  const env_12 = { stack: [], error: void 0, hasError: false };
  try {
    const tempDir = __addDisposableResource(
      env_12,
      new DisposableTempDir(),
      false,
    );
    const srcFile = path.join(testdataDir, "copy_file.txt");
    const destFile = path.join(tempDir.path, "copy_file_copy_sync.txt");
    const srcContent = new TextDecoder().decode(readFileSync(srcFile));
    equal(existsSync(srcFile), true);
    equal(existsSync(destFile), false);
    copySync(srcFile, destFile);
    equal(existsSync(srcFile), true);
    equal(existsSync(destFile), true);
    const destContent = new TextDecoder().decode(readFileSync(destFile));
    equal(srcContent, destContent);
    // Copy again without overwrite option and it should throw an error.
    throws(
      () => {
        copySync(srcFile, destFile);
      },
      Error,
      `'${destFile}' already exists.`,
    );
    // Modify destination file.
    writeFileSync(destFile, new TextEncoder().encode("txt copy"));
    equal(new TextDecoder().decode(readFileSync(destFile)), "txt copy");
    // Copy again with overwrite option.
    copySync(srcFile, destFile, { overwrite: true });
    // Make sure the file has been overwritten.
    equal(new TextDecoder().decode(readFileSync(destFile)), "txt");
  } catch (e_12) {
    env_12.error = e_12;
    env_12.hasError = true;
  } finally {
    __disposeResources(env_12);
  }
});
test("fs::copySync() throws if destination is its own subdirectory", () => {
  const env_13 = { stack: [], error: void 0, hasError: false };
  try {
    const tempDir = __addDisposableResource(
      env_13,
      new DisposableTempDir(),
      false,
    );
    const srcDir = path.join(tempDir.path, "parent");
    const destDir = path.join(srcDir, "child");
    ensureDirSync(srcDir);
    throws(
      () => {
        copySync(srcDir, destDir);
      },
      Error,
      `Cannot copy '${srcDir}' to a subdirectory of itself, '${destDir}'.`,
    );
  } catch (e_13) {
    env_13.error = e_13;
    env_13.hasError = true;
  } finally {
    __disposeResources(env_13);
  }
});
test("fs::copySync() throws when copying a directory to an existent destination that is not a directory", () => {
  const env_14 = { stack: [], error: void 0, hasError: false };
  try {
    const tempDir = __addDisposableResource(
      env_14,
      new DisposableTempDir(),
      false,
    );
    const srcDir = path.join(tempDir.path, "parent_sync");
    const destDir = path.join(tempDir.path, "child.txt");
    ensureDirSync(srcDir);
    ensureFileSync(destDir);
    throws(
      () => {
        copySync(srcDir, destDir);
      },
      Error,
      `Cannot overwrite non-directory '${destDir}' with directory '${srcDir}'.`,
    );
  } catch (e_14) {
    env_14.error = e_14;
    env_14.hasError = true;
  } finally {
    __disposeResources(env_14);
  }
});
test("fs::copySync() copies a directory", () => {
  const env_15 = { stack: [], error: void 0, hasError: false };
  try {
    const tempDir = __addDisposableResource(
      env_15,
      new DisposableTempDir(),
      false,
    );
    const srcDir = path.join(testdataDir, "copy_dir");
    const destDir = path.join(tempDir.path, "copy_dir_copy_sync");
    const srcFile = path.join(srcDir, "0.txt");
    const destFile = path.join(destDir, "0.txt");
    const srcNestFile = path.join(srcDir, "nest", "0.txt");
    const destNestFile = path.join(destDir, "nest", "0.txt");
    copySync(srcDir, destDir);
    equal(existsSync(destFile), true);
    equal(existsSync(destNestFile), true);
    // After copy. The source and destination should have the same content.
    equal(
      new TextDecoder().decode(readFileSync(srcFile)),
      new TextDecoder().decode(readFileSync(destFile)),
    );
    equal(
      new TextDecoder().decode(readFileSync(srcNestFile)),
      new TextDecoder().decode(readFileSync(destNestFile)),
    );
    // Copy again without overwrite option and it should throw an error.
    throws(
      () => {
        copySync(srcDir, destDir);
      },
      Error,
      `'${destDir}' already exists.`,
    );
    // Modify the file in the destination directory.
    writeFileSync(destNestFile, new TextEncoder().encode("nest copy"));
    equal(new TextDecoder().decode(readFileSync(destNestFile)), "nest copy");
    // Copy again with overwrite option.
    copySync(srcDir, destDir, { overwrite: true });
    // Make sure the file has been overwritten.
    equal(new TextDecoder().decode(readFileSync(destNestFile)), "nest");
  } catch (e_15) {
    env_15.error = e_15;
    env_15.hasError = true;
  } finally {
    __disposeResources(env_15);
  }
});
test("fs::copySync() copies symlink file", () => {
  const env_16 = { stack: [], error: void 0, hasError: false };
  try {
    const tempDir = __addDisposableResource(
      env_16,
      new DisposableTempDir(),
      false,
    );
    const dir = path.join(testdataDir, "copy_dir_link_file");
    const srcLink = path.join(dir, "0.txt");
    const destLink = path.join(tempDir.path, "0_copy.txt");
    ok(lstatSync(srcLink).isSymlink, `'${srcLink}' should be symlink type`);
    copySync(srcLink, destLink);
    const statInfo = lstatSync(destLink);
    ok(statInfo.isSymlink, `'${destLink}' should be symlink type`);
  } catch (e_16) {
    env_16.error = e_16;
    env_16.hasError = true;
  } finally {
    __disposeResources(env_16);
  }
});
test("fs::copySync() copies symlink directory", () => {
  const env_17 = { stack: [], error: void 0, hasError: false };
  try {
    const tempDir = __addDisposableResource(
      env_17,
      new DisposableTempDir(),
      false,
    );
    const originDir = path.join(testdataDir, "copy_dir");
    const srcLink = path.join(tempDir.path, "copy_dir_link");
    const destLink = path.join(tempDir.path, "copy_dir_link_copy");
    ensureSymlinkSync(originDir, srcLink);
    ok(lstatSync(srcLink).isSymlink, `'${srcLink}' should be symlink type`);
    copySync(srcLink, destLink);
    const statInfo = lstatSync(destLink);
    ok(statInfo.isSymlink);
  } catch (e_17) {
    env_17.error = e_17;
    env_17.hasError = true;
  } finally {
    __disposeResources(env_17);
  }
});
