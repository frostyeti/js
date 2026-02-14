import {
  type Command,
  type CommandArgs,
  type CommandOptions,
  ShellCommand,
  type ShellCommandOptions,
} from "@frostyeti/exec";
/**
 * Default extension for Go script files.
 */
export declare const GO_EXT = ".go";
/**
 * Default `go` arguments used for script execution.
 */
export declare const GO_SHELL_ARGS: string[];
/**
 * A {@link ShellCommand} specialized for executing Go scripts via `go run`.
 *
 * If the input is not a `.go` file path, the script will be written to a
 * deterministic file in the system temp directory.
 */
export declare class GoScriptCommand extends ShellCommand {
  /**
   * Creates a new instance of the `GoScriptCommand` class.
   * @param script The go script to execute.
   * @param options The options for the go command.
   */
  constructor(script: string, options?: ShellCommandOptions);
  /**
   * Gets the file extension associated with cmd scripts.
   */
  get ext(): string;
  /**
   * Retrieves the script file and indicates whether it was generated or not.
   * @returns An object containing the file path and a flag
   * indicating if the file was generated.
   */
  getScriptFile(): {
    file: string | undefined;
    generated: boolean;
  };
  /**
   * Gets the cmd arguments for executing the cmd script.
   * @param script The cmd script to execute.
   * @param isFile Specifies whether the script is a file or a command.
   * @returns The cmd arguments for executing the script.
   */
  getShellArgs(script: string, _isFile: boolean): string[];
}
/**
 * Creates a {@link Command} that invokes the `go` executable.
 *
 * @param args Arguments passed to `go`.
 * @param options Command execution options.
 * @returns A command configured to run `go`.
 */
export declare function go(
  args?: CommandArgs,
  options?: CommandOptions,
): Command;
export declare namespace go {
  var script: (
    script: string,
    options?: ShellCommandOptions,
  ) => GoScriptCommand;
}
