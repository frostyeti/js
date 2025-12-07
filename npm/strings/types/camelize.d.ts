/**
 * The camelize module includes the camelize function for strings
 * which converts a string to camel case. It is primarily used for
 * converting code to camel case.
 *
 * @module
 */
import { type CamelizeOptions } from "@frostyeti/slices/camelize";
/**
 * Converts the string to camel case. This is primarily for converting
 * code to camel case.
 * @param value The string to camelize.
 * @param options The options for the function.
 * @returns A string in camel case.
 */
export declare function camelize(
  value: string,
  options?: CamelizeOptions,
): string;
