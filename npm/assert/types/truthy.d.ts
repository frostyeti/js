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
export declare function truthy(expr: unknown, msg?: string): asserts expr;
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
export declare function ok(expr: unknown, msg?: string): asserts expr;
