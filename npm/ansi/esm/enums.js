/**
 * The `enums` module provides ANSI color mode and log level enumerations.
 *
 * @module
 */
/**
 * Contains ANSI color mode constants and utility functions for mode conversion.
 * @enum {number}
 * @property {AnsiMode} Auto - Automatic color mode detection (-1)
 * @property {AnsiMode} None - No color support (0)
 * @property {AnsiMode} ThreeBit - 3-bit color mode (8 colors) (1)
 * @property {AnsiMode} FourBit - 4-bit color mode (16 colors) (2)
 * @property {AnsiMode} EightBit - 8-bit color mode (256 colors) (4)
 * @property {AnsiMode} TwentyFourBit - 24-bit true color mode (16.7M colors) (8)
 * @property {function(): string[]} names - Returns an array of mode names
 * @property {function(): number[]} values - Returns an array of mode values
 * @property {function(name: string): number} toValue - Converts a mode name to its numeric value
 * @property {function(value: number): string} toString - Converts a numeric value to its mode name
 */
export const AnsiModes = {
  /**
   * Automatic color mode detection.
   */
  Auto: -1,
  /**
   * No color support.
   */
  None: 0,
  /**
   * 3-bit color mode (8 colors).
   */
  ThreeBit: 3,
  /**
   * 4-bit color mode (16 colors).
   */
  FourBit: 4,
  /**
   * 8-bit color mode (256 colors).
   */
  EightBit: 8,
  /**
   * 24-bit true color mode (16.7M colors).
   */
  TwentyFourBit: 24,
  equals: function (a, b) {
    if (typeof b === "string") {
      return a === this.toValue(b);
    } else if (typeof b === "number") {
      return a === b;
    } else {
      return a === b;
    }
  },
  /**
   * The ANSI mode names.
   * @returns {string[]} Array of mode names
   */
  names: function () {
    return [
      "auto",
      "none",
      "3bit",
      "xterm-16color",
      "xterm-256color",
      "truecolor",
    ];
  },
  /**
   * The ANSI mode values.
   * @returns {number[]} Array of mode values
   */
  values: function () {
    return [-1, 0, 3, 4, 8, 24];
  },
  /**
   * Gets the numeric value of the ANSI mode.
   * @param name The name of the ANSI mode.
   * @returns The numeric value of the ANSI mode.
   */
  toValue: function (name) {
    switch (name) {
      case "auto":
      case "Auto":
        return -1;
      case "0":
      case "no":
      case "false":
      case "False":
      case "off":
      case "Off":
      case "none":
      case "None":
      case "NONE":
      case "no-color":
      case "No-Color":
      case "nocolor":
      case "Nocolor":
      case "noColor":
        return 0;
      case "3":
      case "3bit":
      case "3Bit":
      case "ThreeBit":
      case "threebit":
      case "Threebit":
        return 3;
      case "4":
      case "xterm-16color":
      case "Xterm-16Color":
      case "16color":
      case "16Color":
      case "vt100":
      case "vt100-color":
      case "vt200":
      case "vt200-color":
      case "screen":
      case "linux":
      case "cygwin":
      case "ansi":
      case "4bit":
      case "4Bit":
      case "FourBit":
      case "4colors":
      case "fourbit":
      case "Fourbit":
        return 4;
      case "8":
      case "8bit":
      case "8Bit":
      case "EightBit":
      case "256":
      case "256color":
      case "256Color":
      case "screen-256color":
      case "Screen-256Color":
      case "xterm-256color":
      case "Xterm-256Color":
        return 8;
      case "true":
      case "full":
      case "24":
      case "24bit":
      case "24Bit":
      case "TwentyFourBit":
      case "truecolor":
      case "TrueColor":
      case "true-color":
      case "True-Color":
      case "xterm-truecolor":
      case "Xterm-TrueColor":
      case "gnome-terminal":
      case "kitty":
      case "iTerm2":
      case "alacritty":
      case "wezterm":
      case "terminator":
      case "hyper":
      case "windows-terminal":
      case "ms-terminal":
      case "ghostty":
      case "xterm-ghostty":
      case "xterm-kitty":
      case "alacritty-nightly":
      case "terminology":
      case "mintty":
      case "terminus":
        return 24;
    }
    return -1;
  },
  /**
   * Gets the string representation of the ANSI mode.
   * @param value The numeric value of the ANSI mode.
   * @returns The string representation of the ANSI mode.
   */
  toString: function (value) {
    switch (value) {
      case -1:
        return "auto";
      case 0:
        return "none";
      case 3:
        return "3bit";
      case 4:
        return "xterm-16color";
      case 8:
        return "xterm-256color";
      case 24:
        return "truecolor";
    }
    return "auto";
  },
};
/**
 * Compares two ANSI modes for equality.
 * @param a The first ANSI mode.
 * @param b The second ANSI mode, number, or string representation.
 * @returns True if the modes are equal, false otherwise.
 *
 * @example
 * ```typescript
 * import { AnsiModes, equals } from '@frostyeti/ansi/enums';
 *
 * const mode1 = AnsiModes.FourBit;
 * const mode2 = 4;
 * const mode3 = "4bit";
 *
 * console.log(equals(mode1, mode2)); // true
 * console.log(equals(mode1, mode3)); // true
 * console.log(equals(mode2, mode3)); // true
 * ```
 */
