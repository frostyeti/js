// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.
import { AssertionError } from "./assertion-error.js";
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
export function match(actual, expected, msg) {
  if (expected.test(actual)) {
    return;
  }
  const msgSuffix = msg ? `: ${msg}` : ".";
  throw new AssertionError(
    `Expected actual: "${actual}" to match: "${expected}"${msgSuffix}`,
  );
}
