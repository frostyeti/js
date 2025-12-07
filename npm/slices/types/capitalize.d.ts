/**
 * This module provides a function to capitalize the first character of a string.
 * The capitalize function converts the first character of a string to uppercase
 * and the rest to lowercase by default. It can also preserve the case of the
 * characters that are not the first character if specified in the options.
 * @module
 */
import { type CharBuffer } from "./utils.js";
/**
 * Options for the capitalize function.
 */
export interface CapitalizeOptions {
  /**
   * Preserve the case of the characters that are not
   * the first character.
   */
  preserveCase?: boolean;
}
/**
 * Capitalize converts the first character of a string to uppercase. By default, it
 * converts the first character to uppercase and the rest to lowercase.
 *
 * @description
 * To avoid allocations, the function returns a Uint32Array that represents
 * the capitalized string.  To convert the Uint32Array to a string, use
 * `String.fromCharCode(...capitalized)`.
 *
 * @param value The string to capitalize.
 * @param options The options for the function.
 * @returns The capitalized string as a Uint32Array.
 * @example
 * ```typescript
 * import { capitalize } from '@frostyeti/slices/capitalize';
 *
 * const capitalized = capitalize("hello world");
 * console.log(String.fromCodePoint(...capitalized)); // Output: "Hello world"
 * ```
 */
export declare function capitalize(
  value: CharBuffer,
  options?: CapitalizeOptions,
): Uint32Array;
