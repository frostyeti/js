import {
     cmd,
    type Command,
    type CommandArgs,
    type CommandOptions,
    convertCommandArgs,
    pathFinder,
    type ShellCommandOptions,
} from "@frostyeti/exec";

pathFinder.set("deno", {
    name: "deno",
    windows: [
        "${UserProfile}\\.deno\\bin\\deno.exe",
        "${ALLUSERSPROFILE}\\chocolatey\\lib\\deno\\deno.exe",
        "${ChocolateyInstall}\\lib\\deno\\deno.exe",
    ],
    linux: [
        "${HOME}/.deno/bin/deno",
        "/usr/local/bin/deno",
        "/usr/bin/deno",
    ],
});

/**
 * Default file extension used to identify Deno script files.
 */
export const DENO_EXT = ".ts";

/**
 * File extensions that `deno.script()` will treat as script files (when the
 * input contains no whitespace).
 */
export const DENO_EXTS = [".ts", ".js", ".mjs", ".cjs"];

/**
 * Default `deno` arguments used for script-file execution.
 */
export const DENO_SHELL_ARGS = ["run", "-A"];

/**
 * Default `deno` arguments used for inline/eval execution.
 */
export const DENO_EVAL_ARGS = ["eval"];

function getShellArgs(script: string, isFile: boolean, shellArgsOverride?: string[]) : string[]{
    let params = [...(shellArgsOverride || DENO_SHELL_ARGS)];
    if (isFile) {
        params.push(script);
    } else {
        params = shellArgsOverride || DENO_EVAL_ARGS;
        params.push(script);
    }
    
    return params;
}

/**
 * Creates a {@link Command} that invokes the `deno` executable.
 *
 * @param args Arguments passed to `deno`.
 * @param options Command execution options.
 * @returns A command configured to run `deno`.
 */
export function deno(args?: CommandArgs, options?: CommandOptions) : Command {
    return cmd(["deno", ...convertCommandArgs(args)], options);
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
        if (!line.match(/\s/) && DENO_EXTS.some(ext => line.endsWith(ext))) {
            isf = true;
        }
    }
    const params = getShellArgs(script, isf || false, options?.shellArgs);
    // Use the exported wrapper so the executable is always `deno`.
    const c = deno(params, options) as Command & { script: string };
    c.script = script;
    return c;
}

/**
 * Creates a {@link Command} that executes either a Deno script file (via
 * `deno run -A`) or inline code (via `deno eval`).
 */
deno.script = script;