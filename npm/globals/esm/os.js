/**
 * ## Overview
 *
 * @frostyeti/globals/os provides constant values for basic os information
 * such as `PLATFORM`, `ARCH`, `WINDOWS`, `DARWIN`, `PATH_SEP`, `DEV_NULL`.
 *
 * ## Basic Usage
 *
 * ```typescript
 * import * as os from "@frostyeti/globals/os";
 *
 * console.log(os.PLATFORM);
 * console.log(os.ARCH);
 * console.log("windows", os.WINDOWS);
 * console.log("darwin", os.DARWIN);
 * console.log("linux", os.LINUX);
 * console.log("eol", os.EOL);
 * console.log("path separator", os.PATH_SEP);
 * ```
 *
 * [MIT License](./LICENSE.md)
 */
import { RUNTIME } from "./runtime_info.js";
import { globals } from "./globals.js";
let osArch = "unknown";
let osPlatform = "unknown";
switch (RUNTIME) {
  case "bun":
  case "node":
    {
      const p = globals.process;
      const platform = p.platform;
      if (p.platform === "win32") {
        osPlatform = "windows";
      } else {
        osPlatform = platform;
      }
      if (p.arch === "x64") {
        osArch = "amd64";
      } else {
        osArch = p.arch;
      }
    }
    break;
  case "deno":
    {
      const deno = globals.Deno;
      const build = deno.build;
      const platform = build.os;
      osPlatform = platform;
      switch (build.arch) {
        case "x86_64":
          osArch = "amd64";
          break;
        case "aarch64":
          osArch = "arm64";
          break;
        default:
          osArch = "unknown";
          break;
      }
    }
    break;
  case "browser":
    {
      const navigator = globals.navigator;
      const userAgent = navigator?.userAgent;
      const ua = userAgent;
      if (ua.includes("Win")) {
        osPlatform = "windows";
      } else if (ua.includes("Linux") || ua.includes("X11")) {
        osPlatform = "linux";
      } else if (ua.includes("Mac")) {
        osPlatform = "darwin";
      } else if (/(iPhone|iPad|iPod)/.test(ua)) {
        osPlatform = "ios";
      } else if (ua.includes("Android")) {
        osPlatform = "android";
      } else if (ua.includes("OpenBSD")) {
        osPlatform = "openbsd";
      } else if (ua.includes("SunOS")) {
        osPlatform = "sunos";
      } else {
        osPlatform = "unknown";
      }
      if (/\b(?:(amd|x|x86[-_]?|wow|win)64)\b/i.test(ua)) {
        osArch = "amd64";
      } else if (/\b(ia32|x86)\b/i.test(ua)) {
        osArch = "x86";
      } else if (/\b(aarch64|arm(v?8e?l?|_?64))\b/i.test(ua)) {
        osArch = "arm64";
      } else if (/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i.test(ua)) {
        osArch = ua.includes("64") ? "ppc64" : "ppc";
      } else if (/(sun4\w)[;\)]/i.test(ua)) {
        osArch = "sparc";
      } else {
        const re =
          /((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i;
        if (re.test(ua)) {
          const m = re.exec(ua);
          osArch = !m ? "unknown" : m[1].toLowerCase();
        } else {
          osArch = "unknown";
        }
      }
    }
    break;
  case "cloudflare":
    {
      osPlatform = "linux";
      osArch = "amd64";
    }
    break;
  case "unknown":
    break;
}
/**
 * The operating system platform such as 'linux', 'darwin', 'windows', etc.
 */
export const PLATFORM = osPlatform;
/**
 * The operating system architecture such as 'amd64', 'x86', 'arm64', etc.
 */
export const ARCH = osArch;
/**
 * True if the operating system is Windows, false otherwise.
 */
export const WINDOWS = PLATFORM === "windows";
/**
 * True if the operating system is Linux, false otherwise.
 */
export const LINUX = PLATFORM === "linux";
/**
 * True if the operating system is MacOS, false otherwise.
 */
export const DARWIN = PLATFORM === "darwin";
/**
 * The path separator for the current platform.
 */
export const PATH_SEP = WINDOWS ? ";" : ":";
/**
 * The directory separator for the current platform.
 */
export const DIR_SEP = WINDOWS ? "\\" : "/";
/**
 * The regular expression for splitting a path into its components.
 */
export const DIR_SEP_RE = WINDOWS ? /[\\/]+/ : /\/+/;
/**
 * The end-of-line marker for the current platform.
 */
export const EOL = WINDOWS ? "\r\n" : "\n";
/**
 * True if the operating system is 64-bit, false otherwise.
 */
export const IS_64BIT = ["amd64", "arm64", "ppc64", "s390x"].includes(ARCH);
/**
 * The path to the null device for the current platform.
 */
export const DEV_NULL = WINDOWS ? "NUL" : "/dev/null";
/**
 * The PATH environment variable name for the current platform.
 */
export const ENV_PATH = WINDOWS ? "Path" : "PATH";
/**
 * The HOME environment variable name for the current platform.
 */
export const ENV_HOME = WINDOWS ? "USERPROFILE" : "HOME";
/**
 * The TEMP environment variable name for the current platform.
 */
export const ENV_TMP = WINDOWS ? "TEMP" : "TMPDIR";
/**
 * The USER environment variable name for the current platform.
 */
export const ENV_USER = WINDOWS ? "USERNAME" : "USER";
/**
 * The SHELL environment variable name for the current platform.
 */
export const ENV_SHELL = WINDOWS ? "ComSpec" : "SHELL";
/**
 * The LANG environment variable name for the current platform.
 */
export const ENV_LANG = WINDOWS ? "LANG" : "LANGUAGE";
/**
 * The HOSTNAME environment variable name for the current platform.
 */
export const ENV_HOSTNAME = WINDOWS ? "COMPUTERNAME" : "HOSTNAME";
