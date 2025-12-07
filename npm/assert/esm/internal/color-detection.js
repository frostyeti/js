import { globals } from "./globals.js";
let RELEASE = "";
if (typeof globals.process !== "undefined") {
  const { release } = await import("node:os");
  RELEASE = release();
}
const WINDOWS = typeof globals.process !== "undefined" &&
  globals.process.platform === "win32";
const DARWIN = typeof globals.process !== "undefined" &&
  globals.process.platform === "darwin";
function get(value) {
  if (typeof globals.process !== "undefined" && globals.process.env) {
    return globals.process.env[value];
  }
  return undefined;
}
function has(value) {
  return get(value) !== undefined;
}
/**
 * The ANSI mode of the terminal.
 */
export var AnsiMode;
(function (AnsiMode) {
  /**
   * Automatically detect the ANSI mode.
   */
  AnsiMode[AnsiMode["Auto"] = -1] = "Auto";
  /**
   * No ANSI support.
   */
  AnsiMode[AnsiMode["None"] = 0] = "None";
  /**
   * 3-bit ANSI support.
   */
  AnsiMode[AnsiMode["ThreeBit"] = 1] = "ThreeBit";
  /**
   * 4-bit ANSI support.
   */
  AnsiMode[AnsiMode["FourBit"] = 2] = "FourBit";
  /**
   * 8-bit ANSI support.
   */
  AnsiMode[AnsiMode["EightBit"] = 4] = "EightBit";
  /**
   * 24-bit ANSI support.
   */
  AnsiMode[AnsiMode["TwentyFourBit"] = 8] = "TwentyFourBit";
})(AnsiMode || (AnsiMode = {}));
/**
 * Determines if the terminal is ANSI compatible by checking the `TERM` environment variable.
 * @returns `true` if the terminal is ANSI compatible, `false` otherwise.
 */
function isTermVariableAnsiCompatible() {
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
  for (const s of set) {
    if (s[0] === "^") {
      if (term.toLowerCase().startsWith(s.substring(1).toLowerCase())) {
        return true;
      }
      continue;
    }
    if (term?.toLowerCase() === s.toLowerCase()) {
      return true;
    }
  }
  return false;
}
/**
 * Gets the CI environment variable and determines if the terminal is ANSI compatible.
 * @returns The ANSI mode if the terminal is ANSI compatible, `null` otherwise.
 */
function detectCi() {
  if (has("CI")) {
    if (has("GITHUB_ACTIONS") || has("GITEA_ACTIONS")) {
      return AnsiMode.FourBit;
    }
    if (
      ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "BUILDKITE", "DRONE"]
        .some((sign) => has(sign)) ||
      get("CI_NAME") === "codeship"
    ) {
      return AnsiMode.FourBit;
    }
    return AnsiMode.FourBit;
  }
  const teamCityVersion = get("TEAMCITY_VERSION");
  if (teamCityVersion) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(teamCityVersion)
      ? AnsiMode.FourBit
      : AnsiMode.None;
  }
  return null;
}
/**
 * Detects the ANSI mode of the terminal.
 * @returns The ANSI mode of the terminal.
 */
export function detectMode() {
  const noColor = get("NO_COLOR");
  if (
    noColor && noColor.length &&
    (noColor === "1" || noColor.trim().toLowerCase() === "true")
  ) {
    return AnsiMode.None;
  }
  // override TERM variable
  const gsterm = get("frostyeti_TERM");
  if (gsterm && gsterm.length) {
    switch (gsterm) {
      case "none":
      case "no-color":
      case "nocolor":
      case "0":
        return AnsiMode.None;
      case "3":
      case "3bit":
        return AnsiMode.ThreeBit;
      case "4":
      case "4bit":
        return AnsiMode.FourBit;
      case "8":
      case "8bit":
        return AnsiMode.EightBit;
      case "24":
      case "24bit":
      case "truecolor":
      case "color":
        return AnsiMode.TwentyFourBit;
    }
  }
  const term = get("TERM");
  if (has("TF_BUILD") && has("AGENT_NAME")) {
    return AnsiMode.FourBit;
  }
  const ci = detectCi();
  if (ci !== null) {
    return ci;
  }
  if (get("COLORTERM") === "truecolor") {
    return AnsiMode.TwentyFourBit;
  }
  if (term === "xterm-kitty") {
    return AnsiMode.TwentyFourBit;
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
          return version >= 3 ? AnsiMode.TwentyFourBit : AnsiMode.EightBit;
        }
        case "Apple_Terminal": {
          return AnsiMode.EightBit;
        }
      }
    }
  }
  if (term) {
    if (/-256(color)?$/i.test(term)) {
      return AnsiMode.EightBit;
    }
    if (isTermVariableAnsiCompatible()) {
      return AnsiMode.FourBit;
    }
  }
  if (has("COLORTERM")) {
    return AnsiMode.FourBit;
  }
  if (WINDOWS) {
    const conEmu = get("ConEmuANSI");
    if (conEmu && conEmu.length) {
      switch (conEmu) {
        case "ON":
        case "on":
        case "On":
        case "1":
          return AnsiMode.TwentyFourBit;
      }
    }
    const v = RELEASE.split(".");
    if (Number(v[0]) > 9 && Number(v[2]) >= 18262) {
      return AnsiMode.TwentyFourBit;
    } else {
      return AnsiMode.FourBit;
    }
  }
  return AnsiMode.None;
}
const e = detectMode() !== AnsiMode.None;
export const enabled = e;
