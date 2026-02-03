/**
 * Return the directory path of a `path`.
 *
 * @example Usage
 * ```ts
 * import { dirname } from "@frostyeti/path/windows/dirname";
 * import { equals } from "@frostyeti/assert";
 *
 * equals(dirname("C:\\foo\\bar\\baz.ext"), "C:\\foo\\bar");
 * equals(dirname(new URL("file:///C:/foo/bar/baz.ext")), "C:\\foo\\bar");
 * ```
 *
 * @param path The path to get the directory from.
 * @returns The directory path.
 */
export declare function dirname(path: string | URL): string;
