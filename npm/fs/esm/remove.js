import { globals, loadFs, loadFsAsync } from "./globals.js";
let fn = undefined;
let fnAsync = undefined;
let rmDir = undefined;
let rmDirAsync = undefined;
/**
 * Removes a file or directory.
 * @param path The path to the file or directory.
 * @param options The options for removing the file or directory (optional).
 * @returns A promise that resolves when the operation is complete.
 */
export function remove(path, options) {
  if (globals.Deno) {
    return globals.Deno.remove(path, options);
  }
  if (!fnAsync) {
    fnAsync = loadFsAsync()?.rm;
    if (!fnAsync) {
      return Promise.reject(new Error("No suitable file system module found."));
    }
  }
  return fnAsync(path, { ...options }).catch((err) => {
    const code = err.code;
    if (code === "ERR_FS_EISDIR") {
      if (!rmDirAsync) {
        rmDirAsync = loadFsAsync()?.rmdir;
        if (!rmDirAsync) {
          return Promise.reject(
            new Error("No suitable file system module found."),
          );
        }
      }
      return rmDirAsync(path);
    } else if (globals.Bun && (code === "EFAULT" || code === "EACCES")) {
      // Bun specific error handling
      if (!rmDirAsync) {
        rmDirAsync = loadFsAsync()?.rmdir;
        if (!rmDirAsync) {
          return Promise.reject(
            new Error("No suitable file system module found."),
          );
        }
      }
      return rmDirAsync(path);
    } else {
      return Promise.reject(err);
    }
  });
}
/**
 * Synchronously removes a file or directory.
 * @param path The path to the file or directory.
 * @param options The options for removing the file or directory (optional).
 */
export function removeSync(path, options) {
  if (globals.Deno) {
    return globals.Deno.removeSync(path, options);
  }
  if (!fn) {
    fn = loadFs()?.rmSync;
    if (!fn) {
      throw new Error("No suitable file system module found.");
    }
  }
  try {
    fn(path, { ...options });
  } catch (err) {
    const code = err.code;
    if (code === "ERR_FS_EISDIR") {
      if (!rmDir) {
        rmDir = loadFs()?.rmdirSync;
        if (!rmDir) {
          throw new Error("No suitable file system module found.");
        }
      }
    } else if (globals.Bun && (code === "EFAULT" || code === "EACCES")) {
      // Bun specific error handling
      if (!rmDir) {
        rmDir = loadFs()?.rmdirSync;
        if (!rmDir) {
          throw new Error("No suitable file system module found.");
        }
      }
      rmDir(path, { ...options });
    } else {
      throw err;
    }
  }
}
