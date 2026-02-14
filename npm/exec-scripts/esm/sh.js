import { cmd, convertCommandArgs, pathFinder } from "@frostyeti/exec";
pathFinder.set("sh", {
  name: "sh",
  windows: [
    "${ProgramFiles}\\Git\\usr\\bin\\sh.exe",
    "${ChocolateyInstall}\\msys2\\usr\\bin\\sh.exe",
    "${SystemDrive}\\msys64\\usr\\bin\\sh.exe",
    "${SystemDrive}\\msys\\usr\\bin\\sh.exe",
  ],
});
/**
 * Default file extension used to identify POSIX shell script files.
 */
export const SH_EXT = ".sh";
/**
 * Default `sh` arguments used for script execution.
 */
export const SH_SHELL_ARGS = ["-e"];
function getShellArgs(script, isFile, shellArgsOverride) {
  const params = [...(shellArgsOverride || SH_SHELL_ARGS)];
  if (isFile) {
    params.push(script);
  } else {
    params.push("-c", script);
  }
  return params;
}
/**
 * Creates a {@link Command} that invokes the `sh` executable.
 *
 * @param args Arguments passed to `sh`.
 * @param options Command execution options.
 * @returns A command configured to run `sh`.
 */
export function sh(args, options) {
  return cmd(["sh", ...convertCommandArgs(args)], options);
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
    if (line.endsWith(SH_EXT) && !line.match(/\s/)) {
      isf = true;
    }
  }
  const params = getShellArgs(script, isf || false, options?.shellArgs);
  // Use the exported wrapper so the executable is always `sh`.
  const c = sh(params, options);
  c.script = script;
  return c;
}
/**
 * Creates a {@link Command} that executes either a shell script file or an
 * inline command.
 *
 * If `options.isFile` is not provided, the helper will treat the input as a
 * file when it ends with {@link SH_EXT} and contains no whitespace; otherwise
 * it will run the script via `sh -c`.
 */
sh.script = script;
