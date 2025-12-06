/**
 * Use this to assert failed test.
 *
 * @example Usage
 * ```ts no-eval
 * import { unreachable } from "@frostyetiassert";
 *
 * unreachable(); // Throws
 * ```
 *
 * @param msg Optional message to include in the error.
 * @returns Never returns, always throws.
 */
export declare function fail(msg?: string): never;
