/**
 * The `read-link` module provides functions to read the target of a symbolic link.
 *
 * @module
 */
import { mapError } from "./_map_error.js";
import { getNodeFs, globals } from "./globals.js";
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
export async function readlink(path) {
  if (globals.Deno) {
    return globals.Deno.readLink(path);
  }
  try {
    return await getNodeFs().promises.readlink(path);
  } catch (error) {
    throw mapError(error);
  }
}
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
export function readlinkSync(path) {
  if (globals.Deno) {
    return globals.Deno.readLinkSync(path);
  }
  try {
    return getNodeFs().readlinkSync(path);
  } catch (error) {
    throw mapError(error);
  }
}
