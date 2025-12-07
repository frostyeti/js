/**
 * startsWith functions determines if a char buffer starts with the given prefix
 * and includes a case-insensitive version.
 * @module
 */
import { type CharBuffer } from "./utils.js";
/**
 * Determines if an array of characters starts with the given characters using
 * a case-insensitive comparison.
 * @param value The string to check.
 * @param prefix The prefix to check.
 * @returns `true` if the string starts with the given prefix; otherwise `false`.
 */
export declare function startsWithFold(
  value: CharBuffer,
  prefix: CharBuffer,
): boolean;
/**
 * Determines if an array of characters starts with the given characters using
 * a case-insensitive comparison.
 * @param value The string to check.
 * @param prefix The prefix to check.
 * @returns `true` if the string starts with the given prefix; otherwise `false`.
 */
export declare function startsWith(
  value: CharBuffer,
  prefix: CharBuffer,
): boolean;
