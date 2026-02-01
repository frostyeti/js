/**
 * Make an assertion that `actual` does not match the `expected` RegExp pattern.
 * If it does match, then throw.
 *
 * @example Usage
 * ```ts ignore
 * import { notMatch } from "@frostyeti/assert";
 *
 * notMatch("Denosaurus", /Raptor/); // Doesn't throw
 * notMatch("Raptor", /Raptor/); // Throws
 * ```
 *
 * @param actual The actual value to match against.
 * @param expected The expected RegExp pattern to test.
 * @param msg The optional message to display if the assertion fails.
 */
export declare function notMatch(
  actual: string,
  expected: RegExp,
  msg?: string,
): void;
