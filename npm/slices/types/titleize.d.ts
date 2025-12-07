/**
 * titleize function that converts a string to title case.
 * @module
 */
import { Tokens } from "./tokens.js";
import { type CharSliceLike } from "./utils.js";
/**
 * @description This is a list of words that should not be capitalized for title case.
 */
export declare const NoCapitalizeWords: Tokens;
/**
 * Converts a an array of characters to title case.
 *
 * This function converts the first character of a string to uppercase and the rest to lowercase.
 *
 * To avoid allocations, the function returns a Uint32Array that represents
 * the title case string.  To convert the Uint32Array to a string, use
 * see {@linkcode String.fromCharCode} or {@linkcode toCharSliceLike}.
 *
 * @param s The string to convert to title case.
 * @returns A new `Uint32Array` with the title case string.
 */
export declare function titleize(s: CharSliceLike | string): Uint32Array;
