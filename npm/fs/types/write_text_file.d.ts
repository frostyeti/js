/**
 * The `write-texto-file` module provides functions to write text data to a file.
 *
 * @module
 */
import type { WriteOptions } from "./types.js";
/**
 * Writes text data to a file.
 * @param path The path to the file.
 * @param data The text data to write.
 * @param options The options for writing the file (optional).
 * @returns A promise that resolves when the operation is complete.
 */
export declare function writeTextFile(
  path: string | URL,
  data: string,
  options?: WriteOptions,
): Promise<void>;
/**
 * Synchronously writes text data to a file.
 * @param path The path to the file.
 * @param data The text data to write.
 * @param options The options for writing the file (optional).
 */
export declare function writeTextFileSync(
  path: string | URL,
  data: string,
  options?: WriteOptions,
): void;
