/**
 * The `open` module provides a function to open files
 * in a file system. It supports both synchronous and asynchronous
 * operations such as read, write, and seek.
 *
 * @module
 */
import type { FileInfo, FsSupports, OpenOptions, SeekMode } from "./types.js";
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
  seekFile(
    fd: number,
    offset: number | bigint,
    whence?: SeekMode,
  ): Promise<number>;
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
export declare const ext: Extras;
export declare class FsFile {
  [key: string]: unknown;
  constructor(path: string, options: OpenOptions, file: unknown);
  /**
   * The readable stream for the file.
   */
  get readable(): ReadableStream<Uint8Array>;
  /**
   * The writeable stream for the file.
   */
  get writeable(): WritableStream<Uint8Array>;
  /**
   * Provides information about the file system support for the file.
   */
  get supports(): FsSupports[];
  /**
   * Synchronously dispose of the file.
   */
  [Symbol.dispose](): void;
  /**
   * Dispose of the file.
   * @returns A promise that resolves when the file is disposed.
   */
  [Symbol.asyncDispose](): Promise<void>;
  /**
   * Closes the file.
   * @returns A promise that resolves when the file is closed.
   */
  close(): Promise<void>;
  /**
   * Synchronously closes the file.
   */
  closeSync(): void;
  /**
   * Flushes any pending data and metadata operations
   * of the given file stream to disk.
   * @returns A promise that resolves when the data is flushed.
   */
  flush(): Promise<void>;
  /**
   * Synchronously flushes any pending data and metadata operations
   * of the given file stream to disk.
   */
  flushSync(): void;
  /**
   * Flushes any pending data operations of
   * the given file stream to disk.
   * @returns A promise that resolves when the data is flushed.
   */
  flushData(): Promise<void>;
  /**
   * Synchronously flushes any pending data operations of
   * the given file stream to disk.
   * @returns
   */
  flushDataSync(): void;
  /**
   * Acquire an advisory file-system lock for the file.
   * **The current runtime may not support this operation or may require
   * implementation of the `lock` and `unlock` methods.**
   * @param exclusive Acquire an exclusive lock.
   * @returns A promise that resolves when the lock is acquired.
   * @throws An error when not impelemented.
   */
  lock(exclusive?: boolean | undefined): Promise<void>;
  /**
   * Synchronously acquire an advisory file-system lock for the file.
   * **The current runtime may not support this operation or may require
   * implementation of the `lock` and `unlock` methods.**
   * @param exclusive Acquire an exclusive lock.
   * @returns A promise that resolves when the lock is acquired.
   * @throws An error when not impelemented.
   */
  lockSync(exclusive?: boolean | undefined): void;
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
  readSync(buffer: Uint8Array): number | null;
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
  read(buffer: Uint8Array): Promise<number | null>;
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
  seek(offset: number | bigint, whence?: SeekMode | undefined): Promise<number>;
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
  seekSync(offset: number | bigint, whence?: SeekMode): number;
  /**
   * Gets the file information for the file.
   * @returns A file information object.
   * @throws An error if the file information cannot be retrieved.
   */
  stat(): Promise<FileInfo>;
  /**
   * Synchronously gets the file information for the file.
   * @returns A file information object.
   * @throws An error if the file information cannot be retrieved.
   */
  statSync(): FileInfo;
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
  writeSync(buffer: Uint8Array): number;
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
  write(buffer: Uint8Array): Promise<number>;
  /**
   * Release an advisory file-system lock for the file.
   * **The current runtime may not support this operation or may require
   * implementation of the `lock` and `unlock` methods.**
   * @returns A promise that resolves when the lock is released.
   * @throws An error if not implemented.
   */
  unlock(): Promise<void>;
  /**
   * Release an advisory file-system lock for the file.
   * **The current runtime may not support this operation or may require
   * implementation of the `lock` and `unlock` methods.**
   * @throws An error if not implemented.
   */
  unlockSync(): void;
}
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
export declare function open(
  path: string | URL,
  options: OpenOptions,
): Promise<FsFile>;
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
export declare function openSync(
  path: string | URL,
  options: OpenOptions,
): FsFile;
