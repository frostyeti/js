import {
  type Command,
  type CommandArgs,
  type CommandOptions,
  type ShellCommandOptions,
} from "@frostyeti/exec";
/**
 * Default file extension used to identify Python script files.
 */
export declare const PYTHON_EXT = ".py";
/**
 * Default Python arguments used for script-file execution.
 */
export declare const PYTHON_SHELL_ARGS: never[];
/**
 * Default Python arguments used for inline/eval execution.
 */
export declare const PYTHON_EVAL_ARGS: string[];
/**
 * Creates a {@link Command} that invokes the `python` executable.
 *
 * @param args Arguments passed to `python`.
 * @param options Command execution options.
 * @returns A command configured to run `python`.
 */
export declare function python(
  args?: CommandArgs,
  options?: CommandOptions,
): Command;
export declare namespace python {
  var script: (script: string, options?: ShellCommandOptions) => Command & {
    script: string;
  };
}
