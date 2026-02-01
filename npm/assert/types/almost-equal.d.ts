/**
 * Make an assertion that `actual` is almost equal to `expected`,
 * according to a given `tolerance`. It will throw if the assertion fails.
 *
 * The default tolerance is 1e-7.
 *
 * @example Usage
 * ```ts ignore
 * import { almostEqual } from "@frostyeti/assert";
 *
 * almostEqual(0.01, 0.02, 0.1); // Doesn't throw
 * almostEqual(0.01, 0.02); // Throws
 * almostEqual(0.1 + 0.2, 0.3, 1e-16); // Doesn't throw
 * almostEqual(0.1 + 0.2, 0.3, 1e-17); // Throws
 * ```
 *
 * @param actual The actual value to compare.
 * @param expected The expected value to compare.
 * @param tolerance The tolerance to determine when the values are considered close enough.
 *                  Defaults to 1e-7.
 * @param msg The optional message to display if the assertion fails.
 */
export declare function almostEqual(
  actual: number,
  expected: number,
  tolerance?: number,
  msg?: string,
): void;
/**
 * Make an assertion that `actual` is not almost equal to `expected`,
 * according to a given `tolerance`. It will throw if the assertion fails.
 *
 * The default tolerance is 1e-7.
 *
 * @example Usage
 * ```ts ignore
 * import { notAlmostEqual } from "@frostyeti/assert";
 *
 * notAlmostEqual(1, 2); // Doesn't throw
 * notAlmostEqual(1, 1.0000001, 1e-6); // Doesn't throw
 * notAlmostEqual(1, 1.0000001, 1e-7); // Throws
 * ```
 *
 * @param actual The actual value to compare.
 * @param expected The expected value to compare.
 * @param tolerance The tolerance to determine when the values are considered close enough.
 *                  Defaults to 1e-7.
 * @param msg The optional message to display if the assertion fails.
 */
export declare function notAlmostEqual(
  actual: number,
  expected: number,
  tolerance?: number,
  msg?: string,
): void;
