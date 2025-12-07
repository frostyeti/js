/**
 * Join all given a sequence of `paths`,then normalizes the resulting path.
 *
 * @example Usage
 * ```ts
 * import { join } from "@frostyeti/path/posix/join";
 * import { equal } from "@frostyeti/assert";
 *
 * const path = join("/foo", "bar", "baz/asdf", "quux", "..");
 * equal(path, "/foo/bar/baz/asdf");
 * ```
 *
 * @example Working with URLs
 * ```ts
 * import { join } from "@frostyeti/path/posix/join";
 * import { equal } from "@frostyeti/assert";
 *
 * const url = new URL("https://deno.land");
 * url.pathname = join("std", "path", "mod.ts");
 * equal(url.href, "https://deno.land/std/path/mod.ts");
 *
 * url.pathname = join("//std", "path/", "/mod.ts");
 * equal(url.href, "https://deno.land/std/path/mod.ts");
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `join` from `@frostyeti/path/posix/unstable-join`.
 *
 * @param paths The paths to join.
 * @returns The joined path.
 */
export declare function join(...paths: string[]): string;
