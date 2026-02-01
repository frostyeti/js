// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.
import { AssertionError } from "./assertion-error.ts";

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
export function notMatch(
    actual: string,
    expected: RegExp,
    msg?: string,
): void {
    if (!expected.test(actual)) {
        return;
    }
    const msgSuffix = msg ? `: ${msg}` : ".";
    throw new AssertionError(
        `Expected actual: "${actual}" to not match: "${expected}"${msgSuffix}`,
    );
}
