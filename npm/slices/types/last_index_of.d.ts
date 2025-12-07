/**
 * The `lastIndexOf` module provides functions to find the last index of a
 * substring in a string or character buffer, with support for case-insensitive
 * searching.
 * @module
 */
import { type CharBuffer } from "./utils.js";
/**
 * Gets the index of the last occurrence of the test array in the value array
 * using a case-insensitive comparison.
 * @param value The array of characters to search in.
 * @param test The aray of characters to search for.
 * @param index The index to start the search at.
 * @returns The index of the first occurrence of the test array in
 * the value array, or -1 if not found.
 */
export declare function lastIndexOfFold(
  value: CharBuffer,
  test: CharBuffer,
  index?: number,
): number;
/**
 * Gets the index of the last occurrence of the test array in the value array
 * @param value The array of characters to search in.
 * @param test The aray of characters to search for.
 * @param index The index to start the search at.
 * @returns The index of the first occurrence of the test array in
 * the value array, or -1 if not found.
 */
export declare function lastIndexOf(
  value: CharBuffer,
  test: CharBuffer,
  index?: number,
): number;
