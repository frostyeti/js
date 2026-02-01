/**
 * This `make0dir` module provides functions to create directories in a file system.
 *
 * @module
 */
import type { CreateDirectoryOptions } from "./types.js";
/**
 * Creates a directory.
 * @param path The path to the directory.
 * @param options The options for creating the directory (optional).
 * @returns A promise that resolves when the operation is complete.
 */
export declare function makeDir(
  path: string | URL,
  options?: CreateDirectoryOptions | undefined,
): Promise<void>;
/**
 * Synchronously creates a directory.
 * @param path The path to the directory.
 * @param options The options for creating the directory (optional).
 */
export declare function mkdirSync(
  path: string | URL,
  options?: CreateDirectoryOptions | undefined,
): void;
