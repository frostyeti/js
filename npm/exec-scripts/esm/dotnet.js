import {
  cmd,
  convertCommandArgs,
  pathFinder,
  ShellCommand,
} from "@frostyeti/exec";
import { isSpace } from "@frostyeti/strings/is-space";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "@frostyeti/path/join";
import { extname } from "@frostyeti/path/extname";
import { isfileSync } from "@frostyeti/fs/isfile";
import { writeTextFileSync } from "@frostyeti/fs/write-text-file";
import { mkdirSync } from "@frostyeti/fs/mkdir";
pathFinder.set("dotnet", {
  name: "dotnet",
  envVariable: "DOTNET_EXE",
  windows: [
    "${HOME}\\.dotnet\\dotnet.exe",
    "${LOCALAPPDATA}\\dotnet\\dotnet.exe",
    "${ProgramFiles}\\dotnet\\dotnet.exe",
    "%ProgramFiles(x86)%\\dotnet\\dotnet.exe",
  ],
  linux: [
    "$HOME/.dotnet/dotnet",
    "$HOME/.local/share/dotnet/dotnet",
    "/usr/local/bin/dotnet",
    "/usr/bin/dotnet",
    "/bin/dotnet",
  ],
});
/**
 * Default extension for generated C# script files.
 */
export const DOTNET_EXT = ".cs";
/**
 * File extensions that `DotnetScriptCommand` treats as "already a file".
 */
export const DOTNET_EXTS = [
  ".cs",
  ".csx",
  ".dll",
  ".exe",
  ".csproj",
  ".fsproj",
  ".vbproj",
];
/**
 * Default `dotnet` arguments used for script execution.
 */
export const DOTNET_SHELL_ARGS = ["run"];
/**
 * A {@link ShellCommand} specialized for executing C# / .NET scripts.
 *
 * If the provided `script` string looks like a file path with a recognized
 * extension, the command will use it directly; otherwise it will materialize
 * the script into a cached temp file.
 */
export class DotnetScriptCommand extends ShellCommand {
  /**
   * Creates a new instance of the `DotnetScriptCommand` class.
   * @param script The dotnet script to execute.
   * @param options The options for the dotnet command.
   */
  constructor(script, options) {
    super("dotnet", script.trimEnd(), options);
  }
  /**
   * Gets the file extension associated with cmd scripts.
   */
  get ext() {
    return DOTNET_EXT;
  }
  /**
   * Retrieves the script file and indicates whether it was generated or not.
   * @returns An object containing the file path and a flag
   * indicating if the file was generated.
   */
  getScriptFile() {
    const trimmed = this.script.trim();
    if (isSpace(trimmed) || !DOTNET_EXTS.some((ext) => trimmed.endsWith(ext))) {
      const hash = createHash("sha224").update(this.script).digest("hex");
      const tempDir = tmpdir();
      const file = join(tempDir, "script-dotnet", hash, "script" + DOTNET_EXT);
      if (isfileSync(file)) {
        return { file, generated: false };
      }
      const dir = join(tempDir, "script-dotnet", hash);
      mkdirSync(dir, { recursive: true });
      writeTextFileSync(file, this.script);
      // false because we need to cache the file for performance reasons, and we don't want to delete it after execution
      return { file, generated: false };
    }
    return { file: trimmed, generated: false };
  }
  /**
   * Gets the cmd arguments for executing the cmd script.
   * @param script The cmd script to execute.
   * @param isFile Specifies whether the script is a file or a command.
   * @returns The cmd arguments for executing the script.
   */
  getShellArgs(script, _isFile) {
    const filename = script;
    const ext = extname(filename);
    switch (ext) {
      case ".cs":
      case ".csx":
      case "":
        return ["run", "--file", filename];
      case ".dll":
      case ".exe":
        return [filename];
      default:
        return ["run", "--project", filename, "--"];
    }
  }
}
/**
 * Creates a {@link Command} that invokes the `dotnet` executable.
 *
 * @param args Arguments passed to `dotnet`.
 * @param options Command execution options.
 * @returns A command configured to run `dotnet`.
 */
export function dotnet(args, options) {
  return cmd(["dotnet", ...convertCommandArgs(args)], options);
}
function script(script, options) {
  return new DotnetScriptCommand(script, options);
}
/**
 * Creates a {@link DotnetScriptCommand} for executing a C#/.NET script.
 */
dotnet.script = script;
