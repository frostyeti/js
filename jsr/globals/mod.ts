/**
 * ## Overview
 *
 * Gets information about the current javascript rutime such as
 * the runtime name, version, the current os, and the current architecture.
 *
 * The library primarily enables writing cross platform and runtime code or dealing
 * with global variables.
 *
 * ![logo](https://raw.githubusercontent.com/frostyeti/js/refs/heads/master/eng/assets/logo.png)
 *
 * [![JSR](https://jsr.io/badges/@frostyeti/globals)](https://jsr.io/@frostyeti/globals)
 * [![npm version](https://badge.fury.io/js/@frostyeti%2Fglobals.svg)](https://badge.fury.io/js/@frostyeti%2Fglobals)
 * [![GitHub version](https://badge.fury.io/gh/frostyeti%2Fjs.svg)](https://badge.fury.io/gh/frostyeti%2Fjs)
 *
 * ## Documentation
 *
 * Documentation is available on [jsr.io](https://jsr.io/@frostyeti/globals/doc)
 *
 * A list of other modules can be found at [github.com/frostyeti/js](https://github.com/frostyeti/js)
 *
 * ## Usage
 *
 * ```typescript
 * import {RUNTIME, DENO, PLATFORM, WINDOWS, EOL} from "@frostyeti/globals";
 *
 * console.log(RUNTIME); // "deno", "bun", "node", "browser", "cloudflare", etc
 * console.log(DENO); // true, false
 * console.log(PLATFORM); // "linux", "darwin", "windows", etc
 * console.log(WINDOWS); // true, false
 * console.log(EOL); // "\r\n", "\n", etc
 * ```
 *
 * ## Functions
 *
 * - `hasGlobal(name)` - checks if a global variable exists.
 * - `getGlobal(name)` - gets a global variable if it exists.
 * - `setGlobal(name, value)` - sets a global variable if it does not exist.
 *
 * ## Global Variables
 *
 * - `globals` - the global object for the current runtime which typicall maps to globalThis.
 *
 * ## Constants
 *
 * ### Runtime
 *
 * - `BUN` - a boolean that indicates when the current runtime is bun.
 * - `DENO` - a boolean that indicates when the current runtime is deno.
 * - `NODELIKE` - a boolean that indicates when the current runtime is nodejs like.
 * - `NODE` - a boolean that indicates when the current runtime is nodejs.
 * - `CLOUDFLARE` - a boolean that indicates when the current runtime is cloudflare.
 * - `BROWSER` - a boolean that indicates whens the current runtime is the browser.
 * - `VERSION` - the runtime version. maybe undefined.
 * - `NODE_VERSION` - the version of node.
 * - `RUNTIME` - the name of the current runtime.
 *
 * ### OS
 *
 * - `PLATFORM` - The current operating system such as linux, darwin, windows.
 * - `ARCH` - The current operating system architecture such as amd64, x86, arm64, etc.
 * - `IS_64BIT` - a boolean that indicates the os is 64 bit architecture.
 * - `WINDOWS` - a boolean that indicates the os is windows.
 * - `LINUX` - a boolean that indicates the os is linux.
 * - `DARWIN` - a boolean that indicates the os is darwing.
 * - `PATH_SEP` - The path separator for the current platform. `:` or `;`.
 * - `DIR_SEP` - The primary directory separator for the current platform. `\\` or `/`.
 * - `DIR_SEP_RE` - The regular expression for splitting a path into components.
 * - `EOL` - The end of line/new line marker for the current platform. `\r\n` or `\n`.
 * - `DEV_NULL` - The path to the null device for the current platform. `NUL` or `/dev/null`.
 *
 * ## License
 *
 * [MIT License](./LICENSE.md)
 *
 * @module
 */

export * from "./globals.ts";
export * from "./runtime_info.ts";
export * from "./os.ts";
