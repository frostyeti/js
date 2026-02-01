/**
 * Make an assertion that `expected` object is a subset of `actual` object,
 * deeply. If not, then throw.
 *
 * @example Usage
 * ```ts ignore
 * import { objectMatch } from "@frostyeti/assert";
 *
 * objectMatch({ foo: "bar" }, { foo: "bar" }); // Doesn't throw
 * objectMatch({ foo: "bar" }, { foo: "baz" }); // Throws
 * objectMatch({ foo: 1, bar: 2 }, { foo: 1 }); // Doesn't throw
 * objectMatch({ foo: 1 }, { foo: 1, bar: 2 }); // Throws
 * ```
 *
 * @example Usage with nested objects
 * ```ts ignore
 * import { objectMatch } from "@frostyeti/assert";
 *
 * objectMatch({ foo: { bar: 3, baz: 4 } }, { foo: { bar: 3 } }); // Doesn't throw
 * objectMatch({ foo: { bar: 3 } }, { foo: { bar: 3, baz: 4 } }); // Throws
 * ```
 *
 * @param actual The actual value to be matched.
 * @param expected The expected value to match.
 * @param msg The optional message to display if the assertion fails.
 */
export declare function objectMatch(
  actual: Record<PropertyKey, any>,
  expected: Record<PropertyKey, unknown>,
  msg?: string,
): void;
