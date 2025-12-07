# @frostyeti/process

## Overview

Cross runtime current process features such as the pid, args, execPath, cwd, chdir
and standard streams for Bun, Deno, and NodeJs. Experimental support for the browser.

The browser polyfill is experimental. Chdir calls pushState. 
The standard streams write to the console in the browser.  Exit closes the window.

![logo](https://raw.githubusercontent.com/frostyeti/js/refs/heads/master/eng/assets/logo.png)

[![JSR](https://jsr.io/badges/@frostyeti/process)](https://jsr.io/@frostyeti/process)
[![npm version](https://badge.fury.io/js/@frostyeti%2Fprocess.svg)](https://badge.fury.io/js/@frostyeti%2Fprocess)
[![GitHub version](https://badge.fury.io/gh/frostyeti%2Fjs.svg)](https://badge.fury.io/gh/frostyeti%2Fjs)

## Documentation

Documentation is available on [jsr.io](https://jsr.io/@frostyeti/process/doc)

A list of other modules can be found at [github.com/frostyeti/js](https://github.com/frostyeti/js)

## Usage

```typescript
import { args, execPath, cwd, chdir, stdout, stdin } from "@frostyeti/process";

console.log(args); // the args passed to current process.
console.log(execPath()); // path to executable for the current process.
console.log(cwd()); // the current working directory.

chdir(".."); // changes the current working directory.

console.log(cwd()); // updated current working directory.

stdout.writeSync(new TextEncoder().encode("hello world\n"));

// read stdin
const buffer = new Uint8Array(1024);
const bytesRead = stdin.readSync(buffer);

if (bytesRead && bytesRead.length > 0) {
    // write it back out
    stdout.writeSync(buffer.subarray(0, bytesRead))
}

```

## Constants

### Runtime

- **args** - Array of arguments passed to the current process.
- **pid** - The id of the current process.
- **stdin** - The standard input stream which is a stream reader that uses Uint8Array.
- **stdout** - The standard output stream which is a stream writer that uses Uint8Array.
- **stderr** - The standard error stream which is a stream writer that uses Uint8Array.

### Functions

- **cwd** - Gets the current working directory.
- **chdir** - Changes the current working directory.
- **execPath** - Gets the path of the executable that spawned the current process.
- **exit** - Exits the current process with the exit code provided. If the exit code is not set, its zero.
- **popd** - Pops the last directory and returns it while changing the current directory to the last one from history.
- **pushd** - Pushs a path to chdir and records the path in history.

## License

[MIT License](./LICENSE.md)
