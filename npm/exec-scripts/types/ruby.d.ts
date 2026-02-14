import {
  type Command,
  type CommandArgs,
  type CommandOptions,
  type ShellCommandOptions,
} from "@frostyeti/exec";
/**
 * Default file extension used to identify Ruby script files.
 */
export declare const RUBY_EXT = ".rb";
/**
 * Default Ruby arguments used for script-file execution.
 */
export declare const RUBY_SHELL_ARGS: never[];
/**
 * Default Ruby arguments used for inline/eval execution.
 */
export declare const RUBY_EVAL_ARGS: string[];
/**
 * Creates a {@link Command} that invokes the `ruby` executable.
 *
 * @param args Arguments passed to `ruby`.
 * @param options Command execution options.
 * @returns A command configured to run `ruby`.
 */
export declare function ruby(
  args?: CommandArgs,
  options?: CommandOptions,
): Command;
export declare namespace ruby {
  var script: (script: string, options?: ShellCommandOptions) => Command & {
    script: string;
  };
}
