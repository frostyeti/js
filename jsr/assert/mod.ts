/**
 * # @frostyeti/assert
 *
 * ## Overview
 *
 * An opinated assertion library for testing jolt9/frostyeti typescript/javascript
 * libraries.
 *
 * The library current wraps the chai assertion library
 * and leverages code from the `@std/assert` module on jsr.
 *
 * It is primarily used for testing for various frostyeti.land modules to make it
 * easier to write tests and switch between testing frameworks (deno test and vitest).
 *
 * <img src="https://raw.githubusercontent.com/frostyeti/js/refs/heads/main/.eng/assets/logo.png" height="64" />
 *
 * ## Usage
 * ```typescript
 * import { equal, ok, nope } from "@frostyetiassert";
 *
 * equal(1, 1);
 * ok(true);
 * nope(false);
 * ```
 *
 * ## Classes
 *
 * - `AssertionError` the core assertion error.
 *
 * ## Functions
 *
 * - `arrayIncludes` - asserts that an array includes values
 * - `assert` - asserts that a value is truthy.
 * - `debug` - logs a debug statement for tests. avoids polluting standard out unless debug is enabled.
 * - `setDebugTests` - sets debugging for writing debug statements to true or false.
 * - `equal` - asserts that values are deeply equal.
 * - `exists` - asserts that a value exists.
 * - `fail` - fails a test by throwing an AssertionError.
 * - `instanceOf` - asserts that a value is an instance of a type.
 * - `nope` - asserts that a value is falsy.
 * - `notOk` - asserts that a value is falsy.
 * - `notEqual` - asserts that two values are not deeply equal.
 * - `notInstanceOf` - asserts that a value is not an instance of a type.
 * - `notStrictEqual` - asserts that two values are not strictly equal (not the same ref).
 * - `ok` - asserts that a value is truthy.
 * - `rejects` - asserts that promise returns a rejection.
 * - `strictEqual` - asserts that two values are strictly equal (same ref).
 * - `stringIncludes` - asserts that a string includes a value.
 * - `throws` - asserts that a function throws an exception.
 * - `unimplemented` - asserts that a test is not yet implemented.
 *
 * @module
 * @license MIT
 */
export * from "./array-includes.ts";
export * from "./truthy.ts";
export * from "./assertion-error.ts";
export * from "./debug.ts";
export * from "./equal.ts";
export * from "./exists.ts";
export * from "./fail.ts";
export * from "./instance-of.ts";
export * from "./is-error.ts";
export * from "./falsy.ts";
export * from "./not-equal.ts";
export * from "./not-instance-of.ts";
export * from "./not-strict-equal.ts";
export * from "./rejects.ts";
export * from "./strict-equal.ts";
export * from "./string-includes.ts";
export * from "./throws.ts";
export * from "./truthy.ts";
export * from "./unimplemented.ts";
