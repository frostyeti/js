/**
 * Return the directory path of a path.
 *
 * @example Usage
 * ```ts
 * import { dirname } from "@frostyeti/path/dirname";
 * import { equal } from "@frostyeti/assert";
 *
 * if (Deno.build.os === "windows") {
 *   equal(dirname("C:\\home\\user\\Documents\\image.png"), "C:\\home\\user\\Documents");
 * } else {
 *   equal(dirname("/home/user/Documents/image.png"), "/home/user/Documents");
 * }
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `dirname` from `@frostyeti/path/unstable-dirname`.
 *
 * @param path Path to extract the directory from.
 * @returns The directory path.
 */
export declare function dirname(path: string): string;
