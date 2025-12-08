/**
 * This module provides functions to change the permissions of files and directories.
 *
 * @module
 */
import { globals, loadFs, loadFsAsync } from "./globals.js";
let fn;
let fnAsync;
/**
 * Changes the permissions of a file or directory asynchronously.
 * @param path The path to the file or directory.
 * @param mode The new permissions mode.
 * @returns A promise that resolves when the operation is complete.
 * @throws {Error} If the operation fails.
 * @example
 * ```ts
 * import { chmod } from "@frostyeti/fs/chmod";
 *
 * async function changePermissions() {
 *     try {
 *         await chmod("example.txt", 0o755);
 *         console.log("Permissions changed successfully.");
 *     } catch (error) {
 *         console.error("Error changing permissions:", error);
 *     }
 * }
 * await changePermissions();
 * ```
 */
export function chmod(path, mode) {
  if (globals.Deno) {
    return globals.Deno.chmod(path, mode);
  }
  if (!fnAsync) {
    fnAsync = loadFsAsync()?.chmod;
    if (!fnAsync) {
      throw new Error("No suitable file system module found.");
    }
  }
  return fnAsync(path, mode);
}
/**
 * Changes the permissions of a file or directory synchronously.
 * @param path The path to the file or directory.
 * @param mode The new permissions mode.
 * @throws {Error} If the operation fails.
 * @example
 * ```ts
 * import { chmodSync } from "@frostyeti/fs/chmod";
 *
 * function changePermissions() {
 *     try {
 *        chmodSync("example.txt", 0o755);
 *        console.log("Permissions changed successfully.");
 *     } catch (error) {
 *        console.error("Error changing permissions:", error);
 *     }
 * }
 * changePermissions();
 * ```
 */
export function chmodSync(path, mode) {
  if (globals.Deno) {
    return globals.Deno.chmodSync(path, mode);
  }
  if (!fn) {
    fn = loadFs()?.chmodSync;
    if (!fn) {
      throw new Error("No suitable file system module found.");
    }
  }
  return fn(path, mode);
}
