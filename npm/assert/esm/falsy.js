// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.
import { AssertionError } from "./assertion-error.js";
/**
 * Make an assertion, error will be thrown if `expr` have truthy value.
 *
 * @example Usage
 * ```ts ignore
 * import { falsy } from "@frostyetiassert";
 *
 * falsy(false); // Doesn't throw
 * falsy(true); // Throws
 * ```
 *
 * @param expr The expression to test.
 * @param msg The optional message to display if the assertion fails.
 */
export function falsy(expr, msg = "") {
    if (expr) {
        throw new AssertionError(msg);
    }
}
/**
 * Make an assertion, error will be thrown if `expr` have truthy value.
 *
 * @example Usage
 * ```ts ignore
 * import { nope } from "@frostyetiassert";
 *
 * nope(false); // Doesn't throw
 * nope(true); // Throws
 * ```
 *
 * @param expr The expression to test.
 * @param msg The optional message to display if the assertion fails.
 */
export function nope(expr, msg = "") {
    if (expr) {
        throw new AssertionError(msg);
    }
}
/**
 * Make an assertion, error will be thrown if `expr` have truthy value.
 *
 * @example Usage
 * ```ts ignore
 * import { notOk } from "@frostyetiassert";
 *
 * notOk(false); // Doesn't throw
 * notOk(true); // Throws
 * ```
 *
 * @param expr The expression to test.
 * @param msg The optional message to display if the assertion fails.
 */
export function notOk(expr, msg = "") {
    if (expr) {
        throw new AssertionError(msg);
    }
}
