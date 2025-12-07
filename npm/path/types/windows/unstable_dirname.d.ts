/**
 * Return the directory path of a file URL.
 *
 * @experimental **UNSTABLE**: New API, yet to be vetted.
 *
 * @example Usage
 * ```ts
 * import { dirname } from "@frostyeti/path/windows/unstable-dirname";
 * import { equal } from "@frostyeti/assert";
 *
 * equal(dirname("C:\\foo\\bar\\baz.ext"), "C:\\foo\\bar");
 * equal(dirname(new URL("file:///C:/foo/bar/baz.ext")), "C:\\foo\\bar");
 * ```
 *
 * @param path The path to get the directory from.
 * @returns The directory path.
 */
export declare function dirname(path: string | URL): string;
