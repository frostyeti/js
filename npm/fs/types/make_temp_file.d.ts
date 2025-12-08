/**
 * The `make-temp-file` module provides functions to create temporary files.
 *
 * @module
 */
import type { MakeTempOptions } from "./types.js";
/**
 * Creates a temporary file.
 * @param options The options for creating the temporary file (optional).
 * @returns A promise that resolves with the path to the created temporary file.
 */
export declare function makeTempFile(
  options?: MakeTempOptions,
): Promise<string>;
/**
 * Creates a temporary file synchronously.
 * @param options The options for creating the temporary file (optional).
 * @returns The path to the created temporary file.
 */
export declare function makeTempFileSync(options?: MakeTempOptions): string;
