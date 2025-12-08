# @frostyeti/args

## Overview

Split, join, splat command line arguments.

![logo](https://raw.githubusercontent.com/frostyeti/js/refs/heads/master/eng/assets/logo.png)

[![JSR](https://jsr.io/badges/@frostyeti/args)](https://jsr.io/@frostyeti/args)
[![npm version](https://badge.fury.io/js/@frostyeti%2Fargs.svg)](https://badge.fury.io/js/@frostyeti%2Fargs)
[![GitHub version](https://badge.fury.io/gh/frostyeti%2Fjs.svg)](https://badge.fury.io/gh/frostyeti%2Fjs)

## Documentation

Documentation is available on [jsr.io](https://jsr.io/@frostyeti/args/doc)

A list of other modules can be found at [github.com/frostyeti/js](https://github.com/frostyeti/js)

## Usage

```typescript
import {split, join, splat} from "@frostyeti/args";

console.log(split("echo hello world")); // ["echo", "hello", "world"]

console.log(join(["echo", "hello", "world"])); // "echo hello world"

console.log(join(["echo", "hello world"])); // "echo \"hello world\""

const args = splat({
    "foo": "bar",
    splat: {
        command: ["git", "clone"],
    } as SplatOptions,
});

console.log(args); // ["git", "clone", "--foo", "bar"]
```

## TODO

- [ ] Add support for argument parsing

## Functions

- `split` - splits a string into an array of arguments/args.
- `join` - joins an array of arguments/args into a string.
- `splat` - converts an object with args into an array of arguments/args.

## License

[MIT License](./LICENSE.md)
