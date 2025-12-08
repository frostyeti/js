/**
 * The `detector` module provides functions to detect the ANSI
 * color mode of the terminal.
 *
 * @module
 */

import { DARWIN, globals, loadOsModule, WINDOWS } from "./globals.ts";
import { get, has } from "@frostyeti/env";
import { type AnsiMode, AnsiModes } from "./enums.ts";

let RELEASE = "";
let args: string[] = [];

if (globals.Deno) {
    RELEASE = globals.Deno.osRelease();
    args = globals.Deno.args;
} else if (globals.process) {
    RELEASE = (loadOsModule()?.release()) || "";
    args = globals.process.argv.slice(2);
}

/**
 * Determines if the terminal is ANSI compatible by checking the `TERM` environment variable.
 * @returns `true` if the terminal is ANSI compatible, `false` otherwise.
 */
function isTermVariableAnsiCompatible(): boolean {
    const set = [
        "^xterm",
        "^rxvt",
        "^cygwin",
        "ansi",
        "linux",
        "konsole",
        "tmux",
        "alacritty",
        "^vt100",
        "^vt220",
        "^vt220",
        "^vt320",
        "^screen",
    ];

    const term = get("TERM");
    if (term === undefined) {
        return false;
    }

    if (term === "dumb") {
        return false;
    }

    const t = term.toLowerCase();

    for (const s of set) {
        if (s[0] === "^") {
            if (t === s.substring(1)) {
                return true;
            }

            continue;
        }

        if (t === s) {
            return true;
        }
    }

    return false;
}

/**
 * Gets the CI environment variable and determines if the terminal is ANSI compatible.
 * @returns The ANSI mode if the terminal is ANSI compatible, `null` otherwise.
 */
function detectCi(): AnsiMode | null {
    if (has("CI")) {
        if (has("GITHUB_ACTIONS") || has("GITEA_ACTIONS")) {
            return AnsiModes.FourBit;
        }

        if (
            ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "BUILDKITE", "DRONE"].some((sign) =>
                has(sign)
            ) ||
            get("CI_NAME") === "codeship"
        ) {
            return AnsiModes.FourBit;
        }

        return AnsiModes.FourBit;
    }

    const teamCityVersion = get("TEAMCITY_VERSION");
    if (teamCityVersion) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(teamCityVersion)
            ? AnsiModes.FourBit
            : AnsiModes.None;
    }

    return null;
}

/**
 * Detects the ANSI mode of the terminal.
 * @returns The ANSI mode of the terminal.
 */
export function detectMode(): AnsiMode {
    const noColor = args.includes("--no-color") ||
        args.includes("--nocolor");

    if (noColor) {
        return AnsiModes.None;
    }

    if (globals.Deno && globals.Deno.noColor) {
        return AnsiModes.None;
    }

    const index = args.indexOf("--color");
    const next = index + 1;
    let color = "";
    if (next < args.length) {
        const c = args[next];
        if (!c.startsWith("-")) {
            color = c;
        }
    }

    if (color.length === 0) {
        color = get("FORCE_COLOR") || get("COLOR") || get("ANSI_COLORS") ||
            get("BEARZ_ANSI_COLOR") || "";
    }

    if (color.length > 0) {
        switch (color) {
            case "3":
            case "3bit":
                return AnsiModes.ThreeBit;

            case "4":
            case "4bit":
                return AnsiModes.FourBit;

            case "8":
            case "8bit":
                return AnsiModes.EightBit;

            case "24":
            case "24bit":
            case "truecolor":
            case "color":
            case "true":
            case "true-color":
            case "full":
                return AnsiModes.TwentyFourBit;
            case "none":
            case "false":
            case "no-color":
            case "no":
            case "nocolor":
            case "0":
                return AnsiModes.None;
        }
    }

    const term = get("TERM");

    if (has("TF_BUILD") && has("AGENT_NAME")) {
        return AnsiModes.FourBit;
    }

    const ci = detectCi();
    if (ci !== null) {
        return ci;
    }

    if (get("COLORTERM") === "truecolor") {
        return AnsiModes.TwentyFourBit;
    }

    if (term === "xterm-kitty") {
        return AnsiModes.TwentyFourBit;
    }

    if (DARWIN) {
        const termProgram = get("TERM_PROGRAM");
        if (termProgram !== undefined) {
            const version = Number.parseInt(
                (get("TERM_PROGRAM_VERSION") || "").split(".")[0],
                10,
            );

            switch (termProgram) {
                case "iTerm.app": {
                    return version >= 3 ? AnsiModes.TwentyFourBit : AnsiModes.EightBit;
                }

                case "Apple_Terminal": {
                    return AnsiModes.EightBit;
                }
                    // No default
            }
        }
    }

    if (term) {
        if (/-256(color)?$/i.test(term)) {
            return AnsiModes.EightBit;
        }

        if (isTermVariableAnsiCompatible()) {
            return AnsiModes.FourBit;
        }
    }

    if (has("COLORTERM")) {
        return AnsiModes.FourBit;
    }

    if (WINDOWS) {
        const conEmu = get("ConEmuANSI");
        if (conEmu && conEmu.length) {
            switch (conEmu) {
                case "ON":
                case "on":
                case "On":
                case "1":
                    return AnsiModes.TwentyFourBit;
            }
        }

        const v = RELEASE.split(".");
        if (Number(v[0]) > 9 && Number(v[2]) >= 18262) {
            return AnsiModes.TwentyFourBit;
        } else {
            return AnsiModes.FourBit;
        }
    }

    return AnsiModes.None;
}
