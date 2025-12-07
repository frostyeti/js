/**
 * Returns the path to the executable that started the process. Mainly
 * deno, node, bun, or empty string.
 *
 * @description
 * When running in Deno, this function will request read permission
 * if it is not already granted. If the permission is denied, the function
 * will return an empty string.
 *
 * @returns The path to the executable that started the process.
 * @example
 *
 * ```ts
 * import { execPath } from "@frostyeti/process";
 *
 * console.log(execPath());
 * // Output: "/usr/local/bin/deno" or "/usr/local/bin/node" or "/home/user/.deno/bin/deno"
 * ```
 */
export declare function execPath(): string;
