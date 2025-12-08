/**
 * ## Overview
 *
 * The `ansi` module provides color detection, writing ansi
 * codes, and an ansi writer.
 *
 * ![logo](https://raw.githubusercontent.com/frostyeti/js/refs/heads/main/.eng/assets/logo.png)
 *
 * [![JSR](https://jsr.io/badges/@frostyeti/ansi)](https://jsr.io/@frostyeti/ansi)
 * [![npm version](https://badge.fury.io/js/@frostyeti%2Fansi.svg)](https://badge.fury.io/js/@frostyeti%2Fansi)
 * [![GitHub version](https://badge.fury.io/gh/frostyeti%2Fjs-frostyeti.svg)](https://badge.fury.io/gh/frostyeti%2Fjs-frostyeti)
 *
 * ## Documentation
 *
 * Documentation is available on [jsr.io](https://jsr.io/@frostyeti/ansi/doc)
 *
 * A list of other modules can be found at [github.com/frostyeti/js](https://github.com/frostyeti/js)
 *
 * ## Usage
 *
 * ```typescript
 * import { blue, bgBlue, green, bold, apply } from "@frostyeti/ansi";
 *
 * console.log(blue("test"));
 * console.log(green("success"));
 * console.log(bgBlue("background blue"));
 * console.log(apply("This is a test", [bold, blue, bgBlue]));
 * ```
 *
 * ## Notes
 *
 * The core ansi functions in the `styles` module comes from
 * Deno's `@std/fmt/color` with addition modififcations such as
 * being less tied to deno and additional functions like `apply`
 * and `rgb24To8`.
 *
 * The `detector` module is heavily based on support color, but
 * isn't a direct port.
 *
 * The `@frostyeti/process` module is used to determine if the
 * streams are not redirected.
 *
 * ## License
 *
 * [Deno's MIT License](https://jsr.io/@std/fmt/1.0.6/LICENSE)
 *
 * [Support Colors MIT License](https://github.com/chalk/chalk/blob/main/license)
 *
 * [MIT License](./LICENSE.md)
 *
 * @module
 */
export * from "./styles.ts";
export * from "./enums.ts";
export * from "./settings.ts";
