/**
 * Make an assertion that `actual` is less than or equal to `expected`.
 * If not then throw.
 *
 * @example Usage
 * ```ts ignore
 * import { lessOrEqual } from "@frostyeti/assert";
 *
 * lessOrEqual(1, 2); // Doesn't throw
 * lessOrEqual(1, 1); // Doesn't throw
 * lessOrEqual(2, 1); // Throws
 * ```
 *
 * @typeParam T The type of the values to compare, must support < operator.
 * @param actual The actual value to compare.
 * @param expected The expected value to compare.
 * @param msg The optional message to display if the assertion fails.
 */
export declare function lessOrEqual<T>(
  actual: T,
  expected: T,
  msg?: string,
): void;
