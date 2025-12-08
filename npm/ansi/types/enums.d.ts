/**
 * The `enums` module provides ANSI color mode and log level enumerations.
 *
 * @module
 */
/**
 * ANSI color mode enumeration.
 */
export type AnsiMode = -1 | 0 | 1 | 2 | 4 | 8;
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
export declare const AnsiModes: {
  /**
   * Automatic color mode detection.
   */
  Auto: AnsiMode;
  /**
   * No color support.
   */
  None: AnsiMode;
  /**
   * 3-bit color mode (8 colors).
   */
  ThreeBit: AnsiMode;
  /**
   * 4-bit color mode (16 colors).
   */
  FourBit: AnsiMode;
  /**
   * 8-bit color mode (256 colors).
   */
  EightBit: AnsiMode;
  /**
   * 24-bit true color mode (16.7M colors).
   */
  TwentyFourBit: AnsiMode;
  /**
   * The ANSI mode names.
   * @returns {string[]} Array of mode names
   */
  names: () => string[];
  /**
   * The ANSI mode values.
   * @returns {number[]} Array of mode values
   */
  values: () => number[];
  /**
   * Gets the numeric value of the ANSI mode.
   * @param name The name of the ANSI mode.
   * @returns The numeric value of the ANSI mode.
   */
  toValue: (name: string) => number;
  /**
   * Gets the string representation of the ANSI mode.
   * @param value The numeric value of the ANSI mode.
   * @returns The string representation of the ANSI mode.
   */
  toString: (value: number) => string;
};
export type AnsiLogLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | number;
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
export declare const AnsiLogLevels: {
  None: AnsiLogLevel;
  Critical: AnsiLogLevel;
  Error: AnsiLogLevel;
  Warning: AnsiLogLevel;
  Notice: AnsiLogLevel;
  Information: AnsiLogLevel;
  Debug: AnsiLogLevel;
  Trace: AnsiLogLevel;
  /**
   * Gets the names of the log levels.
   * @returns {string[]} Array of log level names
   */
  names: () => string[];
  /**
   * Gets the values of the log levels.
   * @returns {number[]} Array of log level values
   */
  values: () => number[];
  /**
   * Gets the numeric value of the log level.
   * @param name The name of the log level/
   * @returns The numeric value of the log level.
   */
  toValue: (name: string) => number;
  /**
   * Gets the string representation of the log level.
   * @param value The numeric value of the log level.
   * @returns The string representation of the log level.
   */
  toString: (value: number) => string;
};
