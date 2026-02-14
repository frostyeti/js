import {
     cmd,
    type Command,
    type CommandArgs,
    type CommandOptions,
    convertCommandArgs,
    pathFinder,
    ShellCommand,
    type ShellCommandOptions,
} from "@frostyeti/exec";
import {  isSpace } from "@frostyeti/strings/is-space";
import { createHash  } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "@frostyeti/path/join";
import { isfileSync } from "@frostyeti/fs/isfile";
import { writeTextFileSync } from "@frostyeti/fs/write-text-file";
import { mkdirSync } from "@frostyeti/fs/mkdir";
 

pathFinder.set("go", {
    name: "go",
    envVariable: "GO_EXE",
    windows: [
        "${ProgramFiles}\\Go\\bin\\go.exe",
        "${ChocolateyInstall:-C:\\ProgramData\\chocolatey}\\lib\\go\\tools\\go\\bin\\go.exe",
    ],
    linux: [
        "${HOME}/.local/shared/go/bin/go",
        "/usr/local/go/bin/go",
        "/usr/local/bin/go",
        "/usr/bin/go",
    ],
});

/**
 * Default extension for Go script files.
 */
export const GO_EXT = ".go";

/**
 * Default `go` arguments used for script execution.
 */
export const GO_SHELL_ARGS = ["run"];

/**
 * A {@link ShellCommand} specialized for executing Go scripts via `go run`.
 *
 * If the input is not a `.go` file path, the script will be written to a
 * deterministic file in the system temp directory.
 */
export class GoScriptCommand extends ShellCommand {
    /**
     * Creates a new instance of the `GoScriptCommand` class.
     * @param script The go script to execute.
     * @param options The options for the go command.
     */
    constructor(script: string, options?: ShellCommandOptions) {
        super("go", script.trimEnd(), options);
    }
   
    /**
     * Gets the file extension associated with cmd scripts.
     */
    override get ext(): string {
        return GO_EXT;
    }

    /**
     * Retrieves the script file and indicates whether it was generated or not.
     * @returns An object containing the file path and a flag
     * indicating if the file was generated.
     */
    override getScriptFile(): { file: string | undefined; generated: boolean } {
        const trimmed = this.script.trim();

        if (trimmed.endsWith(GO_EXT) && isSpace(trimmed)) {
            return { file: trimmed, generated: false };
        }

        const hash = createHash("sha256").update(this.script).digest("hex");
        const tempDir = tmpdir();
        const file = join(tempDir, "go-script", hash, "script" + GO_EXT);
        if (isfileSync(file)) {
            return { file, generated: false };
        }

        const dir = join(tempDir, "go-script", hash);
        mkdirSync(dir, { recursive: true });

        writeTextFileSync(file, this.script);
        return { file, generated: false };
    }

    /**
     * Gets the cmd arguments for executing the cmd script.
     * @param script The cmd script to execute.
     * @param isFile Specifies whether the script is a file or a command.
     * @returns The cmd arguments for executing the script.
     */
    override getShellArgs(script: string, _isFile: boolean): string[] {
        const params = this.shellArgs ?? [...GO_SHELL_ARGS];
        params.push(script);
        return params;
    }
}

/**
 * Creates a {@link Command} that invokes the `go` executable.
 *
 * @param args Arguments passed to `go`.
 * @param options Command execution options.
 * @returns A command configured to run `go`.
 */
export function go(args?: CommandArgs, options?: CommandOptions): Command {
    return cmd(["go", ...convertCommandArgs(args)], options);
}

function script(
    script: string,
    options?: ShellCommandOptions,
): GoScriptCommand {
    return new GoScriptCommand(script, options);
}

/**
 * Creates a {@link GoScriptCommand} for executing a Go script.
 */
go.script = script;
