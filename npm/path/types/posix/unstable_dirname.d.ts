/**
 * Return the directory path of a file URL.
 *
 * @experimental **UNSTABLE**: New API, yet to be vetted.
 *
 * @example Usage
 * ```ts
 * import { dirname } from "@frostyeti/path/posix/unstable-dirname";
 * import { equal } from "@frostyeti/assert";
 *
 * equal(dirname("/home/user/Documents/"), "/home/user");
 * equal(dirname("/home/user/Documents/image.png"), "/home/user/Documents");
 * equal(dirname(new URL("file:///home/user/Documents/image.png")), "/home/user/Documents");
 * ```
 *
 * @param path The file url to get the directory from.
 * @returns The directory path.
 */
export declare function dirname(path: string | URL): string;
