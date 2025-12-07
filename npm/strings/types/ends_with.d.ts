import type { CharBuffer } from "@frostyeti/slices/utils";
/**
 * Determines whether the string ends with the specified suffix using
 * case-insensitive comparison.
 * @param value The string to check.
 * @param suffix The suffix to check for.
 * @returns `true` if the string ends with the suffix; otherwise, `false`.
 */
export declare function endsWithFold(
  value: string,
  suffix: CharBuffer,
): boolean;
/**
 * Determines whether the string ends with the specified suffix.
 * @param value The string to check.
 * @param suffix The suffix to check for.
 * @returns `true` if the string ends with the suffix; otherwise, `false`.
 */
export declare function endsWith(value: string, suffix: CharBuffer): boolean;
