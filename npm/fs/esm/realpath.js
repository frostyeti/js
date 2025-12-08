/**
 * The `realpath` module provides functions to resolve the real path of a file or directory.
 *
 * @module
 */
import { globals, loadFs, loadFsAsync } from "./globals.js";
let fn = undefined;
let fnAsync = undefined;
/**
 * Resolves the real path of a file or directory.
 * @param path The path to the file or directory.
 * @returns A promise that resolves with the real path as a string.
 */
export function realPath(path) {
  if (globals.Deno) {
    return globals.Deno.realPath(path);
  }
  if (!fnAsync) {
    fnAsync = loadFsAsync()?.realpath;
    if (!fnAsync) {
      return Promise.reject(new Error("No suitable file system module found."));
    }
  }
  return fnAsync(path);
}
/**
 * Synchronously resolves the real path of a file or directory.
 * @param path The path to the file or directory.
 * @returns The real path as a string.
 */
export function realPathSync(path) {
  if (globals.Deno) {
    return globals.Deno.realPathSync(path);
  }
  if (!fn) {
    fn = loadFs()?.realpathSync;
    if (!fn) {
      throw new Error("fs.realpathSync is not available");
    }
  }
  return fn(path);
}
