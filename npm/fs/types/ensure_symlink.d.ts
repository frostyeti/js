/**
 * Asynchronously ensures that the link exists, and points to a valid file. If
 * the directory structure does not exist, it is created. If the link already
 * exists, it is not modified but error is thrown if it is not point to the
 * given target.
 *
 * Requires the `--allow-read` and `--allow-write` flag when using Deno.
 *
 * @param target The source file path as a string or URL.
 * @param linkName The destination link path as a string or URL.
 * @returns A void promise that resolves once the link exists.
 *
 * @example
 * ```ts
 * import { ensureSymlink } from "@frostyeti/fs";
 *
 * await ensureSymlink("./folder/targetFile.dat", "./folder/targetFile.link.dat");
 * ```
 */
export declare function ensureSymlink(
  target: string | URL,
  linkName: string | URL,
): Promise<void>;
/**
 * Synchronously ensures that the link exists, and points to a valid file. If
 * the directory structure does not exist, it is created. If the link already
 * exists, it is not modified but error is thrown if it is not point to the
 * given target.
 *
 * Requires the `--allow-read` and `--allow-write` flag when using Deno.
 *
 * @param target The source file path as a string or URL.
 * @param linkName The destination link path as a string or URL.
 * @returns A void value that returns once the link exists.
 *
 * @example
 * ```ts
 * import { ensureSymlinkSync } from "@frostyeti/fs";
 *
 * ensureSymlinkSync("./folder/targetFile.dat", "./folder/targetFile.link.dat");
 * ```
 */
export declare function ensureSymlinkSync(
  target: string | URL,
  linkName: string | URL,
): void;
