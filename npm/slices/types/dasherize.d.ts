/**
 * This module provides a function to convert a string to dasherized case.
 * Dasherized case is a form of kebab case where words are separated by hyphens
 * and all characters are lowercased.
 *
 * Dasherize is primarily used for converting camel case or pascal case strings
 * to a more readable format.
 * @module
 */
import { type CharBuffer } from "./utils.js";
/**
 * DasherizeOptions is the options for the dasherize function.
 * @property screaming - If true, the first character will be uppercased.
 * @property preserveCase - If true, the case of the first character will be preserved.
 */
export interface DasherizeOptions {
  screaming?: boolean;
  preserveCase?: boolean;
}
/**
 * Dasherize converts a string to kebab case, converting any `_`, `-`, ` ` to `-` and
 * prepending a `-` to any uppercase character unless the preserveCase option is set to true
 * or the screaming option is set to true, or it is the first character.
 *
 * Dasherize is primary for camel or pascal case strings.
 *
 * @param value The string to convert to dasherized case.
 * @param options The options for the function.
 * @returns The dasherized string as a Uint32Array.
 */
export declare function dasherize(
  value: CharBuffer,
  options?: DasherizeOptions,
): Uint32Array;
