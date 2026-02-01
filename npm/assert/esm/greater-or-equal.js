// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.
import { AssertionError } from "./assertion-error.js";
/**
 * Make an assertion that `actual` is greater than or equal to `expected`.
 * If not then throw.
 *
 * @example Usage
 * ```ts ignore
 * import { greaterOrEqual } from "@frostyeti/assert";
 *
 * greaterOrEqual(2, 1); // Doesn't throw
 * greaterOrEqual(1, 1); // Doesn't throw
 * greaterOrEqual(0, 1); // Throws
 * ```
 *
 * @typeParam T The type of the values to compare, must support < operator.
 * @param actual The actual value to compare.
 * @param expected The expected value to compare.
 * @param msg The optional message to display if the assertion fails.
 */
export function greaterOrEqual(actual, expected, msg) {
  if (actual >= expected) {
    return;
  }
  const msgSuffix = msg ? `: ${msg}` : ".";
  throw new AssertionError(
    `Expected "${actual}" to be greater than or equal to "${expected}"${msgSuffix}`,
  );
}
