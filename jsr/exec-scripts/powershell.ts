import {
     cmd,
    type Command,
    type CommandArgs,
    type CommandOptions,
    convertCommandArgs,
    pathFinder,
    type ShellCommandOptions,
} from "@frostyeti/exec";

pathFinder.set("powershell", {
    name: "powershell",
    envVariable: "POWERSHELL_EXE",
    windows: [
        "${WinDir}\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
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
export const POWERSHELL_EXT = ".ps1";

/**
 * Default `powershell` arguments used for non-interactive execution.
 */
export const POWERSHELL_SHELL_ARGS = [
  "-NoLogo",
  "-NonInteractive",
  "-NoProfile",
  "-ExecutionPolicy",
  "Bypass",
];

function getShellArgs(
  script: string,
  isFile: boolean,
  shellArgsOverride?: string[],
): string[] {
  const params = [...(shellArgsOverride || POWERSHELL_SHELL_ARGS)];
  if (isFile) {
    params.push("-File", script);
  } else {
    params.push("-Command", script);
  }

  return params;
}

/**
 * Creates a {@link Command} that invokes Windows PowerShell (`powershell`).
 *
 * On non-Windows platforms, `pathFinder` may resolve this name to `pwsh`.
 *
 * @param args Arguments passed to `powershell`.
 * @param options Command execution options.
 * @returns A command configured to run `powershell`.
 */
export function powershell(args?: CommandArgs, options?: CommandOptions): Command {
  return cmd(["powershell", ...convertCommandArgs(args)], options);
}

function script(
  script: string,
  options?: ShellCommandOptions,
): Command & { script: string } {
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
    if (line.endsWith(POWERSHELL_EXT) && !line.match(/\s/)) {
      isf = true;
    }
  }
  const params = getShellArgs(script, isf || false, shellArgs);
  const c = powershell(params, options) as Command & { script: string };
  c.script = script;
  return c;
}

/**
 * Creates a {@link Command} that executes either a PowerShell script file or
 * inline PowerShell code.
 *
 * If `options.isFile` is not provided, the helper will treat the input as a
 * file when it ends with {@link POWERSHELL_EXT} and contains no whitespace;
 * otherwise it will run inline code via `powershell -Command`.
 */
powershell.script = script;