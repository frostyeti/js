/**
 * The underscore module provides a function to convert a string to underscore case.
 *
 * @module
 */
import { underscore as og } from "@frostyeti/slices/underscore";
/**
 * Converts the string to underscore case, generally from camel or pascal
 * case identifiers.
 * @param value The value to convert.
 * @param options The underscore conversion options.
 * @returns The string in underscore case.
 */
export function underscore(value, options) {
  const r = og(value, options);
  return String.fromCodePoint(...r);
}
