import {
  type Command,
  type CommandArgs,
  type CommandOptions,
  type ShellCommandOptions,
} from "@frostyeti/exec";
/**
 * Default file extension used to identify Bun script files.
 */
export declare const BUN_EXT = ".ts";
/**
 * File extensions that `bun.script()` will treat as script files (when the
 * input contains no whitespace).
 */
export declare const BUN_EXTS: string[];
/**
 * Default Bun arguments used for script-file execution.
 *
 * Bun can run files directly, so this is empty by default.
 */
export declare const BUN_SHELL_ARGS: never[];
/**
 * Default Bun arguments used for inline/eval execution.
 */
export declare const BUN_EVAL_ARGS: string[];
/**
 * Creates a {@link Command} that invokes the `bun` executable.
 *
 * @param args Arguments passed to `bun`.
 * @param options Command execution options.
 * @returns A command configured to run `bun`.
 */
export declare function bun(
  args?: CommandArgs,
  options?: CommandOptions,
): Command;
export declare namespace bun {
  var script: (script: string, options?: ShellCommandOptions) => Command & {
    script: string;
  };
}
