/**
 * Join all given a sequence of `paths`, then normalizes the resulting path.
 *
 * @experimental **UNSTABLE**: New API, yet to be vetted.
 *
 * @example Usage
 * ```ts
 * import { join } from "@frostyeti/path/unstable-join";
 * import { equal } from "@frostyeti/assert";
 *
 * if (Deno.build.os === "windows") {
 *   const path = join(new URL("file:///C:/foo"), "bar", "baz/asdf", "quux", "..");
 *   equal(path, "C:\\foo\\bar\\baz\\asdf");
 * } else {
 *   const path = join(new URL("file:///foo"), "bar", "baz/asdf", "quux", "..");
 *   equal(path, "/foo/bar/baz/asdf");
 * }
 * ```
 *
 * @param path The path to join. This can be string or file URL.
 * @param paths The paths to join.
 * @returns The joined path.
 */
export declare function join(path?: URL | string, ...paths: string[]): string;
