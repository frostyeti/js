/**
 * This module provides functions for manipulating strings and
 * character buffers, including converting strings to camel case.
 *
 * @module
 */
import { type CharBuffer } from "./utils.js";
/**
 * Options for the `camelize` function.
 */
export interface CamelizeOptions {
  /**
   * Preserve the case of the characters that are not
   * the first character or after a `_`, `-`, or ` `.
   */
  preserveCase?: boolean;
}
/**
 * Camelize converts a string to camel case, removing any `_`, `-`, or ` ` characters
 * and capitalizing the first letter of each word.
 *
 * @description
 * This function is
 * primary for converting snake_case, kebab-case, or space separated
 * symbols to camel case.
 *
 * To avoid allocations, the function returns a Uint32Array that represents
 * the camel case string.  To convert the Uint32Array to a string, use
 * `String.fromCharCode(...camel)`.
 *
 * @param value  The string to convert to camel case.
 * @param options The options for the function.
 * @returns The camel case string as a Uint32Array.
 *
 * @example
 * ```typescript
 * import { camelize } from '@frostyeti/slices/camelize';
 *
 * const camel = camelize("hello_world");
 * console.log(String.fromCharCode(...camel)); // Output: "HelloWorld"
 * ```
 */
export declare function camelize(
  value: CharBuffer | string,
  options?: CamelizeOptions,
): Uint32Array;
