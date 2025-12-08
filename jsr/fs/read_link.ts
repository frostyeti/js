/**
 * The `read-link` module provides functions to read the target of a symbolic link.
 *
 * @module
 */

import { globals, loadFs, loadFsAsync } from "./globals.ts";

let fn: typeof import("node:fs").readlinkSync | undefined = undefined;
let fnAsync: typeof import("node:fs/promises").readlink | undefined = undefined;

/**
 * Reads the target of a symbolic link.
 * @param path The path to the symbolic link.
 * @returns A promise that resolves with the target path as a string.
 */
export function readLink(path: string | URL): Promise<string> {
    if (globals.Deno) {
        return globals.Deno.readLink(path);
    }

    if (!fnAsync) {
        fnAsync = loadFsAsync()?.readlink;
        if (!fnAsync) {
            return Promise.reject(new Error("No suitable file system module found."));
        }
    }

    return fnAsync(path);
}

/**
 * Synchronously reads the target of a symbolic link.
 * @param path The path to the symbolic link.
 * @returns The target path as a string.
 */
export function readLinkSync(path: string | URL): string {
    if (globals.Deno) {
        return globals.Deno.readLinkSync(path);
    }

    if (!fn) {
        fn = loadFs()?.readlinkSync;
        if (!fn) {
            throw new Error("No suitable file system module found.");
        }
    }

    return fn(path);
}
