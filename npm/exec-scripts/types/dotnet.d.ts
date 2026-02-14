import {
  type Command,
  type CommandArgs,
  type CommandOptions,
  ShellCommand,
  type ShellCommandOptions,
} from "@frostyeti/exec";
/**
 * Default extension for generated C# script files.
 */
export declare const DOTNET_EXT = ".cs";
/**
 * File extensions that `DotnetScriptCommand` treats as "already a file".
 */
export declare const DOTNET_EXTS: string[];
/**
 * Default `dotnet` arguments used for script execution.
 */
export declare const DOTNET_SHELL_ARGS: string[];
/**
 * A {@link ShellCommand} specialized for executing C# / .NET scripts.
 *
 * If the provided `script` string looks like a file path with a recognized
 * extension, the command will use it directly; otherwise it will materialize
 * the script into a cached temp file.
 */
export declare class DotnetScriptCommand extends ShellCommand {
  /**
   * Creates a new instance of the `DotnetScriptCommand` class.
   * @param script The dotnet script to execute.
   * @param options The options for the dotnet command.
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
 * Creates a {@link Command} that invokes the `dotnet` executable.
 *
 * @param args Arguments passed to `dotnet`.
 * @param options Command execution options.
 * @returns A command configured to run `dotnet`.
 */
export declare function dotnet(
  args?: CommandArgs,
  options?: CommandOptions,
): Command;
export declare namespace dotnet {
  var script: (
    script: string,
    options?: ShellCommandOptions,
  ) => DotnetScriptCommand;
}
