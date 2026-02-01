/**
 * Make an assertion that `actual` is greater than `expected`.
 * If not then throw.
 *
 * @example Usage
 * ```ts ignore
 * import { greater } from "@frostyeti/assert";
 *
 * greater(2, 1); // Doesn't throw
 * greater(1, 1); // Throws
 * greater(0, 1); // Throws
 * ```
 *
 * @typeParam T The type of the values to compare, must support < operator.
 * @param actual The actual value to compare.
 * @param expected The expected value to compare.
 * @param msg The optional message to display if the assertion fails.
 */
export declare function greater<T>(actual: T, expected: T, msg?: string): void;
