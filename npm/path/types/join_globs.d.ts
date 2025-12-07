import type { GlobOptions } from "./_common/glob_to_reg_exp.js";
export type { GlobOptions };
/**
 * Joins a sequence of globs, then normalizes the resulting glob.
 *
 * Behaves like {@linkcode https://jsr.io/@frostyeti/path/doc/~/join | join()}, but
 * doesn't collapse `**\/..` when `globstar` is true.
 *
 * @example Usage
 * ```ts
 * import { joinGlobs } from "@frostyeti/path/join-globs";
 * import { equal } from "@frostyeti/assert";
 *
 * if (Deno.build.os === "windows") {
 *   equal(joinGlobs(["foo", "bar", "..", "baz"]), "foo\\baz");
 *   equal(joinGlobs(["foo", "**", "bar", "..", "baz"], { globstar: true }), "foo\\**\\baz");
 * } else {
 *   equal(joinGlobs(["foo", "bar", "..", "baz"]), "foo/baz");
 *   equal(joinGlobs(["foo", "**", "bar", "..", "baz"], { globstar: true }), "foo/**\/baz");
 * }
 * ```
 *
 * @param globs Globs to be joined and normalized.
 * @param options Glob options.
 * @returns The joined and normalized glob string.
 */
export declare function joinGlobs(
  globs: string[],
  options?: GlobOptions,
): string;
