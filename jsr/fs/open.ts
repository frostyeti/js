// deno-lint-ignore-file no-unused-vars
/**
 * The `open` module provides a function to open files
 * in a file system. It supports both synchronous and asynchronous
 * operations such as read, write, and seek.
 *
 * @module
 */
import type { FileInfo, FsSupports, OpenOptions, SeekMode } from "./types.ts";
import { basename } from "@frostyeti/path";
import { globals, loadFs } from "./globals.ts";
import { statSync } from "./stat.ts";

export interface Extras {
    [key: string]: unknown;

    lockSupported: boolean;
    seekSupported: boolean;

    /**
     * Lock a file descriptor.
     * @param fd The file descriptor
     * @param exclusive The lock type
     * @returns A promise that resolves when the file is locked.
     */
    lockFile(fd: number, exclusive?: boolean): Promise<void>;
    /**
     * Synchronously lock a file descriptor.
     * @param fd The file descriptor
     * @param exclusive The lock type
     * @returns A promise that resolves when the file is locked.
     */
    lockFileSync(fd: number, exclusive?: boolean): void;

    /**
     * Unlock a file descriptor.
     * @param fd The file descriptor
     * @returns A promise that resolves when the file is unlocked.
     */
    unlockFile(fd: number): Promise<void>;

    /**
     * Synchronously unlock a file descriptor.
     * @param fd The file descriptor
     * @returns A promise that resolves when the file is unlocked.
     */
    unlockFileSync(fd: number): void;

    /**
     * Seek to a position in a file descriptor.
     * @param fd The file descriptor
     * @param offset The offset to seek to
     * @param whence The seek mode
     * @returns A promise that resolves with the new position.
     */
    seekFile(fd: number, offset: number | bigint, whence?: SeekMode): Promise<number>;

    /**
     * Synchronously seek to a position in a file descriptor.
     * @param fd The file descriptor
     * @param offset The offset to seek to
     * @param whence The seek mode
     * @returns The new position.
     */
    seekFileSync(fd: number, offset: number | bigint, whence?: SeekMode): number;
}

/**
 * The ext constant provides an extension point for adding
 * additional functionality to the file system module that
 * is not part of the standard file system interface for node
 * but is available through other modules like `fs-ext`.
 *
 * The `fs-ext` module invokes an install script for node-gyp
 * and better to avoid taking on the dependency.
 *
 * @example ts
 * ```ts
 * import { ext } from "@frostyeti/fs/node/ext";
 * import { flock, flockSync,} from "npm:fs-ext@2.0.0";
 *
 * ext.lockFile = (fd: number, exclusive?: boolean) =>
 *     new Promise((resolve, reject) => {
 *               flock(fd, exclusive ? "ex" : "sh", (err: unknown) => {
 *                   if (err) reject(err);
 *                   resolve();
 *               });
 *           });
 *
 *       ext.lockFileSync = (fd: number, exclusive?: boolean) => {
 *           flockSync(fd, exclusive ? "ex" : "sh");
 *       };
 *
 * ```
 */
export const ext: Extras = {
    lockSupported: false,
    seekSupported: false,

    /**
     * Lock a file descriptor.
     * @param fd The file descriptor
     * @param exclusive The lock type
     * @returns A promise that resolves when the file is locked.
     */
    lockFile(fd: number, exclusive?: boolean): Promise<void> {
        return Promise.reject(new Error("Not implemented"));
    },

    /**
     * Synchronously lock a file descriptor.
     * @param fd The file descriptor
     * @param exclusive The lock type
     * @returns A promise that resolves when the file is locked.
     */
    lockFileSync(fd: number, exclusive?: boolean): void {
        throw new Error("Not implemented");
    },

    /**
     * Unlock a file descriptor.
     * @param fd The file descriptor
     * @returns A promise that resolves when the file is unlocked.
     */
    unlockFile(fd: number): Promise<void> {
        return Promise.reject(new Error("Not implemented"));
    },

    /**
     * Synchronously unlock a file descriptor.
     * @param fd The file descriptor
     * @returns A promise that resolves when the file is unlocked.
     */
    unlockFileSync(fd: number): void {
        throw new Error("Not implemented");
    },

    /**
     * Seek to a position in a file descriptor.
     * @param fd The file descriptor
     * @param offset The offset to seek to
     * @param whence The seek mode
     * @returns A promise that resolves with the new position.
     */
    seekFile(fd: number, offset: number | bigint, whence?: SeekMode): Promise<number> {
        return Promise.reject(new Error("Not implemented"));
    },

    /**
     * Synchronously seek to a position in a file descriptor.
     * @param fd The file descriptor
     * @param offset The offset to seek to
     * @param whence The seek mode
     * @returns The new position.
     */
    seekFileSync(fd: number, offset: number | bigint, whence?: SeekMode): number {
        throw new Error("Not implemented");
    },
};

