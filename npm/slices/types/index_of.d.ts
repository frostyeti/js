import { type CharBuffer } from "./utils.js";
/**
 * Gets the index of the first occurrence of the test array in the value array
 * using a case-insensitive comparison.
 * @param value The array of characters to search in.
 * @param test The aray of characters to search for.
 * @param index The index to start the search at.
 * @returns The index of the first occurrence of the test array in
 * the value array, or -1 if not found.
 */
export declare function indexOfFold(
  value: CharBuffer,
  test: CharBuffer,
  index?: number,
): number;
/**
 * Gets the index of the first occurrence of the test array in the value array.
 * @param value The array of characters to search in.
 * @param test The aray of characters to search for.
 * @param index The index to start the search at.
 * @returns The index of the first occurrence of the test array in
 * the value array, or -1 if not found.
 */
export declare function indexOf(
  value: CharBuffer,
  test: CharBuffer,
  index?: number,
): number;
