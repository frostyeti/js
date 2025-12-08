/**
 * The `read-dir` module provides functions to read the contents of a directory
 * and return information about its contents.
 *
 * @module
 */
import type { DirectoryInfo } from "./types.js";
/**
 * Reads the contents of a directory.
 * @param path The path to the directory.
 * @returns An async iterable that yields directory information.
 */
export declare function readDir(path: string | URL, options?: {
  /**
   * Whether to log debug information.
   * @default false
   */
  debug: boolean;
}): AsyncIterable<DirectoryInfo>;
/**
 * Synchronously reads the contents of a directory.
 * @param path The path to the directory.
 * @returns An iterable that yields directory information.
 */
export declare function readDirSync(path: string | URL, options?: {
  /**
   * Whether to log debug information.
   * @default false
   */
  debug: boolean;
}): IteratorObject<DirectoryInfo, unknown, unknown> & Iterable<DirectoryInfo>;
