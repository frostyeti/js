/**
 * Return the last portion of a `path`.
 * Trailing directory separators are ignored, and optional suffix is removed.
 *
 * @example Usage
 * ```ts
 * import { basename } from "@frostyeti/path/windows/basename";
 * import { equal } from "@frostyeti/assert";
 *
 * equal(basename("C:\\user\\Documents\\"), "Documents");
 * equal(basename("C:\\user\\Documents\\image.png"), "image.png");
 * equal(basename("C:\\user\\Documents\\image.png", ".png"), "image");
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `basename` from `@frostyeti/path/windows/unstable-basename`.
 *
 * @param path The path to extract the name from.
 * @param suffix The suffix to remove from extracted name.
 * @throws TypeError if the path is not a string.
 * @returns The extracted name.
 */
export declare function basename(path: string, suffix?: string): string;
