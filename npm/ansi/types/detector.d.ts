/**
 * The `detector` module provides functions to detect the ANSI
 * color mode of the terminal.
 *
 * @module
 */
import { type AnsiMode } from "./enums.js";
/**
 * Detects the ANSI mode of the terminal.
 * @returns The ANSI mode of the terminal.
 *
 * @example
 * ```typescript
 * import { detectMode, AnsiModes } from '@frostyeti/ansi/detector';
 *
 * const mode = detectMode();
 * if (mode === AnsiModes.TwentyFourBit) {
 *     console.log("Terminal supports 24-bit color.");
 * } else if (mode === AnsiModes.EightBit) {
 *     console.log("Terminal supports 8-bit color.");
 * } else if (mode === AnsiModes.FourBit) {
 *     console.log("Terminal supports 4-bit color.");
 * } else {
 *     console.log("Terminal does not support ANSI colors.");
 * }
 * ```
 */
export declare function detectMode(): AnsiMode;
