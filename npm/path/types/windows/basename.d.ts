/**
 * Return the last portion of a `path`.
 * Trailing directory separators are ignored, and optional suffix is removed.
 *
 * @example Usage
 * ```ts
 * import { basename } from "@frostyeti/path/windows/basename";
 * import { equals } from "@frostyeti/assert";
 *
 * equals(basename("C:\\user\\Documents\\"), "Documents");
 * equals(basename("C:\\user\\Documents\\image.png"), "image.png");
 * equals(basename("C:\\user\\Documents\\image.png", ".png"), "image");
 * equals(basename(new URL("file:///C:/user/Documents/image.png")), "image.png");
 * equals(basename(new URL("file:///C:/user/Documents/image.png"), ".png"), "image");
 * ```
 *
 * @param path The path to extract the name from.
 * @param suffix The suffix to remove from extracted name.
 * @returns The extracted name.
 */
export declare function basename(path: string | URL, suffix?: string): string;
