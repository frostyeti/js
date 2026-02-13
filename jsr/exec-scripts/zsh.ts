
import { cmd, pathFinder, 
    convertCommandArgs,
    type CommandArgs, type CommandOptions, type Command, type ShellCommandOptions
} from "./deps.ts";

pathFinder.set("sh", {
    name: "sh",
    windows: [
    ],
});

/**
 * Default file extension used to identify shell script files.
 */
export const SH_EXT = ".sh";

/**
 * Default `sh` arguments used for script execution.
 */
export const SH_SHELL_ARGS = ["-e"];

function getShellArgs(script: string, isFile: boolean, shellArgsOverride?: string[]) : string[]{
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
export function sh(args?: CommandArgs, options?: CommandOptions) : Command {
    return cmd(["sh", ...convertCommandArgs(args)], options);
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
        if (line.endsWith(SH_EXT) && !line.match(/\s/)) {
            isf = true;
        }
    }
    const params = getShellArgs(script, isf || false, options?.shellArgs);
    // Use the exported wrapper so the executable is always `sh`.
    const c = sh(params, options) as Command & { script: string };
    c.script = script;
    return c;
}

/**
 * Creates a {@link Command} that executes either a shell script file or an
 * inline command.
 */
sh.script = script;