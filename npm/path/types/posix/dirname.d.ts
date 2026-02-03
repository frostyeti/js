/**
 * Return the directory path of a `path`.
 *
 * @example Usage
 * ```ts
 * import { dirname } from "@frostyeti/path/posix/dirname";
 * import { equal } from "@frostyeti/assert";
 *
 * equal(dirname("/home/user/Documents/"), "/home/user");
 * equal(dirname("/home/user/Documents/image.png"), "/home/user/Documents");
 * equal(dirname("https://deno.land/std/path/mod.ts"), "https://deno.land/std/path");
 * ```
 *
 * @example Working with URLs
 *
 * ```ts
 * import { dirname } from "@frostyeti/path/posix/dirname";
 * import { equal } from "@frostyeti/assert";
 *
 * equal(dirname("https://deno.land/std/path/mod.ts"), "https://deno.land/std/path");
 * equal(dirname("https://deno.land/std/path/mod.ts?a=b"), "https://deno.land/std/path");
 * equal(dirname("https://deno.land/std/path/mod.ts#header"), "https://deno.land/std/path");
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `dirname` from `@frostyeti/path/posix/unstable-dirname`.
 *
 * @param path The path to get the directory from.
 * @returns The directory path.
 */
export declare function dirname(path: string | URL): string;
