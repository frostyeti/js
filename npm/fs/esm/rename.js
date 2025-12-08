/**
 * The `rename` module provides functions to rename files or directories.
 *
 * @module
 */
import { globals, loadFs, loadFsAsync } from "./globals.js";
let fn = undefined;
let fnAsync = undefined;
/**
 * Renames a file or directory.
 * @param oldPath The path to the existing file or directory.
 * @param newPath The path to the new file or directory.
 * @returns A promise that resolves when the operation is complete.
 */
export function rename(oldPath, newPath) {
  if (globals.Deno) {
    return globals.Deno.rename(oldPath, newPath);
  }
  if (!fnAsync) {
    fnAsync = loadFsAsync()?.rename;
    if (!fnAsync) {
      return Promise.reject(new Error("No suitable file system module found."));
    }
  }
  return fnAsync(oldPath, newPath);
}
/**
 * Synchronously renames a file or directory.
 * @param oldPath The path to the existing file or directory.
 * @param newPath The path to the new file or directory.
 */
export function renameSync(oldPath, newPath) {
  if (globals.Deno) {
    return globals.Deno.renameSync(oldPath, newPath);
  }
  if (!fn) {
    fn = loadFs()?.renameSync;
    if (!fn) {
      throw new Error("No suitable file system module found.");
    }
  }
  fn(oldPath, newPath);
}
