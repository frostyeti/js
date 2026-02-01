/**
 * The `read-dir` module provides functions to read the contents of a directory
 * and return information about its contents.
 *
 * @module
 */
import type { DirectoryInfo } from "./types.ts";
import { join } from "@frostyeti/path";
import { globals, loadFs, loadFsAsync } from "./globals.ts";
import { lstatSync } from "./lstat.ts";

let fn: typeof import("node:fs").readdirSync | undefined = undefined;
let fnAsync: typeof import("node:fs/promises").readdir | undefined = undefined;
let lstat: typeof import("node:fs").lstatSync | undefined = undefined;
let lstatAsync: typeof import("node:fs/promises").lstat | undefined = undefined;

/**
 * Reads the contents of a directory.
 * @param path The path to the directory.
 * @returns An async iterable that yields directory information.
 */
export function readdir(
    path: string | URL,
    options = {
        /**
         * Whether to log debug information.
         * @default false
         */
        debug: false,
    },
): AsyncIterable<DirectoryInfo> {
    if (globals.Deno) {
        return globals.Deno.readDir(path);
    }

    if (!fnAsync) {
        fnAsync = loadFsAsync()?.readdir;
        if (!fnAsync) {
            throw new Error("No suitable file system module found.");
        }
    }

    if (!lstatAsync) {
        lstatAsync = loadFsAsync()?.lstat;
        if (!lstatAsync) {
            throw new Error("No suitable file system module found.");
        }
    }

    if (path instanceof URL) {
        path = path.toString();
    }

    const iterator = async function* () {
        const data = await fnAsync!(path);
        for (const d of data) {
            const next = join(path, d);
            try {
                const info = await lstatAsync!(join(path, d));
                yield {
                    name: d,
                    isFile: info.isFile(),
                    isDirectory: info.isDirectory(),
                    isSymlink: info.isSymbolicLink(),
                };
            } catch (e) {
                if (options.debug && e instanceof Error) {
                    const message = e.stack ?? e.message;
                    const e2 = e as NodeJS.ErrnoException;
                    if (e2.code) {
                        console.debug(`Failed to lstat ${next}\n${e2.code}\n${message}`);
                    } else {
                        console.debug(`Failed to lstat ${next}\n${message}`);
                    }
                }
            }
        }
    };

    return iterator();
}

/**
 * Synchronously reads the contents of a directory.
 * @param path The path to the directory.
 * @returns An iterable that yields directory information.
 */
export function readdirSync(
    path: string | URL,
    options = {
        /**
         * Whether to log debug information.
         * @default false
         */
        debug: false,
    },
): IteratorObject<DirectoryInfo, unknown, unknown> & Iterable<DirectoryInfo> {
    if (globals.Deno) {
        return globals.Deno.readDirSync(path);
    }

    if (path instanceof URL) {
        path = path.toString();
    }

    if (!fn) {
        fn = loadFs()?.readdirSync;
        if (!fn) {
            throw new Error("No suitable file system module found.");
        }
    }

    if (!lstat) {
        lstat = loadFs()?.lstatSync;
        if (!lstat) {
            throw new Error("No suitable file system module found.");
        }
    }

    const o = Object.create(globals.Iterator.prototype, {});

    Object.assign(o, {
        _data: fn!(path),
        _current: 0,

        *[Symbol.iterator](): Iterator<DirectoryInfo> {
            while (this._current < this._data.length) {
                const n = this.next();
                if (n.done) {
                    break;
                }

                yield n.value;
            }
        },

        next(): IteratorResult<DirectoryInfo> {
            if (this._current >= this._data.length) {
                return { done: true, value: undefined };
            } else {
                try {
                    const file = this._data[this._current];
                    const name = join(path, file);
                    this._current++;
                    const info = lstatSync(name);
                    return {
                        done: false,
                        value: {
                            name: file,
                            isFile: info.isFile,
                            isDirectory: info.isDirectory,
                            isSymlink: info.isSymlink,
                        },
                    };
                } catch (e) {
                    if (options.debug && e instanceof Error) {
                        const message = e.stack ?? e.message;
                        const e2 = e as NodeJS.ErrnoException;
                        if (e2.code) {
                            console.debug(`Failed to lstat ${path}\n${e2.code}\n${message}`);
                        } else {
                            console.debug(`Failed to lstat ${path}\n${message}`);
                        }
                    }
                    return this.next();
                }
            }
        },
    });

    return o as unknown as
        & IteratorObject<DirectoryInfo, unknown, unknown>
        & Iterable<DirectoryInfo>;
}
