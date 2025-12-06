// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.
import { AssertionError } from "./assertion-error.js";
/**
 * Make an assertion that actual is not null or undefined.
 * If not then throw.
 *
 * @example Usage
 * ```ts ignore
 * import { exists } from "@frostyetiassert";
 *
 * exists("something"); // Doesn't throw
 * exists(undefined); // Throws
 * ```
 *
 * @typeParam T The type of the actual value.
 * @param actual The actual value to check.
 * @param msg The optional message to include in the error if the assertion fails.
 */
export function exists(actual, msg) {
    if (actual === undefined || actual === null) {
        const msgSuffix = msg ? `: ${msg}` : ".";
        msg = `Expected actual: "${actual}" to not be null or undefined${msgSuffix}`;
        throw new AssertionError(msg);
    }
}
