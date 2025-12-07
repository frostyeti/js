/**
 * Return the directory path of a file URL.
 *
 * @experimental **UNSTABLE**: New API, yet to be vetted.
 *
 * @example Usage
 * ```ts
 * import { dirname } from "@frostyeti/path/unstable-dirname";
 * import { equal } from "@frostyeti/assert";
 *
 * if (Deno.build.os === "windows") {
 *   equal(dirname("C:\\home\\user\\Documents\\image.png"), "C:\\home\\user\\Documents");
 *   equal(dirname(new URL("file:///C:/home/user/Documents/image.png")), "C:\\home\\user\\Documents");
 * } else {
 *   equal(dirname("/home/user/Documents/image.png"), "/home/user/Documents");
 *   equal(dirname(new URL("file:///home/user/Documents/image.png")), "/home/user/Documents");
 * }
 * ```
 *
 * @param path Path to extract the directory from.
 * @returns The directory path.
 */
export declare function dirname(path: string | URL): string;
