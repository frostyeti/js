/**
 * The starts-with module provides functions to check if a string starts with a given prefix.
 *
 * @module
 */

import { startsWith as og, startsWithFold as ogFold } from "@frostyeti/slices/starts-with";
import type { CharBuffer } from "@frostyeti/slices/utils";

/**
 * Determines if the leading characters in the string matches the prefix.
 * @param value The string to check.
 * @param prefix The characters to search for.
 * @returns `true` if the string starts with the prefix; otherwise, `false`.
 */
export function startsWith(value: string, prefix: CharBuffer): boolean {
    return og(value, prefix);
}

/**
 * Determines if the leading characters in the string matches the prefix
 * using case-insensitive comparison.
 * @param value The string to check.
 * @param prefix The characters to search for.
 * @returns `true` if the string starts with the prefix; otherwise, `false`.
 */
export function startsWithFold(value: string, prefix: CharBuffer): boolean {
    return ogFold(value, prefix);
}
