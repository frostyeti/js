/**
 * The `read-text-file` module provides functions to read the contents of a file as text.
 *
 * @module
 */
import type { ReadOptions } from "./types.js";
/**
 * Reads the contents of a file as text.
 * @param path The path to the file.
 * @param options The options for reading the file (optional).
 * @returns A promise that resolves with the file contents as a string.
 */
export declare function readTextFile(
  path: string | URL,
  options?: ReadOptions,
): Promise<string>;
/**
 * Synchronously Reads the contents of a file as text.
 * @param path The path to the file.
 * @returns The file contents as a string.
 */
export declare function readTextFileSync(path: string | URL): string;
