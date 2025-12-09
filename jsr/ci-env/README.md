# @frostyeti/ci-env

## Overview

The `ci-env` enables determining if you are within a ci pipeline
and has utilties such as writing logs or setting environment variables
for different ci tools.  

This module will evolve over time to enable using common ci environment
variables and make it easier to deal with secrets, environment variables
and outputs in ci pipelines.

![logo](https://raw.githubusercontent.com/frostyeti/js/refs/heads/master/eng/assets/logo.png)

[![JSR](https://jsr.io/badges/@frostyeti/env)](https://jsr.io/@frostyeti/env)
[![npm version](https://badge.fury.io/js/@frostyeti%2Fenv.svg)](https://badge.fury.io/js/@frostyeti%2Fenv)
[![GitHub version](https://badge.fury.io/gh/frostyeti%2Fjs.svg)](https://badge.fury.io/gh/frostyeti%2Fjs)

## Documentation

Documentation is available on [jsr.io](https://jsr.io/@frostyeti/env/doc)

A list of other modules can be found at [github.com/frostyeti/js](https://github.com/frostyeti/js)

## Usage

```typescript
import * as ci from "@frostyeti/ci-env";

console.log(ci.CI_DRIVER);
console.log(ci.CI);

ci.setVar("test", "whatever", true, false);
ci.prependPath("./bin");
```


## License

[MIT License](./LICENSE.md)