export class FsFile {
    [key: string]: unknown;

    constructor(path: string, options: OpenOptions, file: unknown) {
    }

    /**
     * The readable stream for the file.
     */
    get readable(): ReadableStream<Uint8Array> {
        throw new Error("Not implemented");
    }

    /**
     * The writeable stream for the file.
     */
    get writeable(): WritableStream<Uint8Array> {
        throw new Error("Not implemented");
    }

    /**
     * Provides information about the file system support for the file.
     */
    get supports(): FsSupports[] {
        return [];
    }

    /**
     * Synchronously dispose of the file.
     */
    [Symbol.dispose](): void {
        return this.closeSync();
    }

    /**
     * Dispose of the file.
     * @returns A promise that resolves when the file is disposed.
     */
    [Symbol.asyncDispose](): Promise<void> {
        return this.close();
    }

    /**
     * Closes the file.
     * @returns A promise that resolves when the file is closed.
     */
    close(): Promise<void> {
        throw new Error("Not implemented");
    }

    /**
     * Synchronously closes the file.
     */
    closeSync(): void {
        throw new Error("Not implemented");
    }

    /**
     * Flushes any pending data and metadata operations
     * of the given file stream to disk.
     * @returns A promise that resolves when the data is flushed.
     */
    flush(): Promise<void> {
        throw new Error("Not implemented");
    }

    /**
     * Synchronously flushes any pending data and metadata operations
     * of the given file stream to disk.
     */
    flushSync(): void {
        throw new Error("Not implemented");
    }

    /**
     * Flushes any pending data operations of
     * the given file stream to disk.
     * @returns A promise that resolves when the data is flushed.
     */
    flushData(): Promise<void> {
        throw new Error("Not implemented");
    }

    /**
     * Synchronously flushes any pending data operations of
     * the given file stream to disk.
     * @returns
     */
    flushDataSync(): void {
        throw new Error("Not implemented");
    }

    /**
     * Acquire an advisory file-system lock for the file.
     * **The current runtime may not support this operation or may require
     * implementation of the `lock` and `unlock` methods.**
     * @param exclusive Acquire an exclusive lock.
     * @returns A promise that resolves when the lock is acquired.
     * @throws An error when not impelemented.
     */
    lock(exclusive?: boolean | undefined): Promise<void> {
        throw new Error("Not implemented");
    }

    /**
     * Synchronously acquire an advisory file-system lock for the file.
     * **The current runtime may not support this operation or may require
     * implementation of the `lock` and `unlock` methods.**
     * @param exclusive Acquire an exclusive lock.
     * @returns A promise that resolves when the lock is acquired.
     * @throws An error when not impelemented.
     */
    lockSync(exclusive?: boolean | undefined): void {
        throw new Error("Not implemented");
    }

    /**
     * Synchronously read from the file into an array buffer (`buffer`).
     *
     * Returns either the number of bytes read during the operation
     * or EOF (`null`) if there was nothing more to read.
     *
     * It is possible for a read to successfully return with `0`
     * bytes read. This does not indicate EOF.
     *
     * It is not guaranteed that the full buffer will be read in
     * a single call.
     * @param buffer The buffer to read into.
     * @returns The number of bytes read or `null` if EOF.
     */
    readSync(buffer: Uint8Array): number | null {
        throw new Error("Not implemented");
    }

