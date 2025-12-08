/**
 * The `stat` module provides functions to get information about a file or directory.
 *
 * @module
 */

import { basename } from "@frostyeti/path";
import type { FileInfo } from "./types.ts";
import { globals, loadFs, loadFsAsync } from "./globals.ts";

let st: typeof import("node:fs").statSync | undefined;
let stAsync: typeof import("node:fs/promises").stat | undefined;

/**
 * Gets information about a file or directory.
 * @param path The path to the file or directory.
 * @returns A promise that resolves with the file information.
 * @throws {Error} If the operation fails.
 * @example
 * ```ts
 * import { stat } from "@frostyeti/fs/stat";
 * async function getFileInfo() {
 *     try {
 *          const info = await stat("example.txt");
 *          console.log("File information:", info);
 *     } catch (error) {
 *          console.error("Error getting file information:", error);
 *     }
 * }
 * await getFileInfo();
 * ```
 */
export function stat(path: string | URL): Promise<FileInfo> {
    if (globals.Deno) {
        // deno-lint-ignore no-explicit-any
        return globals.Deno.stat(path).then((stat: any) => {
            const p = path instanceof URL ? path.toString() : path;
            return {
                isFile: stat.isFile,
                isDirectory: stat.isDirectory,
                isSymlink: stat.isSymlink,
                name: basename(p),
                path: p,
                size: stat.size,
                birthtime: stat.birthtime,
                mtime: stat.mtime,
                atime: stat.atime,
                mode: stat.mode,
                uid: stat.uid,
                gid: stat.gid,
                dev: stat.dev,
                blksize: stat.blksize,
                ino: stat.ino,
                nlink: stat.nlink,
                rdev: stat.rdev,
                blocks: stat.blocks,
                isBlockDevice: stat.isBlockDevice,
                isCharDevice: stat.isCharDevice,
                isSocket: stat.isSocket,
                isFifo: stat.isFifo,
            };
        });
    }

    if (!stAsync) {
        stAsync = loadFsAsync()?.stat;
        if (!stAsync) {
            throw new Error("No suitable file system module found.");
        }
    }

    return stAsync(path).then((stat) => {
        const p = path instanceof URL ? path.toString() : path;
        return {
            isFile: stat.isFile(),
            isDirectory: stat.isDirectory(),
            isSymlink: stat.isSymbolicLink(),
            name: basename(p),
            path: p,
            size: stat.size,
            birthtime: stat.birthtime,
            mtime: stat.mtime,
            atime: stat.atime,
            mode: stat.mode,
            uid: stat.uid,
            gid: stat.gid,
            dev: stat.dev,
            blksize: stat.blksize,
            ino: stat.ino,
            nlink: stat.nlink,
            rdev: stat.rdev,
            blocks: stat.blocks,
            isBlockDevice: stat.isBlockDevice(),
            isCharDevice: stat.isCharacterDevice(),
            isSocket: stat.isSocket(),
            isFifo: stat.isFIFO(),
        };
    });
}

/**
 * Gets information about a file or directory synchronously.
 * @param path The path to the file or directory.
 * @returns The file information.
 * @throws {Error} If the operation fails.
 * @example
 * ```ts
 * import { statSync } from "@frostyeti/fs/stat";
 * function getFileInfo() {
 *     try {
 *         const info = statSync("example.txt");
 *         console.log("File information:", info);
 *     } catch (error) {
 *         console.error("Error getting file information:", error);
 *     }
 * }
 * getFileInfo();
 * ```
 */
export function statSync(path: string | URL): FileInfo {
    if (globals.Deno) {
        const stat = globals.Deno.statSync(path);
        const p = path instanceof URL ? path.toString() : path;
        return {
            isFile: stat.isFile,
            isDirectory: stat.isDirectory,
            isSymlink: stat.isSymlink,
            name: basename(p),
            path: p,
            size: stat.size,
            birthtime: stat.birthtime,
            mtime: stat.mtime,
            atime: stat.atime,
            mode: stat.mode,
            uid: stat.uid,
            gid: stat.gid,
            dev: stat.dev,
            blksize: stat.blksize,
            ino: stat.ino,
            nlink: stat.nlink,
            rdev: stat.rdev,
            blocks: stat.blocks,
            isBlockDevice: stat.isBlockDevice,
            isCharDevice: stat.isCharDevice,
            isSocket: stat.isSocket,
            isFifo: stat.isFifo,
        };
    }

    if (!st) {
        st = loadFs()?.statSync;
        if (!st) {
            throw new Error("No suitable file system module found.");
        }
    }

    const stat = st(path);
    const p = path instanceof URL ? path.toString() : path;
    return {
        isFile: stat.isFile(),
        isDirectory: stat.isDirectory(),
        isSymlink: stat.isSymbolicLink(),
        name: basename(p),
        path: p,
        size: stat.size,
        birthtime: stat.birthtime,
        mtime: stat.mtime,
        atime: stat.atime,
        mode: stat.mode,
        uid: stat.uid,
        gid: stat.gid,
        dev: stat.dev,
        blksize: stat.blksize,
        ino: stat.ino,
        nlink: stat.nlink,
        rdev: stat.rdev,
        blocks: stat.blocks,
        isBlockDevice: stat.isBlockDevice(),
        isCharDevice: stat.isCharacterDevice(),
        isSocket: stat.isSocket(),
        isFifo: stat.isFIFO(),
    };
}
