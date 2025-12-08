/**
 * The `write-file` module provides functions to write binary data to a file.
 *
 * @module
 */
import type { WriteOptions } from "./types.js";
/**
 * Writes binary data to a file.
 * @param path The path to the file.
 * @param data The binary data to write.
 * @param options The options for writing the file (optional).
 * @returns A promise that resolves when the operation is complete.
 */
export declare function writeFile(
  path: string | URL,
  data: Uint8Array | ReadableStream<Uint8Array>,
  options?: WriteOptions | undefined,
): Promise<void>;
/**
 * Synchronously writes binary data to a file.
 * @param path The path to the file.
 * @param data The binary data to write.
 * @param options The options for writing the file (optional).
 */
export declare function writeFileSync(
  path: string | URL,
  data: Uint8Array,
  options?: WriteOptions | undefined,
): void;
