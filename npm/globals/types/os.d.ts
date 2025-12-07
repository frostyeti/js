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
export type OsPlatform =
  | "unix"
  | "linux"
  | "darwin"
  | "windows"
  | "sunos"
  | "freebsd"
  | "openbsd"
  | "netbsd"
  | "aix"
  | "solaris"
  | "illumos"
  | "android"
  | "ios"
  | "cygwin"
  | "haiku"
  | "unknown";
export type Architecture =
  | "arm"
  | "arm64"
  | "ia32"
  | "mips"
  | "mipsel"
  | "ppc"
  | "ppc64"
  | "s390"
  | "s390x"
  | "amd64"
  | "x86"
  | "sparc"
  | "unknown";
/**
 * The operating system platform such as 'linux', 'darwin', 'windows', etc.
 */
export declare const PLATFORM: OsPlatform;
/**
 * The operating system architecture such as 'amd64', 'x86', 'arm64', etc.
 */
export declare const ARCH: Architecture;
/**
 * True if the operating system is Windows, false otherwise.
 */
export declare const WINDOWS: boolean;
/**
 * True if the operating system is Linux, false otherwise.
 */
export declare const LINUX: boolean;
/**
 * True if the operating system is MacOS, false otherwise.
 */
export declare const DARWIN: boolean;
/**
 * The path separator for the current platform.
 */
export declare const PATH_SEP: string;
/**
 * The directory separator for the current platform.
 */
export declare const DIR_SEP: string;
/**
 * The regular expression for splitting a path into its components.
 */
export declare const DIR_SEP_RE: RegExp;
/**
 * The end-of-line marker for the current platform.
 */
export declare const EOL: string;
/**
 * True if the operating system is 64-bit, false otherwise.
 */
export declare const IS_64BIT: boolean;
/**
 * The path to the null device for the current platform.
 */
export declare const DEV_NULL: string;
/**
 * The PATH environment variable name for the current platform.
 */
export declare const ENV_PATH: string;
/**
 * The HOME environment variable name for the current platform.
 */
export declare const ENV_HOME: string;
/**
 * The TEMP environment variable name for the current platform.
 */
export declare const ENV_TMP: string;
/**
 * The USER environment variable name for the current platform.
 */
export declare const ENV_USER: string;
/**
 * The SHELL environment variable name for the current platform.
 */
export declare const ENV_SHELL: string;
/**
 * The LANG environment variable name for the current platform.
 */
export declare const ENV_LANG: string;
/**
 * The HOSTNAME environment variable name for the current platform.
 */
export declare const ENV_HOSTNAME: string;
