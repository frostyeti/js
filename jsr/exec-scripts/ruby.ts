import {
     cmd,
    type Command,
    type CommandArgs,
    type CommandOptions,
    convertCommandArgs,
    pathFinder,
    type ShellCommandOptions,
} from "@frostyeti/exec";

pathFinder.set("ruby", {
  name: "ruby",
  envVariable: "RUBY_EXE",
  windows: [
		"${ProgramFiles}\\Ruby\\bin\\ruby.exe",
			"${ProgramFiles(x86)}\\Ruby\\bin\\ruby.exe",
  ],
  linux: [
			"/usr/bin/ruby",
			"/usr/local/bin/ruby",
  ],
});

/**
 * Default file extension used to identify Ruby script files.
 */
export const RUBY_EXT = ".rb";

/**
 * Default Ruby arguments used for script-file execution.
 */
export const RUBY_SHELL_ARGS = [];  

/**
 * Default Ruby arguments used for inline/eval execution.
 */
export const RUBY_EVAL_ARGS = ["-e"];

function getShellArgs(
  script: string,
  isFile: boolean,
  shellArgsOverride?: string[],
): string[] {
  let params = [...(shellArgsOverride || RUBY_SHELL_ARGS)];
  if (isFile) {
    params.push(script);
  } else {
    params = shellArgsOverride || RUBY_EVAL_ARGS;
    params.push(script);
  }

  return params;
}

/**
 * Creates a {@link Command} that invokes the `ruby` executable.
 *
 * @param args Arguments passed to `ruby`.
 * @param options Command execution options.
 * @returns A command configured to run `ruby`.
 */
export function ruby(args?: CommandArgs, options?: CommandOptions): Command {
  return cmd(["ruby", ...convertCommandArgs(args)], options);
}

function script(
  script: string,
  options?: ShellCommandOptions,
): Command & { script: string } {
  options = options || {};
  let isf = options?.isFile;
  const a = options?.args;
  if (a) {
    delete options["args"];
  }
  if (isf === undefined) {
    const line = script.trim();
    if (!line.match(/\s/) && line.endsWith(RUBY_EXT)) {
      isf = true;
    }
  }
  const params = getShellArgs(script, isf || false, options?.shellArgs);
  // Use the exported wrapper so the executable is always `ruby`.
  const c = ruby(params, options) as Command & { script: string };
  c.script = script;
  return c;
}

/**
 * Creates a {@link Command} that executes either a Ruby script file or inline
 * code.
 *
 * If `options.isFile` is not provided, the helper will treat the input as a
 * file when it ends with {@link RUBY_EXT} and contains no whitespace;
 * otherwise it will run inline code via `ruby -e`.
 */
ruby.script = script;