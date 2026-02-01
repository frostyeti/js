/**
 * Make an assertion that `actual` matches the `expected` RegExp pattern.
 * If not then throw.
 *
 * @example Usage
 * ```ts ignore
 * import { match } from "@frostyeti/assert";
 *
 * match("Raptor", /Raptor/); // Doesn't throw
 * match("Denosaurus", /Raptor/); // Throws
 * ```
 *
 * @param actual The actual value to match against.
 * @param expected The expected RegExp pattern to test.
 * @param msg The optional message to display if the assertion fails.
 */
export declare function match(
  actual: string,
  expected: RegExp,
  msg?: string,
): void;
