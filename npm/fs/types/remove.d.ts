/**
 * The `remove` module provides functions to remove files or directories.
 *
 * @module
 */
import type { RemoveOptions } from "./types.js";
/**
 * Removes a file or directory.
 * @param path The path to the file or directory.
 * @param options The options for removing the file or directory (optional).
 * @returns A promise that resolves when the operation is complete.
 */
export declare function remove(
  path: string | URL,
  options?: RemoveOptions,
): Promise<void>;
/**
 * Synchronously removes a file or directory.
 * @param path The path to the file or directory.
 * @param options The options for removing the file or directory (optional).
 */
export declare function removeSync(
  path: string | URL,
  options?: RemoveOptions,
): void;
