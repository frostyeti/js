# @frostyeti/assert

## Overview

A comprehensive assertion library for testing, providing deep equality checks,
type assertions, and utility functions. A remix of `std/assert` from Deno,
adapted for cross-runtime compatibility with Deno, Bun, and Node.js.

![logo](https://raw.githubusercontent.com/frostyeti/js/refs/heads/master/eng/assets/logo.png)

[![JSR](https://jsr.io/badges/@frostyeti/assert)](https://jsr.io/@frostyeti/assert)
[![npm version](https://badge.fury.io/js/@frostyeti%2Fassert.svg)](https://badge.fury.io/js/@frostyeti%2Fassert)
[![GitHub version](https://badge.fury.io/gh/frostyeti%2Fjs.svg)](https://badge.fury.io/gh/frostyeti%2Fjs)

## Documentation

Documentation is available on [jsr.io](https://jsr.io/@frostyeti/assert/doc)

## Installation

```bash
# Deno
deno add jsr:@frostyeti/assert

# npm from jsr
npx jsr add @frostyeti/assert

# from npmjs.org
npm install @frostyeti/assert
```

## Quick Start

```typescript
import { equal, ok, throws, match } from "@frostyeti/assert";

// Deep equality
equal({ a: 1, b: [2, 3] }, { a: 1, b: [2, 3] });

// Truthiness
ok(true);
ok("non-empty string");

// Exception testing
throws(() => { throw new Error("boom"); }, Error, "boom");

// Pattern matching
match("hello@example.com", /^[\w.]+@[\w.]+$/);
```

## API Reference

### Classes

| Class | Description |
|-------|-------------|
| `AssertionError` | The core assertion error thrown by all assertion functions |

### Equality Assertions

| Function | Description |
|----------|-------------|
| `equal(actual, expected, msg?)` | Deep equality comparison using structural equality |
| `notEqual(actual, expected, msg?)` | Asserts values are not deeply equal |
| `strictEquals(actual, expected, msg?)` | Reference equality using `Object.is()` |
| `notStrictEquals(actual, expected, msg?)` | Asserts values are not reference-equal |

```typescript
import { equal, strictEquals } from "@frostyeti/assert";

// Deep equality - compares structure
equal([1, 2, 3], [1, 2, 3]); // ✓ passes
equal({ a: 1 }, { a: 1 });   // ✓ passes

// Strict equality - compares reference
const arr = [1, 2, 3];
strictEquals(arr, arr);      // ✓ passes (same reference)
strictEquals([1], [1]);      // ✗ throws (different references)
```

### Numeric Comparisons

| Function | Description |
|----------|-------------|
| `greater(actual, expected, msg?)` | Asserts `actual > expected` |
| `greaterOrEqual(actual, expected, msg?)` | Asserts `actual >= expected` |
| `less(actual, expected, msg?)` | Asserts `actual < expected` |
| `lessOrEqual(actual, expected, msg?)` | Asserts `actual <= expected` |
| `almostEqual(actual, expected, tolerance?, msg?)` | Floating-point comparison within tolerance (default: 1e-7) |
| `notAlmostEqual(actual, expected, tolerance?, msg?)` | Asserts values differ by more than tolerance |

```typescript
import { greater, almostEqual } from "@frostyeti/assert";

greater(5, 3);                    // ✓ passes
greater(10n, 5n);                 // ✓ works with bigints
almostEqual(0.1 + 0.2, 0.3);      // ✓ handles floating-point precision
almostEqual(1.0, 1.001, 0.01);    // ✓ custom tolerance
```

### Truthiness Assertions

| Function | Description |
|----------|-------------|
| `truthy(value, msg?)` | Asserts value is truthy |
| `ok(value, msg?)` | Alias for `truthy` |
| `falsy(value, msg?)` | Asserts value is falsy |
| `nope(value, msg?)` | Alias for `falsy` |
| `notOk(value, msg?)` | Alias for `falsy` |

```typescript
import { ok, falsy } from "@frostyeti/assert";

ok(1);              // ✓ passes
ok("hello");        // ✓ passes
ok([]);             // ✓ passes (empty array is truthy)
falsy(0);           // ✓ passes
falsy("");          // ✓ passes
falsy(null);        // ✓ passes
```

### Type Assertions

| Function | Description |
|----------|-------------|
| `instanceOf(actual, expectedType, msg?)` | Asserts value is instance of type |
| `notInstanceOf(actual, expectedType, msg?)` | Asserts value is not instance of type |
| `exists<T>(actual, msg?)` | Asserts value is not null or undefined |
| `isError(error, ErrorClass?, msgIncludes?, msg?)` | Validates error type and message |

```typescript
import { instanceOf, exists, isError } from "@frostyeti/assert";

instanceOf(new Date(), Date);     // ✓ passes
instanceOf([], Array);            // ✓ passes
exists("value");                  // ✓ passes
exists(0);                        // ✓ passes (0 exists, just falsy)

try {
  throw new TypeError("bad input");
} catch (e) {
  isError(e, TypeError, "bad");   // ✓ passes
}
```

### String & Array Assertions

| Function | Description |
|----------|-------------|
| `stringIncludes(actual, expected, msg?)` | Asserts string contains substring |
| `arrayIncludes(actual, expected, msg?)` | Asserts array contains all expected values |
| `match(actual, expected, msg?)` | Asserts string matches regex pattern |
| `notMatch(actual, expected, msg?)` | Asserts string does not match regex |
| `objectMatch(actual, expected, msg?)` | Asserts object contains expected subset |

```typescript
import { stringIncludes, arrayIncludes, match, objectMatch } from "@frostyeti/assert";

stringIncludes("hello world", "world");           // ✓ passes
arrayIncludes([1, 2, 3], [1, 3]);                 // ✓ passes
match("test@email.com", /^\w+@\w+\.\w+$/);        // ✓ passes

// Object subset matching
objectMatch(
  { id: 1, name: "Alice", age: 30, city: "NYC" },
  { name: "Alice", age: 30 }                      // ✓ passes (subset)
);
```

### Exception Assertions

| Function | Description |
|----------|-------------|
| `throws(fn, ErrorClass?, msgIncludes?, msg?)` | Asserts function throws |
| `rejects(fn, ErrorClass?, msgIncludes?, msg?)` | Asserts promise rejects |

```typescript
import { throws, rejects } from "@frostyeti/assert";

// Synchronous throws
throws(() => { throw new Error("fail"); });
throws(() => { throw new TypeError("bad"); }, TypeError);
throws(() => { throw new Error("validation failed"); }, Error, "validation");

// Async rejects
await rejects(async () => { throw new Error("async fail"); });
await rejects(
  () => Promise.reject(new TypeError("async type error")),
  TypeError,
  "type error"
);
```

### Utility Functions

| Function | Description |
|----------|-------------|
| `fail(msg?)` | Unconditionally fails with message |
| `unreachable(msg?)` | Marks code that should never execute |
| `unimplemented(msg?)` | Marks unimplemented code paths |
| `debug(...data)` | Debug logging (only outputs when debug enabled) |
| `setDebugTests(enabled)` | Enable/disable debug output |

```typescript
import { unreachable, unimplemented, fail } from "@frostyeti/assert";

function processValue(value: "a" | "b") {
  switch (value) {
    case "a": return 1;
    case "b": return 2;
    default: unreachable("Unexpected value");
  }
}

function futureFeature() {
  unimplemented("TODO: implement OAuth support");
}

// Force test failure
if (unexpectedCondition) {
  fail("This should not happen");
}
```

## Naming Convention

This library removes the `assert` prefix from Deno's `std/assert` function names
to enable cleaner namespace imports:

```typescript
import * as assert from "@frostyeti/assert";

assert.ok(true);
assert.equal(1, 1);
assert.throws(() => { throw new Error(); });
```

| Deno std/assert | @frostyeti/assert |
|-----------------|-------------------|
| `assertEquals` | `equal` |
| `assertNotEquals` | `notEqual` |
| `assertStrictEquals` | `strictEquals` |
| `assertThrows` | `throws` |
| `assertRejects` | `rejects` |
| `assertMatch` | `match` |
| `assertGreater` | `greater` |
| `assertInstanceOf` | `instanceOf` |

## License

[MIT License](./LICENSE.md)

Based on [std/assert](https://jsr.io/@std/assert) from Deno
which is under the [MIT license](https://github.com/denoland/std/blob/main/LICENSE).
