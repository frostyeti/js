/**
 * The `symlink` module provides functions to create symbolic links.
 *
 * @module
 */
import type { SymlinkOptions } from "./types.ts";
import { globals, loadFs, loadFsAsync } from "./globals.ts";

let fn: typeof import("node:fs").symlinkSync | undefined = undefined;
let fnAsync: typeof import("node:fs/promises").symlink | undefined = undefined;

/**
 * Creates a symbolic link.
 * @param target The path to the target file or directory.
 * @param path The path to the symbolic link.
 * @param options The type of the symbolic link (optional).
 * @returns A promise that resolves when the operation is complete.
 */
export function symlink(
    target: string | URL,
    path: string | URL,
    options?: SymlinkOptions,
): Promise<void> {
    if (globals.Deno) {
        return globals.Deno.symlink(target, path, options);
    }

    if (!fnAsync) {
        fnAsync = loadFsAsync()?.symlink;
        if (!fnAsync) {
            return Promise.reject(new Error("No suitable file system module found."));
        }
    }

    return fnAsync(target, path, options?.type);
}

/**
 * Synchronously creates a symbolic link.
 * @param target The path to the target file or directory.
 * @param path The path to the symbolic link.
 * @param options The type of the symbolic link (optional).
 */
export function symlinkSync(
    target: string | URL,
    path: string | URL,
    options?: SymlinkOptions,
): void {
    if (globals.Deno) {
        return globals.Deno.symlinkSync(target, path, options);
    }

    if (!fn) {
        fn = loadFs()?.symlinkSync;
        if (!fn) {
            throw new Error("No suitable file system module found.");
        }
    }

    fn(target, path, options?.type);
}