    /**
     * Read from the file into an array buffer (`buffer`).
     *
     * Returns either the number of bytes read during the operation
     * or EOF (`null`) if there was nothing more to read.
     *
     * It is possible for a read to successfully return with `0`
     * bytes read. This does not indicate EOF.
     *
     * It is not guaranteed that the full buffer will be read in
     * a single call.
     * @param buffer The buffer to read into.
     * @returns A promise of the number of bytes read or `null` if EOF.
     */
    read(buffer: Uint8Array): Promise<number | null> {
        throw new Error("Not implemented");
    }

    /**
     * Synchronously seek to the given `offset` under mode given by `whence`. The
     * call resolves to the new position within the resource
     * (bytes from the start).
     *
     * **The runtime may not support this operation or may require
     * implementation of the `seek` method.**
     * @param offset The offset to seek to.
     * @param whence The `start`, `current`, or `end` of the steam.
     * @returns The new position within the resource.
     */
    seek(offset: number | bigint, whence?: SeekMode | undefined): Promise<number> {
        throw new Error("Not implemented");
    }

    /**
     * Seek to the given `offset` under mode given by `whence`. The
     * call resolves to the new position within the resource
     * (bytes from the start).
     *
     * **The runtime may not support this operation or may require
     * implementation of the `seek` method.**
     * @param offset The offset to seek to.
     * @param whence The `start`, `current`, or `end` of the steam.
     * @returns The new position within the resource.
     * @throws An error when not impelemented.
     */
    seekSync(offset: number | bigint, whence?: SeekMode): number {
        throw new Error("Not implemented");
    }

    /**
     * Gets the file information for the file.
     * @returns A file information object.
     * @throws An error if the file information cannot be retrieved.
     */
    stat(): Promise<FileInfo> {
        throw new Error("Not implemented");
    }

    /**
     * Synchronously gets the file information for the file.
     * @returns A file information object.
     * @throws An error if the file information cannot be retrieved.
     */
    statSync(): FileInfo {
        throw new Error("Not implemented");
    }

    /**
     * Synchronously write the contents of the array buffer (`buffer`)
     * to the file.
     *
     * Returns the number of bytes written.
     *
     * **It is not guaranteed that the full buffer
     * will be written in a single call.**
     * @param buffer The buffer to write.
     * @returns A promise of the number of bytes written.
     */
    writeSync(buffer: Uint8Array): number {
        throw new Error("Not implemented");
    }

    /**
     * Synchronously write the contents of the array buffer (`buffer`)
     * to the file.
     *
     * Returns the number of bytes written.
     *
     * **It is not guaranteed that the full buffer
     * will be written in a single call.**
     * @param buffer The buffer to write.
     * @returns A promise of the number of bytes written.
     */
    write(buffer: Uint8Array): Promise<number> {
        throw new Error("Not implemented");
    }

    /**
     * Release an advisory file-system lock for the file.
     * **The current runtime may not support this operation or may require
     * implementation of the `lock` and `unlock` methods.**
     * @returns A promise that resolves when the lock is released.
     * @throws An error if not implemented.
     */
    unlock(): Promise<void> {
        throw new Error("Not implemented");
    }

    /**
     * Release an advisory file-system lock for the file.
     * **The current runtime may not support this operation or may require
     * implementation of the `lock` and `unlock` methods.**
     * @throws An error if not implemented.
     */
    unlockSync(): void {
        throw new Error("Not implemented");
    }
}

let klass: typeof FsFile = FsFile;

