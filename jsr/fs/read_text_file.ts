/**
 * The `read-text-file` module provides functions to read the contents of a file as text.
 *
 * @module
 */

import type { ReadOptions } from "./types.ts";
import { globals, loadFs, loadFsAsync } from "./globals.ts";

let fn: typeof import("node:fs").readFileSync | undefined = undefined;
let fnAsync: typeof import("node:fs/promises").readFile | undefined = undefined;

/**
 * Reads the contents of a file as text.
 * @param path The path to the file.
 * @param options The options for reading the file (optional).
 * @returns A promise that resolves with the file contents as a string.
 */
export function readTextFile(path: string | URL, options?: ReadOptions): Promise<string> {
    if (globals.Deno) {
        return globals.Deno.readTextFile(path, options);
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

        return fnAsync(path, { encoding: "utf-8", signal: options.signal });
    }

    return fnAsync(path, { encoding: "utf-8" });
}

/**
 * Synchronously Reads the contents of a file as text.
 * @param path The path to the file.
 * @returns The file contents as a string.
 */
export function readTextFileSync(path: string | URL): string {
    if (globals.Deno) {
        return globals.Deno.readTextFileSync(path);
    }

    if (!fn) {
        fn = loadFs()?.readFileSync;
        if (!fn) {
            throw new Error("No suitable file system module found.");
        }
    }

    return fn(path, { encoding: "utf-8" });
}
