import {
     cmd,
    type Command,
    type CommandArgs,
    type CommandOptions,
    convertCommandArgs,
    pathFinder,
    type ShellCommandOptions,
} from "@frostyeti/exec";
import { isAbsolute } from "@frostyeti/path/is-absolute";
import { resolve } from "@frostyeti/path/resolve";
import { isfile as isFile } from "@frostyeti/fs/isfile";
import { WINDOWS } from "@frostyeti/globals/os";
import { endsWithFold } from "@frostyeti/slices/ends-with";
import { prependPath } from "@frostyeti/env";

pathFinder.set("bash", {
    name: "bash",
    envVariable: "BASH_EXE",
    windows: [
        "${ProgramFiles}\\Git\\bin\\bash.exe",
        "${ProgramFiles}\\Git\\usr\\bin\\bash.exe",
        "${ChocolateyInstall}\\msys2\\usr\\bin\\bash.exe",
        "${SystemDrive}\\msys64\\usr\\bin\\bash.exe",
        "${SystemDrive}\\msys\\usr\\bin\\bash.exe",
        "${SystemRoot}\\System32\\bash.exe",
    ],
});

let wslEnabled = false;

wslEnabled = WINDOWS && await isFile("C:\\Windows\\System32\\bash.exe");

if (wslEnabled) {
    if (await isFile("C:\\Program Files\\Git\\bin\\bash.exe")) {
        prependPath("C:\\Program Files\\Git\\bin");
    }
}


/**
 * Default file extension used to identify Bash script files.
 */
export const BASH_EXT = ".sh";

let wslCheck = true;

export const BASH_SHELL_ARGS = ["-noprofile", "-norc", "-e", "-o", "pipefail"];

/**
 * Enable or disable the Windows/WSL path conversion check for `bash.script()`.
 *
 * When enabled (Windows only), and when the resolved `bash` executable points
 * to `System32\\bash.exe`, script file paths will be converted to `/mnt/<drive>/...`
 * so they can be executed by WSL bash.
 */
export function setWslCheck(check = true) {
    wslCheck = check;
}

function getShellArgs(script: string, isFile: boolean, shellArgsOverride?: string[]) : string[]{
    const params = [...(shellArgsOverride || BASH_SHELL_ARGS)];
    if (isFile) {
        if (wslCheck && wslEnabled) {
            const exe = pathFinder.findExeSync("bash");
            if (exe && endsWithFold(exe, "System32\\bash.exe")) {
                if (!isAbsolute(script)) {
                    script = resolve(script);
                }

                script = "/mnt/" + script[0].toLowerCase() + 
                    script.slice(2).replace(/\\/g, "/");
            }
        }

        params.push(script);
    } else {
        params.push("-c", script);
    }
    
    return params;
}

/**
 * Creates a {@link Command} that invokes the `bash` executable.
 *
 * @param args Arguments passed to `bash`.
 * @param options Command execution options.
 * @returns A command configured to run `bash`.
 *
 * @example
 * ```ts
 * import { bash } from "@frostyeti/exec-scripts";
 *
 * const out = await bash(["-lc", "echo hello"]).output();
 * ```
 *
 * @example
 * ```ts
 * // Run inline code via bash -c
 * const cmd = bash.script("echo hello");
 * ```
 */
export function bash(args?: CommandArgs, options?: CommandOptions) : Command {
    return cmd(["bash", ...convertCommandArgs(args)], options);
}

function script(script: string, options?: ShellCommandOptions) : Command & { script: string } {
    options = options || {};
    let isf = options?.isFile;
    const a = options?.args;
    if (a) {
        delete options["args"];
    }
    if (isf === undefined) {
        const line = script.trim();
        if (line.endsWith(".sh") && !line.match(/\s/)) {
            isf = true;
        }
    }
    const params = getShellArgs(script, isf || false, options?.shellArgs);
    // Use the exported wrapper so the executable is always `bash`.
    const c = bash(params, options) as Command & { script: string };
    c.script = script;
    return c;
}

/**
 * Creates a {@link Command} that executes a Bash script.
 *
 * If `options.isFile` is not provided, the helper will treat the input as a
 * file when it ends with `.sh` and contains no whitespace; otherwise it will
 * run the script via `bash -c`.
 */
bash.script = script;