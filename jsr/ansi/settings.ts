/**
 * The `settings` includes the ANSI settings for the terminal.
 *
 * @module
 */
import { Lazy } from "./_lazy.ts";
import { detectMode } from "./detector.ts";
import { type AnsiMode, AnsiModes } from "./enums.ts";
import { stderr, stdout } from "@frostyeti/process";

let settings = new Lazy<AnsiSettings>(() => new AnsiSettings(detectMode()));

/**
 * The ANSI settings.
 */
export class AnsiSettings {
    #mode: AnsiMode;
    #links: boolean;

    /**
     * Creates a new ANSI settings.
     * @param mode The ANSI mode.
     */
    constructor(mode: AnsiMode) {
        this.#mode = mode;
        this.#links = this.#mode === AnsiModes.TwentyFourBit;
    }

    /**
     * The current ANSI settings.
     */
    static get current(): AnsiSettings {
        return settings.value;
    }

    /**
     * Sets the current ANSI settings.
     */
    static set current(value: AnsiSettings) {
        settings = new Lazy<AnsiSettings>(() => value);
    }

    /**
     * Determines if the standard output is a terminal which
     * the equivalent of calling isatty on `stdout`.
     */
    get stdout(): boolean {
        if (this.#mode > 0) {
            return stdout.isTerm();
        }

        return false;
    }

    /**
     * Determines if the standard error is a terminal which
     * the equivalent of calling isatty on `stderr`.
     */
    get stderr(): boolean {
        if (this.#mode > 0) {
            return stderr.isTerm();
        }

        return false;
    }

    /**
     * The ANSI mode.
     */
    get mode(): AnsiMode {
        return this.#mode;
    }

    /**
     * Sets the ANSI mode.
     */
    set mode(value: AnsiMode) {
        this.#mode = value;
    }

    /**
     * Determines if the terminal supports links.
     */
    get links(): boolean {
        return this.#links;
    }

    /**
     * Sets if the terminal supports links.
     */
    set links(value: boolean) {
        this.#links = value;
    }
}
