import {
  type Command,
  type CommandArgs,
  type CommandOptions,
  ShellCommand,
  type ShellCommandOptions,
} from "@frostyeti/exec";
/**
 * Default extension for Windows Command Prompt script files.
 */
export declare const WINCMD_EXT = ".cmd";
/**
 * File extensions treated as Windows cmd/bat script files.
 */
export declare const WINCMD_EXTS: string[];
/**
 * Default `cmd.exe` arguments used for non-interactive execution.
 */
export declare const WINCMD_SHELL_ARGS: string[];
/**
 * A {@link ShellCommand} specialized for executing Windows cmd/bat scripts.
 *
 * If the provided script contains newlines or is not a `.cmd`/`.bat` path, it
 * is written to a temporary `.cmd` file before execution.
 */
export declare class CmdScriptCommand extends ShellCommand {
  /**
   * Creates a new instance of the `CmdScriptCommand` class.
   * @param script The cmd script to execute.
   * @param options The options for the cmdell command.
   */
  constructor(script: string, options?: ShellCommandOptions);
  static wslCheck: boolean;
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
  getShellArgs(script: string, isFile: boolean): string[];
}
/**
 * Creates a {@link Command} that invokes `cmd.exe`.
 *
 * @param args Arguments passed to `cmd.exe`.
 * @param options Command execution options.
 * @returns A command configured to run `cmd.exe`.
 */
export declare function wincmd(
  args?: CommandArgs,
  options?: CommandOptions,
): Command;
export declare namespace wincmd {
  var script: (script: string, options?: ShellCommandOptions) => ShellCommand;
}
