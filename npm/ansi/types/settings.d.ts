import { type AnsiMode } from "./enums.js";
/**
 * The ANSI settings.
 */
export declare class AnsiSettings {
  #private;
  /**
   * Creates a new ANSI settings.
   * @param mode The ANSI mode.
   */
  constructor(mode: AnsiMode);
  /**
   * The current ANSI settings.
   */
  static get current(): AnsiSettings;
  /**
   * Sets the current ANSI settings.
   */
  static set current(value: AnsiSettings);
  /**
   * Determines if the standard output is a terminal which
   * the equivalent of calling isatty on `stdout`.
   */
  get stdout(): boolean;
  /**
   * Determines if the standard error is a terminal which
   * the equivalent of calling isatty on `stderr`.
   */
  get stderr(): boolean;
  /**
   * The ANSI mode.
   */
  get mode(): AnsiMode;
  /**
   * Sets the ANSI mode.
   */
  set mode(value: AnsiMode);
  /**
   * Determines if the terminal supports links.
   */
  get links(): boolean;
  /**
   * Sets if the terminal supports links.
   */
  set links(value: boolean);
}
