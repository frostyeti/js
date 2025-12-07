/**
 * underscore functions converts a string to the underscore case.
 *
 * @module
 */
import { type CharBuffer } from "./utils.js";
/**
 * UnderScoreOptions is the options for the underscore function.
 * @property screaming - If true, the first character will be uppercased.
 * @property preserveCase - If true, the case of the first character will be preserved.
 */
export interface UnderScoreOptions {
  /**
   * If true, all characters will be converted to uppercase.
   * If false, all characters will be converted to lowercase.
   */
  screaming?: boolean;
  /**
   * If true, the case of the first character will be preserved.
   */
  preserveCase?: boolean;
}
/**
 * Converts the slice to the the underscore case. The `_`, `-`, ` `
 * characters are converted to `-` and prepending a `-` to any uppercase
 * character unless the preserveCase option is set to true
 * or the screaming option is set to true, or it is the first character.
 *
 * Underscore is primary for camel or pascal case strings.
 *
 * @param slice The string to underscore.
 * @param options The options for the function.
 * @returns A char array that is in the underscore case.
 * @throws Error if preserveCase and screaming are both true.
 */
export declare function underscore(
  slice: CharBuffer,
  options?: UnderScoreOptions,
): Uint32Array;
