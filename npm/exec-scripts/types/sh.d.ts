import {
  type Command,
  type CommandArgs,
  type CommandOptions,
  type ShellCommandOptions,
} from "@frostyeti/exec";
/**
 * Default file extension used to identify POSIX shell script files.
 */
export declare const SH_EXT = ".sh";
/**
 * Default `sh` arguments used for script execution.
 */
export declare const SH_SHELL_ARGS: string[];
/**
 * Creates a {@link Command} that invokes the `sh` executable.
 *
 * @param args Arguments passed to `sh`.
 * @param options Command execution options.
 * @returns A command configured to run `sh`.
 */
export declare function sh(
  args?: CommandArgs,
  options?: CommandOptions,
): Command;
export declare namespace sh {
  var script: (script: string, options?: ShellCommandOptions) => Command & {
    script: string;
  };
}
