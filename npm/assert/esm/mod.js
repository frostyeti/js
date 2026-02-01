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
 * <img src="https://raw.githubusercontent.com/frostyeti/js/refs/heads/master/eng/assets/logo.png" height="64" />
 *
 * ## Usage
 * ```typescript
 * import * as assert from "@frostyeti/assert";
 *
 * assert.equal(1, 1);
 * assert.ok(true);
 * assert.nope(false);
 * ```
 *
 * ## Classes
 *
 * - `AssertionError` the core assertion error.
 *
 * ## Functions
 *
 * - `almostEqual` - asserts that two numbers are almost equal within a tolerance.
 * - `arrayIncludes` - asserts that an array includes values.
 * - `debug` - logs a debug statement for tests. avoids polluting standard out unless debug is enabled.
 * - `equal` - asserts that values are deeply equal.
 * - `exists` - asserts that a value exists (not null or undefined).
 * - `fail` - fails a test by throwing an AssertionError.
 * - `falsy` - asserts that a value is falsy.
 * - `greater` - asserts that actual is greater than expected.
 * - `greaterOrEqual` - asserts that actual is greater than or equal to expected.
 * - `instanceOf` - asserts that a value is an instance of a type.
 * - `isError` - asserts that a value is an Error.
 * - `less` - asserts that actual is less than expected.
 * - `lessOrEqual` - asserts that actual is less than or equal to expected.
 * - `match` - asserts that a string matches a RegExp pattern.
 * - `nope` - asserts that a value is falsy (alias for falsy).
 * - `notAlmostEqual` - asserts that two numbers are not almost equal.
 * - `notEqual` - asserts that two values are not deeply equal.
 * - `notInstanceOf` - asserts that a value is not an instance of a type.
 * - `notMatch` - asserts that a string does not match a RegExp pattern.
 * - `notOk` - asserts that a value is falsy (alias for falsy).
 * - `notStrictEqual` - asserts that two values are not strictly equal (not the same ref).
 * - `objectMatch` - asserts that expected object is a subset of actual object.
 * - `ok` - asserts that a value is truthy.
 * - `rejects` - asserts that promise returns a rejection.
 * - `setDebugTests` - sets debugging for writing debug statements to true or false.
 * - `strictEqual` - asserts that two values are strictly equal (same ref).
 * - `stringIncludes` - asserts that a string includes a value.
 * - `throws` - asserts that a function throws an exception.
 * - `truthy` - asserts that a value is truthy.
 * - `unimplemented` - asserts that a test is not yet implemented.
 * - `unreachable` - marks code that should never be reached.
 *
 * @module
 * @license MIT
 */
export * from "./almost-equal.js";
export * from "./array-includes.js";
export * from "./assertion-error.js";
export * from "./debug.js";
export * from "./equal.js";
export * from "./exists.js";
export * from "./fail.js";
export * from "./falsy.js";
export * from "./greater.js";
export * from "./greater-or-equal.js";
export * from "./instance-of.js";
export * from "./is-error.js";
export * from "./less.js";
export * from "./less-or-equal.js";
export * from "./match.js";
export * from "./not-equal.js";
export * from "./not-instance-of.js";
export * from "./not-match.js";
export * from "./not-strict-equal.js";
export * from "./object-match.js";
export * from "./rejects.js";
export * from "./strict-equal.js";
export * from "./string-includes.js";
export * from "./throws.js";
export * from "./truthy.js";
export * from "./unimplemented.js";
export * from "./unreachable.js";
