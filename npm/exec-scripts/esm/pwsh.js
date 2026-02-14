import { cmd, convertCommandArgs, pathFinder } from "@frostyeti/exec";
pathFinder.set("pwsh", {
  name: "pwsh",
  windows: [
    "${ProgramFiles}\\PowerShell\\7\\pwsh.exe",
    "${ProgramFiles}\\PowerShell\\6\\pwsh.exe",
  ],
  linux: [
    "/usr/bin/pwsh",
    "/opt/microsoft/powershell/7/pwsh",
    "/opt/microsoft/powershell/6/pwsh",
  ],
});
/**
 * Default file extension used to identify PowerShell script files.
 */
export const PWSH_EXT = ".ps1";
/**
 * Default `pwsh` arguments used for non-interactive execution.
 */
export const PWSH_SHELL_ARGS = [
  "-NoLogo",
  "-NonInteractive",
  "-NoProfile",
  "-ExecutionPolicy",
  "Bypass",
];
function getShellArgs(script, isFile, shellArgsOverride) {
  const params = [...(shellArgsOverride || PWSH_SHELL_ARGS)];
  if (isFile) {
    params.push("-File", script);
  } else {
    params.push("-Command", script);
  }
  return params;
}
/**
 * Creates a {@link Command} that invokes the PowerShell 7+ executable (`pwsh`).
 *
 * @param args Arguments passed to `pwsh`.
 * @param options Command execution options.
 * @returns A command configured to run `pwsh`.
 */
export function pwsh(args, options) {
  return cmd(["pwsh", ...convertCommandArgs(args)], options);
}
function script(script, options) {
  options = options || {};
  let isf = options?.isFile;
  const a = options?.args;
  const shellArgs = options?.shellArgs;
  if (a) {
    delete options["args"];
  }
  if (shellArgs) {
    delete options["shellArgs"];
  }
  if (isf === undefined) {
    const line = script.trim();
    if (line.endsWith(".ps1") && !line.match(/\s/)) {
      isf = true;
    }
  }
  const params = getShellArgs(script, isf || false, shellArgs);
  // Use the exported wrapper so the executable is always `pwsh`.
  const c = pwsh(params, options);
  c.script = script;
  return c;
}
/**
 * Creates a {@link Command} that executes either a PowerShell script file or
 * inline PowerShell code.
 *
 * If `options.isFile` is not provided, the helper will treat the input as a
 * file when it ends with {@link PWSH_EXT} and contains no whitespace; otherwise
 * it will run inline code via `pwsh -Command`.
 */
pwsh.script = script;
