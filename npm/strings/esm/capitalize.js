/**
 * This module provides a function to capitalize the first letter of a string.
 * It is primarily used for converting code to capitalized case.
 * @module
 */
import { capitalize as og } from "@frostyeti/slices/capitalize";
/**
 * Capitalizes the first letter of the string.
 * @param value The string to capitalize.
 * @param options The options for capitalizing the string.
 * @returns The capitalized string.
 */
export function capitalize(value, options) {
  const r = og(value, options);
  return String.fromCodePoint(...r);
}
