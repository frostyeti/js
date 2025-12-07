/**
 * The starts-with module provides functions to check if a string starts with a given prefix.
 *
 * @module
 */
import {
  startsWith as og,
  startsWithFold as ogFold,
} from "@frostyeti/slices/starts-with";
/**
 * Determines if the leading characters in the string matches the prefix.
 * @param value The string to check.
 * @param prefix The characters to search for.
 * @returns `true` if the string starts with the prefix; otherwise, `false`.
 */
export function startsWith(value, prefix) {
  return og(value, prefix);
}
/**
 * Determines if the leading characters in the string matches the prefix
 * using case-insensitive comparison.
 * @param value The string to check.
 * @param prefix The characters to search for.
 * @returns `true` if the string starts with the prefix; otherwise, `false`.
 */
export function startsWithFold(value, prefix) {
  return ogFold(value, prefix);
}
