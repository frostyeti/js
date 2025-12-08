/**
 * Gets the current group id for the current user on POSIX platforms.
 * Returns `null` on Windows.
 * @returns The current group id or `null` if not available.
 * @example
 * ```ts
 * import { gid } from "@frostyeti/fs/gid";
 * const groupId = gid();
 * console.log("Current group ID:", groupId);
 * ```
 */
export declare function gid(): number | null;
