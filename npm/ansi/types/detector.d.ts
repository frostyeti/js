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
 */
export declare function detectMode(): AnsiMode;
