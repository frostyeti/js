import {
     cmd,
    type Command,
    type CommandArgs,
    type CommandOptions,
    convertCommandArgs,
    pathFinder,
    type ShellCommandOptions,
} from "@frostyeti/exec";

pathFinder.set("node", {
    name: "node",
    envVariable: "NODE_EXE",
    windows: [
        "#{LOCALAPPDATA}\\Programs\\nodejs\\node.exe",
        "#{LOCALAPPDATA}\\.nodejs\\node.exe",
        "${ProgramFiles}\\nodejs\\node.exe",
    ],
    linux: [
        "${HOME}/.local/bin/node",
        "/usr/local/bin/node",
        "/usr/bin/node",
    ],
});

/**
 * Default file extension used to identify Node.js script files.
 */
export const NODE_EXT = ".ts";

/**
 * File extensions that `node.script()` will treat as script files (when the
 * input contains no whitespace).
 */
export const NODE_EXTS = [".ts", ".js", ".mjs", ".cjs"];

/**
 * Default Node arguments used for script-file execution.
 */
export const NODE_SHELL_ARGS = [];

/**
 * Default Node arguments used for inline/eval execution.
 */
export const NODE_EVAL_ARGS = ["-e"];

function getShellArgs(script: string, isFile: boolean, shellArgsOverride?: string[]) : string[]{
    let params = [...(shellArgsOverride || NODE_SHELL_ARGS)];
    if (isFile) {
        params.push(script);
    } else {
        params = shellArgsOverride || NODE_EVAL_ARGS;
        params.push(script);
    }
    
    return params;
}

/**
 * Creates a {@link Command} that invokes the `node` executable.
 *
 * @param args Arguments passed to `node`.
 * @param options Command execution options.
 * @returns A command configured to run `node`.
 */
export function node(args?: CommandArgs, options?: CommandOptions) : Command {
    return cmd(["node", ...convertCommandArgs(args)], options);
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
        if (!line.match(/\s/) && NODE_EXTS.some(ext => line.endsWith(ext))) {
            isf = true;
        }
    }
    const params = getShellArgs(script, isf || false, options?.shellArgs);
    // Use the exported wrapper so the executable is always `node`.
    const c = node(params, options) as Command & { script: string };
    c.script = script;
    return c;
}

/**
 * Creates a {@link Command} that executes either a Node.js script file or
 * inline code.
 *
 * If `options.isFile` is not provided, the helper will treat the input as a
 * file when it ends with one of {@link NODE_EXTS} and contains no whitespace;
 * otherwise it will run inline code via `node -e`.
 */
node.script = script;