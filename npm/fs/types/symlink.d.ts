/**
 * The `symlink` module provides functions to create symbolic links.
 *
 * @module
 */
import type { SymlinkOptions } from "./types.js";
/**
 * Creates a symbolic link.
 * @param target The path to the target file or directory.
 * @param path The path to the symbolic link.
 * @param options The type of the symbolic link (optional).
 * @returns A promise that resolves when the operation is complete.
 */
export declare function symlink(
  target: string | URL,
  path: string | URL,
  options?: SymlinkOptions,
): Promise<void>;
/**
 * Synchronously creates a symbolic link.
 * @param target The path to the target file or directory.
 * @param path The path to the symbolic link.
 * @param options The type of the symbolic link (optional).
 */
export declare function symlinkSync(
  target: string | URL,
  path: string | URL,
  options?: SymlinkOptions,
): void;
