/**
 * Make an assertion that `actual` is less than `expected`.
 * If not then throw.
 *
 * @example Usage
 * ```ts ignore
 * import { less } from "@frostyeti/assert";
 *
 * less(1, 2); // Doesn't throw
 * less(1, 1); // Throws
 * less(2, 1); // Throws
 * ```
 *
 * @typeParam T The type of the values to compare, must support < operator.
 * @param actual The actual value to compare.
 * @param expected The expected value to compare.
 * @param msg The optional message to display if the assertion fails.
 */
export declare function less<T>(actual: T, expected: T, msg?: string): void;
