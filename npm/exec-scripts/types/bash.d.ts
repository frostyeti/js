import {
  type Command,
  type CommandArgs,
  type CommandOptions,
  type ShellCommandOptions,
} from "@frostyeti/exec";
/**
 * Default file extension used to identify Bash script files.
 */
export declare const BASH_EXT = ".sh";
export declare const BASH_SHELL_ARGS: string[];
/**
 * Enable or disable the Windows/WSL path conversion check for `bash.script()`.
 *
 * When enabled (Windows only), and when the resolved `bash` executable points
 * to `System32\\bash.exe`, script file paths will be converted to `/mnt/<drive>/...`
 * so they can be executed by WSL bash.
 */
export declare function setWslCheck(check?: boolean): void;
/**
 * Creates a {@link Command} that invokes the `bash` executable.
 *
 * @param args Arguments passed to `bash`.
 * @param options Command execution options.
 * @returns A command configured to run `bash`.
 *
 * @example
 * ```ts
 * import { bash } from "@frostyeti/exec-scripts";
 *
 * const out = await bash(["-lc", "echo hello"]).output();
 * ```
 *
 * @example
 * ```ts
 * // Run inline code via bash -c
 * const cmd = bash.script("echo hello");
 * ```
 */
export declare function bash(
  args?: CommandArgs,
  options?: CommandOptions,
): Command;
export declare namespace bash {
  var script: (script: string, options?: ShellCommandOptions) => Command & {
    script: string;
  };
}
