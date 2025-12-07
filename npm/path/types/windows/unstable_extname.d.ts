/**
 * Return the extension of the `path` with leading period.
 *
 * @experimental **UNSTABLE**: New API, yet to be vetted.
 *
 * @example Usage
 * ```ts
 * import { extname } from "@frostyeti/path/windows/unstable-extname";
 * import { equal } from "@frostyeti/assert";
 *
 * equal(extname("file.ts"), ".ts");
 * equal(extname(new URL("file:///C:/foo/bar/baz.ext")), ".ext");
 * ```
 *
 * @param path The path to get the extension from.
 * @returns The extension of the `path`.
 */
export declare function extname(path: string | URL): string;
