/**
 * The `make-temp-dir` module provides functions to create temporary directories.
 *
 * @module
 */

import type { MakeTempOptions } from "./types.ts";
import { globals, loadFs, loadFsAsync, WIN } from "./globals.ts";
import { join } from "@frostyeti/path";
import { isAbsolute } from "node:path";

let fn: typeof import("node:fs").mkdirSync | undefined = undefined;
let fnAsync: typeof import("node:fs/promises").mkdir | undefined = undefined;

function randomName(prefix?: string, suffix?: string): string {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const rng = crypto.getRandomValues(new Uint8Array(12));
    const name = Array.from(rng)
        .map((x) => chars[x % chars.length])
        .join("");

    if (prefix && suffix) {
        return `${prefix}${name}${suffix}`;
    }

    if (prefix) {
        return `${prefix}${name}`;
    }

    if (suffix) {
        return `${name}${suffix}`;
    }

    return name;
}

/**
 * Creates a temporary directory.
 * @param options The options for creating the temporary directory (optional).
 * @returns A promise that resolves with the path to the created temporary directory.
 */
export async function makeTempDir(options?: MakeTempOptions): Promise<string> {
    if (globals.Deno) {
        return globals.Deno.makeTempDir(options);
    }

    if (!fnAsync) {
        fnAsync = loadFsAsync()?.mkdir;
        if (!fnAsync) {
            throw new Error("fs.promises.mkdtemp is not available");
        }
    }
    options ??= {};
    let dir: string = "";
    if (!options.dir) {
        dir = WIN
            ? (globals.process.env.TEMP ?? "c:\\Temp")
            : (globals.process.env.TMPDIR ?? "/tmp");
    } else if (options.dir && !isAbsolute(options.dir)) {
        dir = WIN
            ? (globals.process.env.TEMP ?? "c:\\Temp")
            : (globals.process.env.TMPDIR ?? "/tmp");
        dir = join(dir, options.dir);
    } else {
        dir = options.dir;
    }

    const dirname = randomName(options.prefix, options.suffix);
    const path = join(dir, dirname);

    await fnAsync(path, { recursive: true, mode: 0o755 });
    return path;
}

/**
 * Synchronously creates a temporary directory.
 * @param options The options for creating the temporary directory (optional).
 * @returns The path to the created temporary directory.
 */
export function makeTempDirSync(options?: MakeTempOptions): string {
    if (globals.Deno) {
        return globals.Deno.makeTempDirSync(options);
    }

    if (!fn) {
        fn = loadFs()?.mkdirSync;
        if (!fn) {
            throw new Error("fs.mkdtempSync is not available");
        }
    }

    options ??= {};
    let dir: string = "";
    if (!options.dir) {
        dir = WIN
            ? (globals.process.env.TEMP ?? "c:\\Temp")
            : (globals.process.env.TMPDIR ?? "/tmp");
    } else if (options.dir && !isAbsolute(options.dir)) {
        dir = WIN
            ? (globals.process.env.TEMP ?? "c:\\Temp")
            : (globals.process.env.TMPDIR ?? "/tmp");
        dir = join(dir, options.dir);
    } else {
        dir = options.dir;
    }

    const dirname = randomName(options.prefix, options.suffix);
    const path = join(dir, dirname);
    fn(path, { recursive: true, mode: 0o755 });
    return path;
}
