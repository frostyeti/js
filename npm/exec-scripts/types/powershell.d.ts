import {
  type Command,
  type CommandArgs,
  type CommandOptions,
  type ShellCommandOptions,
} from "@frostyeti/exec";
/**
 * Default file extension used to identify PowerShell script files.
 */
export declare const POWERSHELL_EXT = ".ps1";
/**
 * Default `powershell` arguments used for non-interactive execution.
 */
export declare const POWERSHELL_SHELL_ARGS: string[];
/**
 * Creates a {@link Command} that invokes Windows PowerShell (`powershell`).
 *
 * On non-Windows platforms, `pathFinder` may resolve this name to `pwsh`.
 *
 * @param args Arguments passed to `powershell`.
 * @param options Command execution options.
 * @returns A command configured to run `powershell`.
 */
export declare function powershell(
  args?: CommandArgs,
  options?: CommandOptions,
): Command;
export declare namespace powershell {
  var script: (script: string, options?: ShellCommandOptions) => Command & {
    script: string;
  };
}
