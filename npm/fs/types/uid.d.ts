/**
 * The `uid` module provides a function to get the current user id on POSIX platforms.
 *
 * @module
 */
/**
 * Gets the current user id on POSIX platforms.
 * Returns `null` on Windows.
 */
export declare function uid(): number | null;
