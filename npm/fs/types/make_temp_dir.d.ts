/**
 * The `make-temp-dir` module provides functions to create temporary directories.
 *
 * @module
 */
import type { MakeTempOptions } from "./types.js";
/**
 * Creates a temporary directory.
 * @param options The options for creating the temporary directory (optional).
 * @returns A promise that resolves with the path to the created temporary directory.
 */
export declare function makeTempDir(options?: MakeTempOptions): Promise<string>;
/**
 * Synchronously creates a temporary directory.
 * @param options The options for creating the temporary directory (optional).
 * @returns The path to the created temporary directory.
 */
export declare function makeTempDirSync(options?: MakeTempOptions): string;
