import { AssertionError } from "./assertion-error.ts";

/**
 * Use this to stub out methods that will throw when invoked.
 *
 * @example Usage
 * ```ts no-eval
 * import { unimplemented } from "@frostyetiassert";
 *
 * unimplemented(); // Throws
 * ```
 *
 * @param msg Optional message to include in the error.
 * @returns Never returns, always throws.
 */
export function unimplemented(msg?: string) {
    const msgSuffix = msg ? `: ${msg}` : ".";
    throw new AssertionError(`Unimplemented${msgSuffix}`);
}
