/**
 * This module provides functions to change the owner and group of a file or directory.
 *
 * @module
 */
import { globals, loadFs, loadFsAsync } from "./globals.js";
let fn;
let fnAsync;
/**
 * Changes the owner and group of a file or directory asynchronously.
 * @param path The path to the file or directory.
 * @param uid The new owner user ID.
 * @param gid The new owner group ID.
 * @returns A promise that resolves when the operation is complete.
 * @throws {Error} If the operation fails.
 * @example
 * ```ts
 * import { chown } from "@frostyeti/fs/chown";
 * async function changeOwner() {
 *     try {
 *         await chown("example.txt", 1000, 1000);
 *         console.log("Owner changed successfully.");
 *     } catch (error) {
 *         console.error("Error changing owner:", error);
 *     }
 * }
 * await changeOwner();
 * ```
 */
export function chown(path, uid, gid) {
  if (globals.Deno) {
    return globals.Deno.chown(path, uid, gid);
  }
  if (!fnAsync) {
    fnAsync = loadFsAsync()?.chown;
    if (!fnAsync) {
      throw new Error("No suitable file system module found.");
    }
  }
  return fnAsync(path, uid, gid);
}
/**
 * Changes the owner and group of a file or directory synchronously.
 * @param path The path to the file or directory.
 * @param uid The new owner user ID.
 * @param gid The new owner group ID.
 * @throws {Error} If the operation fails.
 * @example
 * ```ts
 * import { chownSync } from "@frostyeti/fs/chown";
 * function changeOwner() {
 *      try {
 *          chownSync("example.txt", 1000, 1000);
 *          console.log("Owner changed successfully.");
 *      } catch (error) {
 *          console.error("Error changing owner:", error);
 *      }
 * }
 * changeOwner();
 * ```
 */
export function chownSync(path, uid, gid) {
  if (globals.Deno) {
    globals.Deno.chownSync(path, uid, gid);
    return;
  }
  if (!fn) {
    fn = loadFs()?.chownSync;
    if (!fn) {
      throw new Error("No suitable file system module found.");
    }
  }
  return fn(path, uid, gid);
}
