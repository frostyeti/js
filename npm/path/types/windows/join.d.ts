/**
 * Join all given a sequence of `paths`,then normalizes the resulting path.
 *
 * @example Usage
 * ```ts
 * import { join } from "@frostyeti/path/windows/join";
 * import { equal } from "@frostyeti/assert";
 *
 * const joined = join("C:\\foo", "bar", "baz\\..");
 * equal(joined, "C:\\foo\\bar");
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `join` from `@frostyeti/path/windows/unstable-join`.
 *
 * @param paths The paths to join.
 * @returns The joined path.
 */
export declare function join(...paths: string[]): string;
