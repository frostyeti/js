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
export const AnsiModes = {
    /**
     * Automatic color mode detection.
     */
    Auto: -1 as AnsiMode,
    /**
     * No color support.
     */
    None: 0 as AnsiMode,
    /**
     * 3-bit color mode (8 colors).
     */
    ThreeBit: 1 as AnsiMode,
    /**
     * 4-bit color mode (16 colors).
     */
    FourBit: 2 as AnsiMode,
    /**
     * 8-bit color mode (256 colors).
     */
    EightBit: 4 as AnsiMode,
    /**
     * 24-bit true color mode (16.7M colors).
     */
    TwentyFourBit: 8 as AnsiMode,

    /**
     * The ANSI mode names.
     * @returns {string[]} Array of mode names
     */
    names: function (): string[] {
        return ["auto", "none", "3bit", "4bit", "8bit", "24bit"];
    },

    /**
     * The ANSI mode values.
     * @returns {number[]} Array of mode values
     */
    values: function (): number[] {
        return [-1, 0, 1, 2, 4, 8];
    },

    /**
     * Gets the numeric value of the ANSI mode.
     * @param name The name of the ANSI mode.
     * @returns The numeric value of the ANSI mode.
     */
    toValue: function (name: string): number {
        switch (name) {
            case "auto":
            case "Auto":
                return -1;
            case "none":
            case "None":
                return 0;
            case "3bit":
            case "3Bit":
            case "ThreeBit":
                return 1;

            case "4bit":
            case "4Bit":
            case "FourBit":
                return 2;
            case "8bit":
            case "8Bit":
            case "EightBit":
                return 4;
            case "24bit":
            case "24Bit":
            case "TwentyFourBit":
            case "TrueColor":
            case "truecolor":
                return 8;
        }

        return -1;
    },

    /**
     * Gets the string representation of the ANSI mode.
     * @param value The numeric value of the ANSI mode.
     * @returns The string representation of the ANSI mode.
     */
    toString: function (value: number): string {
        switch (value) {
            case -1:
                return "auto";
            case 0:
                return "none";
            case 1:
                return "3bit";
            case 2:
                return "4bit";
            case 4:
                return "8bit";
            case 8:
                return "24bit";
        }

        return "auto";
    },
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
export const AnsiLogLevels = {
    None: 0 as AnsiLogLevel,
    Critical: 2 as AnsiLogLevel,
    Error: 3 as AnsiLogLevel,
    Warning: 4 as AnsiLogLevel,
    Notice: 5 as AnsiLogLevel,
    Information: 6 as AnsiLogLevel,
    Debug: 7 as AnsiLogLevel,
    Trace: 8 as AnsiLogLevel,

    /**
     * Gets the names of the log levels.
     * @returns {string[]} Array of log level names
     */
    names: function (): string[] {
        return ["none", "critical", "error", "warning", "notice", "information", "debug", "trace"];
    },

    /**
     * Gets the values of the log levels.
     * @returns {number[]} Array of log level values
     */
    values: function (): number[] {
        return [0, 2, 3, 4, 5, 6, 7, 8];
    },

    /**
     * Gets the numeric value of the log level.
     * @param name The name of the log level/
     * @returns The numeric value of the log level.
     */
    toValue: function (name: string): number {
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
    toString: function (value: number): string {
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
