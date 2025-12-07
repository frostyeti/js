/**
 * Return the extension of the `path` with leading period.
 *
 * Note: Hashes and query parameters are ignore when constructing a URL.
 *
 * @experimental **UNSTABLE**: New API, yet to be vetted.
 *
 * @example Usage
 *
 * ```ts
 * import { extname } from "@frostyeti/path/posix/unstable-extname";
 * import { equal } from "@frostyeti/assert";
 *
 * equal(extname("/home/user/Documents/file.ts"), ".ts");
 * equal(extname("/home/user/Documents/"), "");
 * equal(extname("/home/user/Documents/image.png"), ".png");
 * equal(extname(new URL("file:///home/user/Documents/file.ts")), ".ts");
 * equal(extname(new URL("file:///home/user/Documents/file.ts?a=b")), ".ts");
 * equal(extname(new URL("file:///home/user/Documents/file.ts#header")), ".ts");
 * ```
 *
 * @param path The path to get the extension from.
 * @returns The extension (ex. for `file.ts` returns `.ts`).
 */
export declare function extname(path: string | URL): string;
