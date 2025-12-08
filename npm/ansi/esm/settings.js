/**
 * The `settings` includes the ANSI settings for the terminal.
 *
 * @module
 */
import { Lazy } from "./_lazy.js";
import { detectMode } from "./detector.js";
import { AnsiModes } from "./enums.js";
import { stderr, stdout } from "@frostyeti/process";
let settings = new Lazy(() => new AnsiSettings(detectMode()));
/**
 * The ANSI settings.
 */
export class AnsiSettings {
  #mode;
  #links;
  /**
   * Creates a new ANSI settings.
   * @param mode The ANSI mode.
   */
  constructor(mode) {
    this.#mode = mode;
    this.#links = this.#mode === AnsiModes.TwentyFourBit;
  }
  /**
   * The current ANSI settings.
   */
  static get current() {
    return settings.value;
  }
  /**
   * Sets the current ANSI settings.
   */
  static set current(value) {
    settings = new Lazy(() => value);
  }
  /**
   * Determines if the standard output is a terminal which
   * the equivalent of calling isatty on `stdout`.
   */
  get stdout() {
    if (this.#mode > 0) {
      return stdout.isTerm();
    }
    return false;
  }
  /**
   * Determines if the standard error is a terminal which
   * the equivalent of calling isatty on `stderr`.
   */
  get stderr() {
    if (this.#mode > 0) {
      return stderr.isTerm();
    }
    return false;
  }
  /**
   * The ANSI mode.
   */
  get mode() {
    return this.#mode;
  }
  /**
   * Sets the ANSI mode.
   */
  set mode(value) {
    this.#mode = value;
  }
  /**
   * Determines if the terminal supports links.
   */
  get links() {
    return this.#links;
  }
  /**
   * Sets if the terminal supports links.
   */
  set links(value) {
    this.#links = value;
  }
}
