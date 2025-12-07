import type { ParsedPath } from "../types.js";
export type { ParsedPath } from "../types.js";
/**
 * Return a `ParsedPath` object of the `path`.
 *
 * @example Usage
 * ```ts
 * import { parse } from "@frostyeti/path/windows/parse";
 * import { equal } from "@frostyeti/assert";
 *
 * const parsed = parse("C:\\foo\\bar\\baz.ext");
 * equal(parsed, {
 *   root: "C:\\",
 *   dir: "C:\\foo\\bar",
 *   base: "baz.ext",
 *   ext: ".ext",
 *   name: "baz",
 * });
 * ```
 *
 * @param path The path to parse.
 * @returns The `ParsedPath` object.
 */
export declare function parse(path: string): ParsedPath;
