/**
 * Return the extension of the path with leading period (".").
 *
 * @experimental **UNSTABLE**: New API, yet to be vetted.
 *
 * @example Usage
 * ```ts
 * import { extname } from "@frostyeti/path/unstable-extname";
 * import { equal } from "@frostyeti/assert";
 *
 * if (Deno.build.os === "windows") {
 *   equal(extname("C:\\home\\user\\Documents\\image.png"), ".png");
 *   equal(extname(new URL("file:///C:/home/user/Documents/image.png")), ".png");
 * } else {
 *   equal(extname("/home/user/Documents/image.png"), ".png");
 *   equal(extname(new URL("file:///home/user/Documents/image.png")), ".png");
 * }
 * ```
 *
 * @param path Path with extension.
 * @returns The file extension. E.g. returns `.ts` for `file.ts`.
 */
export declare function extname(path: string | URL): string;
