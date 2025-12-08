/**
 * The `utime` module provides functions to change the access time and modification time of a file or directory.
 *
 * @module
 */
import { globals, loadFs, loadFsAsync } from "./globals.js";
let fn;
let fnAsync;
/**
 * Changes the access time and modification time of a file or directory.
 * @param path The path to the file or directory.
 * @param atime The new access time.
 * @param mtime The new modification time.
 * @returns A promise that resolves when the operation is complete.
 */
export function utime(path, atime, mtime) {
  if (globals.Deno) {
    return globals.Deno.utime(path, atime, mtime);
  }
  if (!fnAsync) {
    fnAsync = loadFsAsync()?.utimes;
    if (!fnAsync) {
      throw new Error("No suitable file system module found.");
    }
  }
  return fnAsync(path, atime, mtime);
}
/**
 * Synchronously changes the access time and modification time of a file or directory.
 * @param path The path to the file or directory.
 * @param atime The new access time.
 * @param mtime The new modification time.
 */
export function utimeSync(path, atime, mtime) {
  if (globals.Deno) {
    return globals.Deno.utimeSync(path, atime, mtime);
  }
  if (!fn) {
    fn = loadFs()?.utimesSync;
    if (!fn) {
      throw new Error("No suitable file system module found.");
    }
  }
  fn(path, atime, mtime);
}
