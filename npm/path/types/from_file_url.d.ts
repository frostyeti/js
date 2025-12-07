/**
 * Converts a file URL to a path string.
 *
 * @example Usage
 * ```ts
 * import { fromFileUrl } from "@frostyeti/path/from-file-url";
 * import { equal } from "@frostyeti/assert";
 *
 * if (Deno.build.os === "windows") {
 *   equal(fromFileUrl("file:///home/foo"), "\\home\\foo");
 *   equal(fromFileUrl("file:///C:/Users/foo"), "C:\\Users\\foo");
 *   equal(fromFileUrl("file://localhost/home/foo"), "\\home\\foo");
 * } else {
 *   equal(fromFileUrl("file:///home/foo"), "/home/foo");
 * }
 * ```
 *
 * @param url The file URL to convert to a path.
 * @returns The path string.
 */
export declare function fromFileUrl(url: string | URL): string;
