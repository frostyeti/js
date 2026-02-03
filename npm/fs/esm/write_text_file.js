/**
 * The `write-texto-file` module provides functions to write text data to a file.
 *
 * @module
 */
import { getNodeFs, globals } from "./globals.js";
import { getWriteFsFlag } from "./_get_fs_flag.js";
import { mapError } from "./_map_error.js";
/**
 * Write string `data` to the given `path`, by default creating a new file if
 * needed, else overwriting.
 *
 * Requires `allow-write` permission, and `allow-read` if `options.create` is
 * `false`.
 *
 * @example Usage
 * ```ts ignore
 * import { writeTextFile } from "@frostyeti/fs/unstable-write-text-file";
 * await writeTextFile("hello1.txt", "Hello world\n");  // overwrite "hello1.txt" or create it
 * ```
 *
 * @tags allow-read, allow-write
 *
 * @param path The path of the file that `data` is written to.
 * @param data A UTF-8 string or a stream of UTF-8 strings.
 * @param options Options for writing files. See {@linkcode WriteFileOptions}.
 */
export async function writeTextFile(path, data, options) {
  if (globals.Deno) {
    return await globals.Deno.writeTextFile(path, data, options);
  } else {
    const { append = false, create = true, createNew = false, mode, signal } = options ?? {};
    const flag = getWriteFsFlag({ append, create, createNew });
    try {
      await getNodeFs().promises.writeFile(path, data, {
        encoding: "utf-8",
        flag,
        signal,
      });
      if (mode != null) {
        await getNodeFs().promises.chmod(path, mode);
      }
    } catch (error) {
      throw mapError(error);
    }
  }
}
/**
 * Synchronously write string `data` to the given `path`, by default creating
 * a new file if needed, else overwriting.
 *
 * Requires `allow-write` permission, and `allow-read` if `options.create` is
 * `false`.
 *
 * @example Usage
 * ```ts ignore
 * import { writeTextFileSync } from "@frostyeti/fs/unstable-write-text-file";
 * writeTextFileSync("hello1.txt", "Hello world\n");  // overwrite "hello1.txt" or create it
 * ```
 *
 * @tags allow-read, allow-write
 *
 * @param path The path of the file that `data` is written to.
 * @param data A UTF-8 string.
 * @param options Options for writing files. See {@linkcode WriteFileOptions}.
 */
export function writeTextFileSync(path, data, options) {
  if (globals.Deno) {
    return globals.Deno.writeTextFileSync(path, data, options);
  } else {
    const { append = false, create = true, createNew = false, mode } = options ?? {};
    const flag = getWriteFsFlag({ append, create, createNew });
    try {
      getNodeFs().writeFileSync(path, data, { encoding: "utf-8", flag });
      if (mode != null) {
        getNodeFs().chmodSync(path, mode);
      }
    } catch (error) {
      throw mapError(error);
    }
  }
}
