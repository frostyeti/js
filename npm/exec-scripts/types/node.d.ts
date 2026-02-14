import {
  type Command,
  type CommandArgs,
  type CommandOptions,
  type ShellCommandOptions,
} from "@frostyeti/exec";
/**
 * Default file extension used to identify Node.js script files.
 */
export declare const NODE_EXT = ".ts";
/**
 * File extensions that `node.script()` will treat as script files (when the
 * input contains no whitespace).
 */
export declare const NODE_EXTS: string[];
/**
 * Default Node arguments used for script-file execution.
 */
export declare const NODE_SHELL_ARGS: never[];
/**
 * Default Node arguments used for inline/eval execution.
 */
export declare const NODE_EVAL_ARGS: string[];
/**
 * Creates a {@link Command} that invokes the `node` executable.
 *
 * @param args Arguments passed to `node`.
 * @param options Command execution options.
 * @returns A command configured to run `node`.
 */
export declare function node(
  args?: CommandArgs,
  options?: CommandOptions,
): Command;
export declare namespace node {
  var script: (script: string, options?: ShellCommandOptions) => Command & {
    script: string;
  };
}
