import {
  type Command,
  type CommandArgs,
  type CommandOptions,
  type ShellCommandOptions,
} from "@frostyeti/exec";
/**
 * Default file extension used to identify Deno script files.
 */
export declare const DENO_EXT = ".ts";
/**
 * File extensions that `deno.script()` will treat as script files (when the
 * input contains no whitespace).
 */
export declare const DENO_EXTS: string[];
/**
 * Default `deno` arguments used for script-file execution.
 */
export declare const DENO_SHELL_ARGS: string[];
/**
 * Default `deno` arguments used for inline/eval execution.
 */
export declare const DENO_EVAL_ARGS: string[];
/**
 * Creates a {@link Command} that invokes the `deno` executable.
 *
 * @param args Arguments passed to `deno`.
 * @param options Command execution options.
 * @returns A command configured to run `deno`.
 */
export declare function deno(
  args?: CommandArgs,
  options?: CommandOptions,
): Command;
export declare namespace deno {
  var script: (script: string, options?: ShellCommandOptions) => Command & {
    script: string;
  };
}