if (globals.Deno) {
    // deno-lint-ignore no-inner-declarations no-explicit-any
    function translate(whence?: SeekMode): any {
        whence ??= "current";
        switch (whence) {
            case "start":
                return globals.Deno.SeekMode.Start;
            case "current":
                return globals.Deno.SeekMode.Current;
            case "end":
                return globals.Deno.SeekMode.End;
            default:
                return globals.Deno.SeekMode.Current;
        }
    }

    klass = class extends FsFile {
        // deno-lint-ignore no-explicit-any
        #file: any; // Deno.FsFile
        #path: string;
        #supports: FsSupports[] = [];

        constructor(path: string, options: OpenOptions, file: unknown) {
            super(path, options, file);
            this.#file = file;
            this.#path = path;
            const supports: FsSupports[] = ["lock", "seek"];
            if (options.write || options.append) {
                supports.push("write");
            }

            if (options.read) {
                supports.push("read");
            }

            if (options.truncate || options.create) {
                supports.push("truncate");
            }

            this.#supports = supports;
        }

        [key: string]: unknown;

        /**
         * The readable stream for the file.
         */
        override get readable(): ReadableStream<Uint8Array> {
            return this.#file.readable;
        }

        /**
         * The writeable stream for the file.
         */
        override get writeable(): WritableStream<Uint8Array> {
            return this.#file.writable;
        }

        /**
         * Provides information about the file system support for the file.
         */
        override get supports(): FsSupports[] {
            return this.#supports;
        }

        /**
         * Closes the file.
         * @returns A promise that resolves when the file is closed.
         */
        override close(): Promise<void> {
            return Promise.resolve(this.#file.close());
        }

        /**
         * Synchronously closes the file.
         */
        override closeSync(): void {
            this.#file.close();
        }

        /**
         * Flushes any pending data and metadata operations
         * of the given file stream to disk.
         * @returns A promise that resolves when the data is flushed.
         */
        override flush(): Promise<void> {
            return this.#file.sync();
        }

        /**
         * Synchronously flushes any pending data and metadata operations
         * of the given file stream to disk.
         */
        override flushSync(): void {
            return this.#file.syncSync();
        }

        /**
         * Flushes any pending data operations of
         * the given file stream to disk.
         * @returns A promise that resolves when the data is flushed.
         */
        override flushData(): Promise<void> {
            return this.#file.syncData();
        }

        /**
         * Synchronously flushes any pending data operations of
         * the given file stream to disk.
         * @returns
         */
        override flushDataSync(): void {
            return this.#file.syncDataSync();
        }

        /**
         * Acquire an advisory file-system lock for the file.
         * **The current runtime may not support this operation or may require
         * implementation of the `lock` and `unlock` methods.**
         * @param exclusive Acquire an exclusive lock.
         * @returns A promise that resolves when the lock is acquired.
         * @throws An error when not impelemented.
         */
        override lock(exclusive?: boolean | undefined): Promise<void> {
            return this.#file.lock(exclusive);
        }

        /**
         * Synchronously acquire an advisory file-system lock for the file.
         * **The current runtime may not support this operation or may require
         * implementation of the `lock` and `unlock` methods.**
         * @param exclusive Acquire an exclusive lock.
         * @returns A promise that resolves when the lock is acquired.
         * @throws An error when not impelemented.
         */
        override lockSync(exclusive?: boolean | undefined): void {
            return this.#file.lockSync(exclusive);
        }

        /**
         * Synchronously read from the file into an array buffer (`buffer`).
         *
         * Returns either the number of bytes read during the operation
         * or EOF (`null`) if there was nothing more to read.
         *
         * It is possible for a read to successfully return with `0`
         * bytes read. This does not indicate EOF.
         *
         * It is not guaranteed that the full buffer will be read in
         * a single call.
         * @param buffer The buffer to read into.
         * @returns The number of bytes read or `null` if EOF.
         */
        override readSync(buffer: Uint8Array): number | null {
            return this.#file.readSync(buffer);
        }

        /**
         * Read from the file into an array buffer (`buffer`).
         *
         * Returns either the number of bytes read during the operation
         * or EOF (`null`) if there was nothing more to read.
         *
         * It is possible for a read to successfully return with `0`
         * bytes read. This does not indicate EOF.
         *
         * It is not guaranteed that the full buffer will be read in
         * a single call.
         * @param buffer The buffer to read into.
         * @returns A promise of the number of bytes read or `null` if EOF.
         */
        override read(buffer: Uint8Array): Promise<number | null> {
            return this.#file.read(buffer);
        }

        /**
         * Seek to the given `offset` under mode given by `whence`. The
         * call resolves to the new position within the resource
         * (bytes from the start).
         *
         * **The runtime may not support this operation or may require
         * implementation of the `seek` method.**
         * @param offset The offset to seek to.
         * @param whence The `start`, `current`, or `end` of the steam.
         * @returns The new position within the resource.
         * @throws An error when not impelemented.
         */
        override seek(offset: number | bigint, whence?: SeekMode | undefined): Promise<number> {
            return this.#file.seek(offset, translate(whence));
        }

        /**
         * Synchronously seek to the given `offset` under mode given by `whence`. The
         * call resolves to the new position within the resource
         * (bytes from the start).
         *
         * **The runtime may not support this operation or may require
         * implementation of the `seek` method.**
         * @param offset The offset to seek to.
         * @param whence The `start`, `current`, or `end` of the steam.
         * @returns The new position within the resource.
         */
        override seekSync(offset: number | bigint, whence?: SeekMode): number {
            return this.#file.seekSync(offset, translate(whence));
        }

        /**
         * Gets the file information for the file.
         * @returns A file information object.
         * @throws An error if the file information cannot be retrieved.
         */
        override stat(): Promise<FileInfo> {
            // deno-lint-ignore no-explicit-any
            return this.#file.stat().then((stat: any) => {
                const p = this.#path;
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
                } as FileInfo;
            });
        }

        /**
         * Synchronously gets the file information for the file.
         * @returns A file information object.
         * @throws An error if the file information cannot be retrieved.
         */
        override statSync(): FileInfo {
            const p = this.#path;
            const stat = this.#file.statSync();
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
            } as FileInfo;
        }

        /**
         * Synchronously write the contents of the array buffer (`buffer`)
         * to the file.
         *
         * Returns the number of bytes written.
         *
         * **It is not guaranteed that the full buffer
         * will be written in a single call.**
         * @param buffer The buffer to write.
         * @returns A promise of the number of bytes written.
         */
        override writeSync(buffer: Uint8Array): number {
            return this.#file.writeSync(buffer);
        }

        /**
         * Synchronously write the contents of the array buffer (`buffer`)
         * to the file.
         *
         * Returns the number of bytes written.
         *
         * **It is not guaranteed that the full buffer
         * will be written in a single call.**
         * @param buffer The buffer to write.
         * @returns A promise of the number of bytes written.
         */
        override write(buffer: Uint8Array): Promise<number> {
            return this.#file.write(buffer);
        }

        /**
         * Release an advisory file-system lock for the file.
         * **The current runtime may not support this operation or may require
         * implementation of the `lock` and `unlock` methods.**
         * @returns A promise that resolves when the lock is released.
         * @throws An error if not implemented.
         */
        override unlock(): Promise<void> {
            return this.#file.unlock();
        }

        /**
         * Release an advisory file-system lock for the file.
         * **The current runtime may not support this operation or may require
         * implementation of the `lock` and `unlock` methods.**
         * @throws An error if not implemented.
         */
        override unlockSync(): void {
            this.#file.unlockSync();
        }
    };
} else if (globals.process) {
    const fs = loadFs();

    klass = class extends FsFile {
        #fd: number;
        #path: string;
        #supports: FsSupports[] = [];
        #readable?: ReadableStream<Uint8Array>;
        #writeable?: WritableStream<Uint8Array>;

        constructor(path: string, options: OpenOptions, file: unknown) {
            super(path, options, file);
            this.#fd = file as number;
            this.#path = path;
            const supports: FsSupports[] = ["lock", "seek"];
            if (options.write || options.append) {
                supports.push("write");
            }

            if (options.read) {
                supports.push("read");
            }

            if (options.truncate || options.create) {
                supports.push("truncate");
            }
            this.#supports = supports;
        }

        /**
         * The readable stream for the file.
         */
        override get readable(): ReadableStream<Uint8Array> {
            if (!fs) {
                throw new Error("No suitable file system module found.");
            }
            const fd = this.#fd;
            this.#readable ??= new ReadableStream({
                start: (controller) => {
                    while (true) {
                        const buf = new Uint8Array(1024);
                        const size = this.readSync(buf);
                        if (size === null) {
                            controller.close();
                            this.closeSync();
                            break;
                        }
                        controller.enqueue(buf.slice(0, size));
                    }
                },
                cancel() {
                    fs.closeSync(fd);
                },
            });

            return this.#readable;
        }

        /**
         * The writeable stream for the file.
         */
        override get writeable(): WritableStream<Uint8Array> {
            if (!fs) {
                throw new Error("No suitable file system module found.");
            }
            const fd = this.#fd;
            this.#writeable ??= new WritableStream({
                write(chunk, controller) {
                    return new Promise((resolve) => {
                        fs.write(fd, chunk, (err) => {
                            if (err) {
                                controller.error(err);
                                return;
                            }

                            resolve();
                        });
                    });
                },
                close() {
                    fs.closeSync(fd);
                },
            });

            return this.writeable;
        }

        /**
         * Provides information about the file system support for the file.
         */
        override get supports(): FsSupports[] {
            return this.#supports;
        }
        /**
         * Synchronously closes the file.
         */
        override closeSync(): void {
            if (!fs) {
                throw new Error("No suitable file system module found.");
            }
            fs.closeSync(this.#fd);
        }

        /**
         * Closes the file.
         * @returns A promise that resolves when the file is closed.
         */
        override close(): Promise<void> {
            if (!fs) {
                throw new Error("No suitable file system module found.");
            }
            return new Promise((resolve, reject) => {
                fs.close(this.#fd, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
            });
        }

        /**
         * Flushes any pending data and metadata operations
         * of the given file stream to disk.
         * @returns A promise that resolves when the data is flushed.
         */
        override flush(): Promise<void> {
            if (!fs) {
                throw new Error("No suitable file system module found.");
            }
            return new Promise((resolve, reject) => {
                fs.fsync(this.#fd, (err) => {
                    if (err) reject(err);
                    resolve();
                });
            });
        }

        /**
         * Synchronously flushes any pending data and metadata operations
         * of the given file stream to disk.
         */
        override flushSync(): void {
            if (!fs) {
                throw new Error("No suitable file system module found.");
            }
            fs.fsyncSync(this.#fd);
        }

        /**
         * Flushes any pending data operations of
         * the given file stream to disk.
         * @returns A promise that resolves when the data is flushed.
         */
        override flushData(): Promise<void> {
            if (!fs) {
                throw new Error("No suitable file system module found.");
            }
            return new Promise((resolve, reject) => {
                fs.fdatasync(this.#fd, (err) => {
                    if (err) reject(err);
                    resolve();
                });
            });
        }

        /**
         * Synchronously flushes any pending data operations of
         * the given file stream to disk.
         * @returns
         */
        override flushDataSync(): void {
            if (!fs) {
                throw new Error("No suitable file system module found.");
            }
            return fs.fdatasyncSync(this.#fd);
        }

        /**
         * Acquire an advisory file-system lock for the file.
         * **The current runtime may not support this operation or may require
         * implementation of the `lock` and `unlock` methods.**
         * @param exclusive Acquire an exclusive lock.
         * @returns A promise that resolves when the lock is acquired.
         * @throws An error when not impelemented.
         */
        override lock(exclusive?: boolean | undefined): Promise<void> {
            return ext.lockFile(this.#fd, exclusive);
        }

        /**
         * Synchronously acquire an advisory file-system lock for the file.
         * **The current runtime may not support this operation or may require
         * implementation of the `lock` and `unlock` methods.**
         * @param exclusive Acquire an exclusive lock.
         * @returns A promise that resolves when the lock is acquired.
         * @throws An error when not impelemented.
         */
        override lockSync(exclusive?: boolean | undefined): void {
            return ext.lockFileSync(this.#fd, exclusive);
        }

        /**
         * Synchronously read from the file into an array buffer (`buffer`).
         *
         * Returns either the number of bytes read during the operation
         * or EOF (`null`) if there was nothing more to read.
         *
         * It is possible for a read to successfully return with `0`
         * bytes read. This does not indicate EOF.
         *
         * It is not guaranteed that the full buffer will be read in
         * a single call.
         * @param buffer The buffer to read into.
         * @returns The number of bytes read or `null` if EOF.
         */
        override readSync(buffer: Uint8Array): number | null {
            if (!fs) {
                throw new Error("No suitable file system module found.");
            }
            const v = fs.readSync(this.#fd, buffer);
            if (v < 1) {
                return null;
            }

            return v;
        }

        /**
         * Read from the file into an array buffer (`buffer`).
         *
         * Returns either the number of bytes read during the operation
         * or EOF (`null`) if there was nothing more to read.
         *
         * It is possible for a read to successfully return with `0`
         * bytes read. This does not indicate EOF.
         *
         * It is not guaranteed that the full buffer will be read in
         * a single call.
         * @param buffer The buffer to read into.
         * @returns A promise of the number of bytes read or `null` if EOF.
         */
        override read(p: Uint8Array): Promise<number | null> {
            if (!fs) {
                throw new Error("No suitable file system module found.");
            }
            return new Promise((resolve, reject) => {
                fs.read(this.#fd, p, 0, p.length, null, (err, size) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(size);
                });
            });
        }

        /**
         * Synchronously seek to the given `offset` under mode given by `whence`. The
         * call resolves to the new position within the resource
         * (bytes from the start).
         *
         * **The runtime may not support this operation or may require
         * implementation of the `seek` method.**
         * @param offset The offset to seek to.
         * @param whence The `start`, `current`, or `end` of the steam.
         * @returns The new position within the resource.
         */
        override seekSync(offset: number | bigint, whence?: SeekMode | undefined): number {
            return ext.seekFileSync(this.#fd, offset, whence);
        }

        /**
         * Seek to the given `offset` under mode given by `whence`. The
         * call resolves to the new position within the resource
         * (bytes from the start).
         *
         * **The runtime may not support this operation or may require
         * implementation of the `seek` method.**
         * @param offset The offset to seek to.
         * @param whence The `start`, `current`, or `end` of the steam.
         * @returns The new position within the resource.
         * @throws An error when not impelemented.
         */
        override seek(offset: number | bigint, whence?: SeekMode | undefined): Promise<number> {
            return ext.seekFile(this.#fd, offset, whence);
        }

        /**
         * Gets the file information for the file.
         * @returns A file information object.
         * @throws An error if the file information cannot be retrieved.
         */
        override stat(): Promise<FileInfo> {
            if (!fs) {
                throw new Error("No suitable file system module found.");
            }
            return new Promise((resolve, reject) => {
                fs.fstat(this.#fd, (err, stat) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    const p = this.#path;
                    resolve({
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
                    } as FileInfo);
                });
            });
        }

        /**
         * Synchronously gets the file information for the file.
         * @returns A file information object.
         * @throws An error if the file information cannot be retrieved.
         */
        override statSync(): FileInfo {
            if (!fs) {
                throw new Error("No suitable file system module found.");
            }
            const p = this.#path;
            const stat = fs.fstatSync(this.#fd);
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
            } as FileInfo;
        }

        /**
         * Synchronously write the contents of the array buffer (`buffer`)
         * to the file.
         *
         * Returns the number of bytes written.
         *
         * **It is not guaranteed that the full buffer
         * will be written in a single call.**
         * @param buffer The buffer to write.
         * @returns A promise of the number of bytes written.
         */
        override writeSync(buffer: Uint8Array): number {
            if (!fs) {
                throw new Error("No suitable file system module found.");
            }
            return fs.writeSync(this.#fd, buffer);
        }

        /**
         * Synchronously write the contents of the array buffer (`buffer`)
         * to the file.
         *
         * Returns the number of bytes written.
         *
         * **It is not guaranteed that the full buffer
         * will be written in a single call.**
         * @param buffer The buffer to write.
         * @returns A promise of the number of bytes written.
         */
        override write(p: Uint8Array): Promise<number> {
            if (!fs) {
                throw new Error("No suitable file system module found.");
            }
            return new Promise((resolve, reject) => {
                fs.write(this.#fd, p, (err, size) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(size);
                });
            });
        }

        /**
         * Release an advisory file-system lock for the file.
         * **The current runtime may not support this operation or may require
         * implementation of the `lock` and `unlock` methods.**
         * @returns A promise that resolves when the lock is released.
         * @throws An error if not implemented.
         */
        override unlock(): Promise<void> {
            return ext.unlockFile(this.#fd);
        }

        /**
         * Release an advisory file-system lock for the file.
         * **The current runtime may not support this operation or may require
         * implementation of the `lock` and `unlock` methods.**
         * @throws An error if not implemented.
         */
        override unlockSync(): void {
            return ext.unlockFileSync(this.#fd);
        }

        /**
         * Synchronously dispose of the file.
         */
        override [Symbol.dispose](): void {
            return this.closeSync();
        }

        /**
         * Dispose of the file.
         * @returns A promise that resolves when the file is disposed.
         */
        override [Symbol.asyncDispose](): Promise<void> {
            return this.close();
        }
    };
}

let fn: typeof import("node:fs").openSync | undefined = undefined;
let fnAsync: typeof import("node:fs").open | undefined = undefined;

/**
 * Open a file and resolve to an instance of {@linkcode FsFile}. The
 * file does not need to previously exist if using the `create` or `createNew`
 * open options. The caller may have the resulting file automatically closed
 * by the runtime once it's out of scope by declaring the file variable with
 * the `using` keyword.
 *
 * ```ts
 * import { open } from "@frostyeti/fs"
 * using file = await open("/foo/bar.txt", { read: true, write: true });
 * // Do work with file
 * ```
 *
 * Alternatively, the caller may manually close the resource when finished with
 * it.
 *
 * ```ts
 * import { open } from "@frostyeti/fs"
 * const file = await open("/foo/bar.txt", { read: true, write: true });
 * // Do work with file
 * file.close();
 * ```
 *
 * Requires `allow-read` and/or `allow-write` permissions depending on
 * options.
 *
 * @tags allow-read, allow-write
 * @category File System
 */
export async function open(path: string | URL, options: OpenOptions): Promise<FsFile> {
    if (globals.Deno) {
        const file = await globals.Deno.open(path, options);
        const p = path instanceof URL ? path.toString() : path;

        return new klass(p, options, file);
    }

    if (!fnAsync) {
        fnAsync = loadFs()?.open;
        if (!fnAsync) {
            throw new Error("No suitable file system module found.");
        }
    }

    let flags = "r";
    if (options.write) {
        flags = "w";
    } else if (options.append) {
        flags = "a";
    } else if (options.read) {
        flags = "r";
    } else {
        flags = "r";
    }

    if (options.createNew && (options.write || options.append)) {
        flags += "x+";
    } else if ((options.create || options.truncate) && (options.write || options.append)) {
        flags += "+";
    }

    console.log(path, flags, options.mode);

    return new Promise<FsFile>((resolve, reject) => {
        fnAsync!(path, flags, options.mode, (err, fd) => {
            if (err) {
                reject(err);
                return;
            }
            const p = path instanceof URL ? path.toString() : path;
            resolve(new klass(p, options, fd));
        });
    });
}

/**
 * Synchronously open a file and return an instance of
 * {@linkcode Deno.FsFile}. The file does not need to previously exist if
 * using the `create` or `createNew` open options. The caller may have the
 * resulting file automatically closed by the runtime once it's out of scope
 * by declaring the file variable with the `using` keyword.
 *
 * ```ts
 * import { openSync } from "@frostyeti/fs";
 * using file = openSync("/foo/bar.txt", { read: true, write: true });
 * // Do work with file
 * ```
 *
 * Alternatively, the caller may manually close the resource when finished with
 * it.
 *
 * ```ts
 * import { openSync } from "@frostyeti/fs";
 * const file = openSync("/foo/bar.txt", { read: true, write: true });
 * // Do work with file
 * file.close();
 * ```
 *
 * Requires `allow-read` and/or `allow-write` permissions depending on
 * options.
 *
 * @tags allow-read, allow-write
 * @category File System
 */
export function openSync(path: string | URL, options: OpenOptions): FsFile {
    if (globals.Deno) {
        const file = globals.Deno.openSync(path, options);
        const p = path instanceof URL ? path.toString() : path;
        return new klass(p, options, file);
    }

    if (!fn) {
        fn = loadFs()?.openSync;
        if (!fn) {
            throw new Error("No suitable file system module found.");
        }
    }

    let flags = "r";
    if (options.write) {
        flags = "w";
    } else if (options.append) {
        flags = "a";
    } else if (options.read) {
        flags = "r";
    } else {
        flags = "r";
    }

    if (options.createNew && (options.write || options.append)) {
        flags += "x+";
    } else if ((options.create || options.truncate) && (options.write || options.append)) {
        flags += "+";
    }

    console.log(path, flags, options.mode);

    // if this throws, the file does not exist
    // keeps the functionality in line with Deno
    if (!options.create) {
        statSync(path);
    }

    const fd = fn(path, flags, options.mode);

    const p = path instanceof URL ? path.toString() : path;
    return new klass(p, options, fd);
}
