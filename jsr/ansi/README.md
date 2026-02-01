# @frostyeti/ansi

## Overview

The `ansi` module provides color detection, writing ansi
codes, and an ansi writer.

![logo](https://raw.githubusercontent.com/frostyeti/js/refs/heads/master/eng/assets/logo.png)

[![JSR](https://jsr.io/badges/@frostyeti/ansi)](https://jsr.io/@frostyeti/ansi)
[![npm version](https://badge.fury.io/js/@frostyeti%2Fansi.svg)](https://badge.fury.io/js/@frostyeti%2Fansi)
[![GitHub version](https://badge.fury.io/gh/frostyeti%2Fjs-frostyeti.svg)](https://badge.fury.io/gh/frostyeti%2Fjs-frostyeti)

## Documentation

Documentation is available on [jsr.io](https://jsr.io/@frostyeti/ansi/doc)

A list of other modules can be found at [github.com/frostyeti/js](https://github.com/frostyeti/js)

## Usage

```typescript
import { blue, bgBlue, green, bold, apply } from "@frostyeti/ansi";

console.log(blue("test"));
console.log(green("success"));
console.log(bgBlue("background blue"));
console.log(apply("This is a test", bold, blue, bgBlue));
```

## Classes

- `AnsiSettings` - manages ANSI color settings including mode, stdout/stderr terminal detection, and hyperlink support.

## Constants

- `AnsiModes` - ANSI color mode enumeration with utility functions (Auto, None, ThreeBit, FourBit, EightBit, TwentyFourBit).
- `AnsiLogLevels` - log level enumeration with utility functions (None, Critical, Error, Warning, Notice, Information, Debug, Trace).

## Types

- `AnsiMode` - type representing ANSI color modes (-1, 0, 3, 4, 8, 24).
- `AnsiLogLevel` - type representing log levels (0-8).
- `Rgb` - interface for RGB color values with r, g, b components (0-255).

## Functions

### Color Control

- `setColorEnabled` - enables or disables color output globally.
- `isColorEnabled` - checks if color output is currently enabled.
- `detectMode` - detects the ANSI color mode of the terminal.

### Style Functions

- `apply` - applies multiple ANSI styles to a string.
- `reset` - resets all text modifications.
- `bold` - makes text bold.
- `dim` - dims the text (reduced intensity).
- `italic` - makes text italic.
- `underline` - underlines text.
- `inverse` - inverts foreground and background colors.
- `hidden` - hides text.
- `strikethrough` - adds strikethrough to text.

### Foreground Colors (Standard)

- `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray`

### Foreground Colors (Bright)

- `brightBlack`, `brightRed`, `brightGreen`, `brightYellow`, `brightBlue`, `brightMagenta`, `brightCyan`, `brightWhite`

### Background Colors (Standard)

- `bgBlack`, `bgRed`, `bgGreen`, `bgYellow`, `bgBlue`, `bgMagenta`, `bgCyan`, `bgWhite`

### Background Colors (Bright)

- `bgBrightBlack`, `bgBrightRed`, `bgBrightGreen`, `bgBrightYellow`, `bgBrightBlue`, `bgBrightMagenta`, `bgBrightCyan`, `bgBrightWhite`

### Extended Colors

- `rgb8` - applies 8-bit (256 color) foreground color.
- `bgRgb8` - applies 8-bit (256 color) background color.
- `rgb24` - applies 24-bit (true color) foreground color.
- `bgRgb24` - applies 24-bit (true color) background color.
- `rgb24To8` - applies 24-bit color downgraded to 8-bit.

### Custom Color Definitions

- `defineColor` - creates a color function that downgrades gracefully based on terminal capability.
- `defineBgColor` - creates a background color function that downgrades gracefully based on terminal capability.

### Utilities

- `stripAnsiCode` - removes all ANSI escape codes from a string.
- `equals` - compares two ANSI modes for equality.

## Notes

The core ansi functions in the `styles` module comes from
Deno's `@std/fmt/color` with addition modififcations such as
being less tied to deno and additional functions like `apply`
and `rgb24To8`.

The `detector` module is heavily based on support color, but
isn't a direct port.

The `@frostyeti/process` module is used to determine if the
streams are not redirected.

## License

[Deno's MIT License](https://jsr.io/@std/fmt/1.0.6/LICENSE)

[Support Colors MIT License](https://github.com/chalk/chalk/blob/main/license)

[MIT License](./LICENSE.md)
