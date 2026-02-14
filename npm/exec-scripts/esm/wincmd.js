import {
  cmd,
  convertCommandArgs,
  pathFinder,
  ShellCommand,
} from "@frostyeti/exec";
import { isAbsolute } from "@frostyeti/path/is-absolute";
import { resolve } from "@frostyeti/path/resolve";
import { WINDOWS } from "@frostyeti/globals/os";
import { mktempSync } from "@frostyeti/fs/mktemp";
import { writeTextFileSync } from "@frostyeti/fs/write-text-file";
pathFinder.set("cmd", {
  name: "cmd",
  windows: [
    "${SystemRoot}\\System32\\cmd.exe",
  ],
});
/**
 * Default extension for Windows Command Prompt script files.
 */
export const WINCMD_EXT = ".cmd";
/**
 * File extensions treated as Windows cmd/bat script files.
 */
export const WINCMD_EXTS = [".cmd", ".bat"];
/**
 * Default `cmd.exe` arguments used for non-interactive execution.
 */
export const WINCMD_SHELL_ARGS = ["/D", "/E:ON", "/V:OFF", "/S", "/C"];
/**
 * A {@link ShellCommand} specialized for executing Windows cmd/bat scripts.
 *
 * If the provided script contains newlines or is not a `.cmd`/`.bat` path, it
 * is written to a temporary `.cmd` file before execution.
 */
export class CmdScriptCommand extends ShellCommand {
  /**
   * Creates a new instance of the `CmdScriptCommand` class.
   * @param script The cmd script to execute.
   * @param options The options for the cmdell command.
   */
  constructor(script, options) {
    super("cmd", script.trimEnd(), options);
  }
  static wslCheck = WINDOWS;
  /**
   * Gets the file extension associated with cmd scripts.
   */
  get ext() {
    return WINCMD_EXT;
  }
  /**
   * Retrieves the script file and indicates whether it was generated or not.
   * @returns An object containing the file path and a flag
   * indicating if the file was generated.
   */
  getScriptFile() {
    let script = this.script.trimEnd();
    if (
      script.match(/\n/) ||
      !["cmd", "bat"].some((ext) => script.endsWith(`.${ext}`))
    ) {
      script = `
@echo off
${script}
            `;
      const file = mktempSync({
        prefix: "cmd",
        suffix: this.ext,
      });
      writeTextFileSync(file, script);
      return { file, generated: true };
    }
    script = script.trimStart();
    if (!isAbsolute(script)) {
      script = resolve(script);
    }
    return { file: script, generated: false };
  }
  /**
   * Gets the cmd arguments for executing the cmd script.
   * @param script The cmd script to execute.
   * @param isFile Specifies whether the script is a file or a command.
   * @returns The cmd arguments for executing the script.
   */
  getShellArgs(script, isFile) {
    const params = [...(this.shellArgs ?? WINCMD_SHELL_ARGS)];
    if (isFile) {
      params.push("/C", `CALL`, script);
    } else {
      params.push("/C", script);
    }
    return params;
  }
}
/**
 * Creates a {@link Command} that invokes `cmd.exe`.
 *
 * @param args Arguments passed to `cmd.exe`.
 * @param options Command execution options.
 * @returns A command configured to run `cmd.exe`.
 */
export function wincmd(args, options) {
  return cmd(["cmd", ...convertCommandArgs(args)], options);
}
function script(script, options) {
  return new CmdScriptCommand(script, options);
}
/**
 * Creates a {@link CmdScriptCommand} for executing a Windows cmd/bat script.
 */
wincmd.script = script;
