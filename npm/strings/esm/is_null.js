/**
 * The is-null module provides functions to check if a string is null.
 * @module
 */
/**
 * Determines whether the string is null.
 * @param s The string to check.
 * @returns `true` if the string is null or undefined; otherwise, `false`.
 *
 * @example
 * ```typescript
 * import { isNull } from "@frostyeti/strings";
 *
 * isNull(null);      // true
 * isNull(undefined); // false (only checks null)
 * isNull("");        // false
 * isNull("hello");   // false
 * ```
 */
export function isNull(s) {
  return s === null;
}
