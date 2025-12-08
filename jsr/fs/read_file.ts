/**
 * The `read-file` module provides functions to read the contents of a file.
 *
 * @module
 */

import { globals, loadFs, loadFsAsync } from "./globals.ts";
import type { ReadOptions } from "./types.ts";

let fn: typeof import("node:fs").readFileSync | undefined = undefined;
let fnAsync: typeof import("node:fs/promises").readFile | undefined = undefined;

/**
 * Reads the contents of a file.
 * @param path The path to the file.
 * @param options The options for reading the file (optional).
 * @returns A promise that resolves with the file contents as a Uint8Array.
 */
export function readFile(path: string | URL, options?: ReadOptions): Promise<Uint8Array> {
    if (globals.Deno) {
        return globals.Deno.readFile(path);
    }

    if (!fnAsync) {
        fnAsync = loadFsAsync()?.readFile;
        if (!fnAsync) {
            return Promise.reject(new Error("No suitable file system module found."));
        }
    }

    if (options?.signal) {
        if (options.signal.aborted) {
            const e = new Error("The operation was aborted.");
            e.name = "AbortError";
            return Promise.reject(e);
        }

        return fnAsync(path, { signal: options.signal }) as Promise<Uint8Array>;
    }

    return fnAsync(path) as Promise<Uint8Array>;
}

/**
 * Synchronously reads the contents of a file.
 * @param path The path to the file.
 * @returns The file contents as a Uint8Array.
 */
export function readFileSync(path: string | URL): Uint8Array {
    if (globals.Deno) {
        return globals.Deno.readFileSync(path);
    }

    if (!fn) {
        fn = loadFs()?.readFileSync;
        if (!fn) {
            throw new Error("No suitable file system module found.");
        }
    }

    return fn(path) as Uint8Array;
}
