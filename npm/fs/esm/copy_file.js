/**
 * The copy-file module provides functions to copy files synchronously and asynchronously.
 *
 * @module
 */
import { globals, loadFs, loadFsAsync } from "./globals.js";
let fn;
let fnAsync;
/**
 * Copies a file asynchronously.
 * @param from The path to the source file.
 * @param to The path to the destination file.
 * @returns A promise that resolves when the operation is complete.
 * @throws {Error} If the operation fails.
 * @example
 * ```ts
 * import { copyFile } from "@frostyeti/fs/copy-file";
 * async function copy() {
 *    try {
 *       await copyFile("source.txt", "destination.txt");
 *       console.log("File copied successfully.");
 *   } catch (error) {
 *       console.error("Error copying file:", error);
 *   }
 * }
 * await copy();
 * ```
 */
export function copyFile(from, to) {
  if (globals.Deno) {
    return globals.Deno.copyFile(from, to);
  }
  if (!fnAsync) {
    fnAsync = loadFsAsync()?.copyFile;
    if (!fnAsync) {
      throw new Error("No suitable file system module found.");
    }
  }
  return fnAsync(from, to);
}
/**
 * Synchronously copies a file.
 * @param from The path to the source file.
 * @param to The path to the destination file.
 * @throws {Error} If the operation fails.
 * @example
 * ```ts
 * import { copyFileSync } from "@frostyeti/fs/copy-file";
 * function copy() {
 *   try {
 *      copyFileSync("source.txt", "destination.txt");
 *      console.log("File copied successfully.");
 *   } catch (error) {
 *      console.error("Error copying file:", error);
 *   }
 * }
 * copy();
 * ```
 */
export function copyFileSync(from, to) {
  if (globals.Deno) {
    return globals.Deno.copyFileSync(from, to);
  }
  if (!fn) {
    fn = loadFs()?.copyFileSync;
    if (!fn) {
      throw new Error("No suitable file system module found.");
    }
  }
  return fn(from, to);
}
