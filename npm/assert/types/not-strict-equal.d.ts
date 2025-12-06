/**
 * Make an assertion that `actual` and `expected` are not strictly equal, using
 * {@linkcode Object.is} for equality comparison. If the values are strictly
 * equal then throw.
 *
 * @example Usage
 * ```ts ignore
 * import { notStrictEquals } from "@frostyetiassert";
 *
 * notStrictEquals(1, 1); // Throws
 * notStrictEquals(1, 2); // Doesn't throw
 *
 * notStrictEquals(0, 0); // Throws
 * notStrictEquals(0, -0); // Doesn't throw
 * ```
 *
 * @typeParam T The type of the values to compare.
 * @param actual The actual value to compare.
 * @param expected The expected value to compare.
 * @param msg The optional message to display if the assertion fails.
 */
export declare function notStrictEquals<T>(actual: T, expected: T, msg?: string): void;