export function equals(a, b) {
  return AnsiModes.equals(a, b);
}
/**
 * Enumeration of ANSI log levels with associated utility functions.
 * @enum {number}
 * @property {number} None - No logging (0)
 * @property {number} Critical - Critical error logging (2)
 * @property {number} Error - Error logging (3)
 * @property {number} Warning - Warning logging (4)
 * @property {number} Notice - Notice logging (5)
 * @property {number} Information - Information logging (6)
 * @property {number} Debug - Debug logging (7)
 * @property {number} Trace - Trace logging (8)
 *
 * @method names Returns an array of log level names in lowercase
 * @returns {string[]} Array of log level names
 *
 * @method values Returns an array of log level numeric values
 * @returns {number[]} Array of log level values
 *
 * @method toValue Converts a log level name to its numeric value
 * @param {string} name - The name of the log level (case-insensitive)
 * @returns {number} The numeric value of the log level, defaults to 4 (Warning) if not found
 *
 * @method toString Converts a numeric log level value to its string representation
 * @param {number} value - The numeric value of the log level
 * @returns {string} The lowercase string representation of the log level, empty string if not found
 */
export const AnsiLogLevels = {
  None: 0,
  Critical: 2,
  Error: 3,
  Warning: 4,
  Notice: 5,
  Information: 6,
  Debug: 7,
  Trace: 8,
  /**
   * Gets the names of the log levels.
   * @returns {string[]} Array of log level names
   */
  names: function () {
    return [
      "none",
      "critical",
      "error",
      "warning",
      "notice",
      "information",
      "debug",
      "trace",
    ];
  },
  /**
   * Gets the values of the log levels.
   * @returns {number[]} Array of log level values
   */
  values: function () {
    return [0, 2, 3, 4, 5, 6, 7, 8];
  },
  /**
   * Gets the numeric value of the log level.
   * @param name The name of the log level/
   * @returns The numeric value of the log level.
   */
  toValue: function (name) {
    switch (name) {
      case "none":
      case "None":
        return 0;
      case "critical":
      case "Critical":
      case "fatal":
      case "Fatal":
        return 2;
      case "error":
      case "Error":
        return 3;
      case "warn":
      case "Warn":
      case "warning":
      case "Warning":
        return 4;
      case "notice":
      case "Notice":
        return 5;
      case "info":
      case "Info":
      case "information":
      case "Information":
        return 6;
      case "debug":
      case "Debug":
        return 7;
      case "trace":
      case "Trace":
        return 8;
    }
    return 4;
  },
  /**
   * Gets the string representation of the log level.
   * @param value The numeric value of the log level.
   * @returns The string representation of the log level.
   */
  toString: function (value) {
    switch (value) {
      case 0:
        return "none";
      case 2:
        return "critical";
      case 3:
        return "error";
      case 4:
        return "warning";
      case 5:
        return "notice";
      case 6:
        return "information";
      case 7:
        return "debug";
      case 8:
        return "trace";
    }
    return "";
  },
};
