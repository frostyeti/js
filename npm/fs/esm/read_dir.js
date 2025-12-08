import { join } from "@frostyeti/path";
import { globals, loadFs, loadFsAsync } from "./globals.js";
import { lstatSync } from "./lstat.js";
let fn = undefined;
let fnAsync = undefined;
let lstat = undefined;
let lstatAsync = undefined;
/**
 * Reads the contents of a directory.
 * @param path The path to the directory.
 * @returns An async iterable that yields directory information.
 */
export function readDir(path, options = {
  /**
   * Whether to log debug information.
   * @default false
   */
  debug: false,
}) {
  if (globals.Deno) {
    return globals.Deno.readDir(path);
  }
  if (!fnAsync) {
    fnAsync = loadFsAsync()?.readdir;
    if (!fnAsync) {
      throw new Error("No suitable file system module found.");
    }
  }
  if (!lstatAsync) {
    lstatAsync = loadFsAsync()?.lstat;
    if (!lstatAsync) {
      throw new Error("No suitable file system module found.");
    }
  }
  if (path instanceof URL) {
    path = path.toString();
  }
  const iterator = async function* () {
    const data = await fnAsync(path);
    for (const d of data) {
      const next = join(path, d);
      try {
        const info = await lstatAsync(join(path, d));
        yield {
          name: d,
          isFile: info.isFile(),
          isDirectory: info.isDirectory(),
          isSymlink: info.isSymbolicLink(),
        };
      } catch (e) {
        if (options.debug && e instanceof Error) {
          const message = e.stack ?? e.message;
          const e2 = e;
          if (e2.code) {
            console.debug(`Failed to lstat ${next}\n${e2.code}\n${message}`);
          } else {
            console.debug(`Failed to lstat ${next}\n${message}`);
          }
        }
      }
    }
  };
  return iterator();
}
/**
 * Synchronously reads the contents of a directory.
 * @param path The path to the directory.
 * @returns An iterable that yields directory information.
 */
export function readDirSync(path, options = {
  /**
   * Whether to log debug information.
   * @default false
   */
  debug: false,
}) {
  if (globals.Deno) {
    return globals.Deno.readDirSync(path);
  }
  if (path instanceof URL) {
    path = path.toString();
  }
  if (!fn) {
    fn = loadFs()?.readdirSync;
    if (!fn) {
      throw new Error("No suitable file system module found.");
    }
  }
  if (!lstat) {
    lstat = loadFs()?.lstatSync;
    if (!lstat) {
      throw new Error("No suitable file system module found.");
    }
  }
  const o = Object.create(globals.Iterator.prototype, {});
  Object.assign(o, {
    _data: fn(path),
    _current: 0,
    *[Symbol.iterator]() {
      while (this._current < this._data.length) {
        const n = this.next();
        if (n.done) {
          break;
        }
        yield n.value;
      }
    },
    next() {
      if (this._current >= this._data.length) {
        return { done: true, value: undefined };
      } else {
        try {
          const file = this._data[this._current];
          const name = join(path, file);
          this._current++;
          const info = lstatSync(name);
          return {
            done: false,
            value: {
              name: file,
              isFile: info.isFile,
              isDirectory: info.isDirectory,
              isSymlink: info.isSymlink,
            },
          };
        } catch (e) {
          if (options.debug && e instanceof Error) {
            const message = e.stack ?? e.message;
            const e2 = e;
            if (e2.code) {
              console.debug(`Failed to lstat ${path}\n${e2.code}\n${message}`);
            } else {
              console.debug(`Failed to lstat ${path}\n${message}`);
            }
          }
          return this.next();
        }
      }
    },
  });
  return o;
}
