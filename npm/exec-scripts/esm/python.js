import { cmd, convertCommandArgs, pathFinder } from "@frostyeti/exec";
pathFinder.set("python", {
  name: "python",
  envVariable: "PYTHON_EXE",
  windows: [
    "${ProgramFiles}\\Python\\Python.exe",
    "${ProgramFiles(x86)}\\Python\\Python.exe",
  ],
  linux: [
    "/usr/bin/python",
    "/usr/bin/python3",
    "/usr/local/bin/python",
    "/usr/local/bin/python3",
  ],
});
/**
 * Default file extension used to identify Python script files.
 */
export const PYTHON_EXT = ".py";
/**
 * Default Python arguments used for script-file execution.
 */
export const PYTHON_SHELL_ARGS = [];
/**
 * Default Python arguments used for inline/eval execution.
 */
export const PYTHON_EVAL_ARGS = ["-c"];
function getShellArgs(script, isFile, shellArgsOverride) {
  let params = [...(shellArgsOverride || PYTHON_SHELL_ARGS)];
  if (isFile) {
    params.push(script);
  } else {
    params = [...(shellArgsOverride || PYTHON_EVAL_ARGS)];
    params.push(script);
  }
  return params;
}
/**
 * Creates a {@link Command} that invokes the `python` executable.
 *
 * @param args Arguments passed to `python`.
 * @param options Command execution options.
 * @returns A command configured to run `python`.
 */
export function python(args, options) {
  return cmd(["python", ...convertCommandArgs(args)], options);
}
function script(script, options) {
  options = options || {};
  let isf = options?.isFile;
  const a = options?.args;
  if (a) {
    delete options["args"];
  }
  if (isf === undefined) {
    const line = script.trim();
    if (!line.match(/\s/) && line.endsWith(PYTHON_EXT)) {
      isf = true;
    }
  }
  const params = getShellArgs(script, isf || false, options?.shellArgs);
  // Use the exported wrapper so the executable is always `python`.
  const c = python(params, options);
  c.script = script;
  return c;
}
/**
 * Creates a {@link Command} that executes either a Python script file or
 * inline code.
 *
 * If `options.isFile` is not provided, the helper will treat the input as a
 * file when it ends with {@link PYTHON_EXT} and contains no whitespace;
 * otherwise it will run inline code via `python -c`.
 */
python.script = script;
