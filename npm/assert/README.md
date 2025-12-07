# @frostyeti/assert

## Overview

The frostyeti/assert is now a remix of the `std/assert` library from Deno to enable
modern asserts for Deno, Bun, and NodeJs; available as both npm and jsr
packages.

The overall goal here is to make it easier to write javascript libaries
that target multiple JavaScript runtimes.

![logo](https://raw.githubusercontent.com/frostyeti/js/refs/heads/main/eng/assets/logo.png)

[![JSR](https://jsr.io/badges/@frostyeti/assert)](https://jsr.io/@frostyeti/assert)
[![npm version](https://badge.fury.io/js/@frostyeti%2Fassert.svg)](https://badge.fury.io/js/@frostyeti%2Fassert)
[![GitHub version](https://badge.fury.io/gh/frostyeti%2Fjs.svg)](https://badge.fury.io/gh/frostyeti%2Fjs)

## Documentation

Documentation is available on [jsr.io](https://jsr.io/@frostyeti/assert/doc)

## Usage

```typescript
import { equal, ok, falsy } from "@frostyeti/assert";

// performs a deep equals
equal(1, 1);
ok(true);
fasly(false);
```

## Classes

- `AssertionError` the core assertion error.

## Functions

- `arrayIncludes` - asserts that an array includes values
- `assert` - asserts that a value is truthy.
- `debug` - logs a debug statement for tests. avoids polluting standard out unless debug is enabled.
- `setDebugTests` - sets debugging for writing debug statements to true or false.
- `equal` - asserts that values are deeply equal.
- `exists` - asserts that a value exists.
- `fail` - fails a test by throwing an AssertionError.
- `instanceOf` - asserts that a value is an instance of a type.
- `nope` - asserts that a value is falsy.
- `notOk` - asserts that a value is falsy.
- `notEqual` - asserts that two values are not deeply equal.
- `notInstanceOf` - asserts that a value is not an instance of a type.
- `notStrictEqual` - asserts that two values are not strictly equal (not the same ref).
- `ok` - asserts that a value is truthy.
- `rejects` - asserts that promise returns a rejection.
- `strictEqual` - asserts that two values are strictly equal (same ref).
- `stringIncludes` - asserts that a string includes a value.
- `throws` - asserts that a function throws an exception.
- `truthy` - asserts that a value is truthy.
- `unimplemented` - asserts that a test is not yet implemented.

## TODO

- [x] Remove dependency on chai

## Notes

This module is now a remix of the std/assert library from deno to enable
modern asserts for Deno, Bun, and NodeJs; available as both npm and jsr
packages.


The methods are renamed to enable importing all asserts as a single assert
object. To demonstrate:

```ts
import * as assert from "@frostyeti/assert"

assert.ok()

```

If the @std lib deno packages or something similar were available as official npm
and jsr packages, this package would not exist.  It's only here to reduce the
friction of writing cross runtime libraries.

## License

[MIT License](./LICENSE.md)

The majority of the code is now from std/assert which is under the MIT license.
<https://jsr.io/@std/assert/1.0.6/LICENSE>
