/**
 * This module provides functions for determining if an array of characters
 * ends with a given set of characters, both case-sensitive and
 * case-insensitive. It includes the `endsWith` and `endsWithFold` functions.
 * The `endsWith` function checks if the array ends with the given characters
 * using a case-sensitive comparison, while the `endsWithFold` function
 * performs a case-insensitive comparison.
 * @module
 */
import { type CharBuffer } from "./utils.js";
/**
 * Determines if the an array of characters ends with the given characters using
 * a case-insensitive comparison.
 * @param value The characters to check.
 * @param test The characteres to compare.
 * @returns `true` if the array ends with the given characters; otherwise `false`.
 */
export declare function endsWithFold(
  value: CharBuffer,
  test: CharBuffer,
): boolean;
/**
 * Determines if an array of characters ends with the given characters.
 * @param value The characters to check.
 * @param test The characters to compare.
 * @returns `true` if the array ends with the given characters; otherwise `false`.
 */
export declare function endsWith(value: CharBuffer, test: CharBuffer): boolean;
