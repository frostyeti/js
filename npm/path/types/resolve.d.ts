/**
 * Resolves path segments into a path.
 *
 * @example Usage
 * ```ts
 * import { resolve } from "@frostyeti/path/resolve";
 * import { equal } from "@frostyeti/assert";
 *
 * if (Deno.build.os === "windows") {
 *   equal(resolve("C:\\foo", "bar", "baz"), "C:\\foo\\bar\\baz");
 *   equal(resolve("C:\\foo", "C:\\bar", "baz"), "C:\\bar\\baz");
 * } else {
 *   equal(resolve("/foo", "bar", "baz"), "/foo/bar/baz");
 *   equal(resolve("/foo", "/bar", "baz"), "/bar/baz");
 * }
 * ```
 *
 * @param pathSegments Path segments to process to path.
 * @returns The resolved path.
 */
export declare function resolve(...pathSegments: string[]): string;
