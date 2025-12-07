import { type CharBuffer } from "./utils.js";
/**
 * Determines if two arrays of characters are equal using a
 * case-insensitive comparison.
 * @param value The characters to check.
 * @param test The characters to compare.
 * @returns `true` if the arrays are equal; otherwise `false`.
 */
export declare function equalFold(value: CharBuffer, test: CharBuffer): boolean;
/**
 * Determines if two arrays of characters are equal.
 * @param value The characters to check.
 * @param test The characters to compare.
 * @returns The characters to compare.
 */
export declare function equal(value: CharBuffer, test: CharBuffer): boolean;
