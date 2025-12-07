/**
 * Return the last portion of a `path`.
 * Trailing directory separators are ignored, and optional suffix is removed.
 *
 * @experimental **UNSTABLE**: New API, yet to be vetted.
 *
 * @example Usage
 * ```ts
 * import { basename } from "@frostyeti/path/windows/unstable-basename";
 * import { equal } from "@frostyeti/assert";
 *
 * equal(basename("C:\\user\\Documents\\"), "Documents");
 * equal(basename("C:\\user\\Documents\\image.png"), "image.png");
 * equal(basename("C:\\user\\Documents\\image.png", ".png"), "image");
 * equal(basename(new URL("file:///C:/user/Documents/image.png")), "image.png");
 * equal(basename(new URL("file:///C:/user/Documents/image.png"), ".png"), "image");
 * ```
 *
 * @param path The path to extract the name from.
 * @param suffix The suffix to remove from extracted name.
 * @returns The extracted name.
 */
export declare function basename(path: string | URL, suffix?: string): string;
