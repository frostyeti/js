/**
 * The `read-link` module provides functions to read the target of a symbolic link.
 *
 * @module
 */
/**
 * Resolves to the path destination of the named symbolic link.
 *
 * Throws Error if called with a hard link.
 *
 * Requires `allow-read` permission.
 *
 * @example Usage
 * ```ts ignore
 * import { readlink } from "@frostyeti/fs/readlink";
 * import { symlink } from "@frostyeti/fs/symlink";
 * await symlink("./test.txt", "./test_link.txt");
 * const target = await readlink("./test_link.txt"); // full path of ./test.txt
 * ```
 *
 * @tags allow-read
 *
 * @param path The path of the symbolic link.
 * @returns A promise that resolves to the file path pointed by the symbolic
 * link.
 */
export declare function readlink(path: string | URL): Promise<string>;
/**
 * Synchronously returns the path destination of the named symbolic link.
 *
 * Throws Error if called with a hard link.
 *
 * Requires `allow-read` permission.
 *
 * @example Usage
 * ```ts ignore
 * import { readlinkSync } from "@frostyeti/fs/readlink";
 * import { symlinkSync } from "@frostyeti/fs/symlink";
 * symlinkSync("./test.txt", "./test_link.txt");
 * const target = readlinkSync("./test_link.txt"); // full path of ./test.txt
 * ```
 *
 * @tags allow-read
 *
 * @param path The path of the symbolic link.
 * @returns The file path pointed by the symbolic link.
 */
export declare function readlinkSync(path: string | URL): string;
