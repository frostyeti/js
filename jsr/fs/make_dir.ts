/**
 * This `make0dir` module provides functions to create directories in a file system.
 *
 * @module
 */

import { globals, loadFs, loadFsAsync } from "./globals.ts";
import type { CreateDirectoryOptions } from "./types.ts";

let fn: typeof import("node:fs").mkdirSync | undefined;
let fnAsync: typeof import("node:fs/promises").mkdir | undefined;

/**
 * Creates a directory.
 * @param path The path to the directory.
 * @param options The options for creating the directory (optional).
 * @returns A promise that resolves when the operation is complete.
 */
export async function makeDir(
    path: string | URL,
    options?: CreateDirectoryOptions | undefined,
): Promise<void> {
    if (globals.Deno) {
        return globals.Deno.mkdir(path, options);
    }

    if (fnAsync) {
        await fnAsync(path, options);
        return;
    }

    const fs = loadFsAsync();
    if (fs) {
        fnAsync = fs.mkdir;
        await fnAsync(path, options);
        return;
    }

    throw new Error("No suitable file system module found.");
}

/**
 * Synchronously creates a directory.
 * @param path The path to the directory.
 * @param options The options for creating the directory (optional).
 */
export function makeDirSync(
    path: string | URL,
    options?: CreateDirectoryOptions | undefined,
): void {
    if (globals.Deno) {
        return globals.Deno.mkdirSync(path, options);
    }

    if (fn) {
        fn(path, options);
        return;
    }

    const fs = loadFs();
    if (fs) {
        fn = fs.mkdirSync;
        fn(path, options);
        return;
    }

    throw new Error("No suitable file system module found.");
}
