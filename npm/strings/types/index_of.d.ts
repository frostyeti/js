/**
 * The index-of module provides functions to find the index of the first occurrence
 * of specified characters in a string. It includes both case-sensitive and
 * case-insensitive comparison functions.
 *
 * @module
 */
import type { CharBuffer } from "@frostyeti/slices/utils";
/**
 * Gets the index of the first occurrence of the specified characters
 * in the string using case-insensitive comparison.
 * @param value The string to search.
 * @param chars The characters to search for.
 * @param index The index to start searching from.
 * @returns The index of the first occurrence of the characters in the string.
 * If the string is not found, returns -1.
 */
export declare function indexOfFold(
  value: string,
  chars: CharBuffer,
  index?: number,
): number;
/**
 * Gets the index of the first occurrence of the specified characters
 * in the string.
 * @param value The string to search.
 * @param chars The characters to search for.
 * @param index The index to start searching from.
 * @returns The index of the first occurrence of the characters in the string.
 * If the string is not found, returns -1.
 */
export declare function indexOf(
  value: string,
  chars: CharBuffer,
  index?: number,
): number;
