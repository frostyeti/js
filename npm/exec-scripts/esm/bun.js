import { cmd, convertCommandArgs, pathFinder } from "@frostyeti/exec";
pathFinder.set("bun", {
  name: "bun",
  envVariable: "BUN_EXE",
  windows: [
    "${USERPROFILE}\\.bun\\bin\\bun.exe",
    "${LOCALAPPDATA}\\Programs\\bin\\bun.exe",
    "${LOCALAPPDATA}\\Microsoft\\WinGet\\Links\\bun.exe",
    "${ProgramFiles}\\bun\\bin\\bun.exe",
    "${ProgramFiles(x86)}\\bun\\bin\\bun.exe",
  ],
  linux: [
    "${HOME}/.bun/bin/bun",
    "${HOME}/.local/bin/bun",
    "/usr/bin/bun",
    "/usr/local/bin/bun",
  ],
});
/**
 * Default file extension used to identify Bun script files.
 */
export const BUN_EXT = ".ts";
/**
 * File extensions that `bun.script()` will treat as script files (when the
 * input contains no whitespace).
 */
export const BUN_EXTS = [".ts", ".js", ".mjs", ".cjs"];
/**
 * Default Bun arguments used for script-file execution.
 *
 * Bun can run files directly, so this is empty by default.
 */
export const BUN_SHELL_ARGS = [];
/**
 * Default Bun arguments used for inline/eval execution.
 */
export const BUN_EVAL_ARGS = ["-e"];
function getShellArgs(script, isFile, shellArgsOverride) {
  let params = [...(shellArgsOverride || BUN_SHELL_ARGS)];
  if (isFile) {
    params.push(script);
  } else {
    params = [...(shellArgsOverride || BUN_EVAL_ARGS)];
    params.push(script);
  }
  return params;
}
/**
 * Creates a {@link Command} that invokes the `bun` executable.
 *
 * @param args Arguments passed to `bun`.
 * @param options Command execution options.
 * @returns A command configured to run `bun`.
 */
export function bun(args, options) {
  return cmd(["bun", ...convertCommandArgs(args)], options);
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
    if (!line.match(/\s/) && BUN_EXTS.some((ext) => line.endsWith(ext))) {
      isf = true;
    }
  }
  const params = getShellArgs(script, isf || false, options?.shellArgs);
  // Use the exported wrapper so the executable is always `bun`.
  const c = bun(params, options);
  c.script = script;
  return c;
}
/**
 * Creates a {@link Command} that executes either a Bun script file or inline
 * code.
 *
 * If `options.isFile` is not provided, the helper will treat the input as a
 * file when it ends with one of {@link BUN_EXTS} and contains no whitespace;
 * otherwise it will run inline code via `bun -e`.
 */
bun.script = script;
