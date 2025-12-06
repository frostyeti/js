// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.
import { AssertionError } from "./assertion-error.ts";

/**
 * Make an assertion, error will be thrown if `expr` does not have truthy value.
 *
 * @example Usage
 * ```ts ignore
 * import { truthy } from "@frostyetiassert";
 *
 * truthy("hello".includes("ello")); // Doesn't throw
 * truthy("hello".includes("world")); // Throws
 * ```
 *
 * @param expr The expression to test.
 * @param msg The optional message to display if the assertion fails.
 */
export function truthy(expr: unknown, msg = ""): asserts expr {
    if (!expr) {
        throw new AssertionError(msg);
    }
}

/**
 * Make an assertion, error will be thrown if `expr` does not have truthy value.
 *
 * @example Usage
 * ```ts ignore
 * import { ok } from "@frostyetiassert";
 *
 * ok("hello".includes("ello")); // Doesn't throw
 * ok("hello".includes("world")); // Throws
 * ```
 *
 * @param expr The expression to test.
 * @param msg The optional message to display if the assertion fails.
 */
export function ok(expr: unknown, msg = ""): asserts expr {
    if (!expr) {
        throw new AssertionError(msg);
    }
}
