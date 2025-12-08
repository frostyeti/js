/**
 * The `read-file` module provides functions to read the contents of a file.
 *
 * @module
 */
import type { ReadOptions } from "./types.js";
/**
 * Reads the contents of a file.
 * @param path The path to the file.
 * @param options The options for reading the file (optional).
 * @returns A promise that resolves with the file contents as a Uint8Array.
 */
export declare function readFile(
  path: string | URL,
  options?: ReadOptions,
): Promise<Uint8Array>;
/**
 * Synchronously reads the contents of a file.
 * @param path The path to the file.
 * @returns The file contents as a Uint8Array.
 */
export declare function readFileSync(path: string | URL): Uint8Array;
