// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.
import { AssertionError } from "./assertion-error.ts";

/**
 * Use this to assert unreachable code.
 *
 * @example Usage
 * ```ts ignore
 * import { unreachable } from "@frostyeti/assert";
 *
 * // This function never returns, so the code after it is unreachable.
 * function doSomething(x: string): never {
 *   throw new Error(x);
 * }
 *
 * doSomething("Hello, World!");
 * unreachable(); // Throws
 * ```
 *
 * @param msg Optional message to include in the error.
 * @returns Never returns, always throws.
 */
export function unreachable(msg?: string): never {
    const msgSuffix = msg ? `: ${msg}` : ".";
    throw new AssertionError(`Unreachable${msgSuffix}`);
}
