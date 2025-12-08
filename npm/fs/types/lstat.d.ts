/**
 * The `lstat` module provides functions to get information about a file or directory.
 *
 * @module
 */
import type { FileInfo } from "./types.js";
/**
 * Gets information about a file or directory.
 * @param path The path to the file or directory.
 * @returns A promise that resolves with the file information.
 */
export declare function lstat(path: string | URL): Promise<FileInfo>;
/**
 * Gets information about a file or directory synchronously.
 * @param path The path to the file or directory.
 * @returns The file information.
 */
export declare function lstatSync(path: string | URL): FileInfo;
