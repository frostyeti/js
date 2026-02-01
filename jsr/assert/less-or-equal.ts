// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.
import { AssertionError } from "./assertion-error.ts";

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
export function lessOrEqual<T>(actual: T, expected: T, msg?: string): void {
    if (actual <= expected) {
        return;
    }
    const msgSuffix = msg ? `: ${msg}` : ".";
    throw new AssertionError(
        `Expected "${actual}" to be less than or equal to "${expected}"${msgSuffix}`,
    );
}
