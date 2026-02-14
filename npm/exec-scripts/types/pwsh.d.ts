import {
  type Command,
  type CommandArgs,
  type CommandOptions,
  type ShellCommandOptions,
} from "@frostyeti/exec";
/**
 * Default file extension used to identify PowerShell script files.
 */
export declare const PWSH_EXT = ".ps1";
/**
 * Default `pwsh` arguments used for non-interactive execution.
 */
export declare const PWSH_SHELL_ARGS: string[];
/**
 * Creates a {@link Command} that invokes the PowerShell 7+ executable (`pwsh`).
 *
 * @param args Arguments passed to `pwsh`.
 * @param options Command execution options.
 * @returns A command configured to run `pwsh`.
 */
export declare function pwsh(
  args?: CommandArgs,
  options?: CommandOptions,
): Command;
export declare namespace pwsh {
  var script: (script: string, options?: ShellCommandOptions) => Command & {
    script: string;
  };
}
