/**
 * The `errors` module provides error classes for handling command execution errors.
 *
 * @module
 */
/**
 * Represents an error that occurs when executing a command.
 *
 * @example
 * ```ts
 * import { CommandError, exec } from "@frostyeti/exec";
 *
 * try {
 *   const output = await exec(["git", "clone"]);
 *   output.validate(); // Throws if exit code is non-zero
 * } catch (e) {
 *   if (e instanceof CommandError) {
 *     console.log("Command failed:", e.fileName);
 *     console.log("Exit code:", e.exitCode);
 *   }
 * }
 *
 * // Create a CommandError manually
 * throw new CommandError({
 *   fileName: "my-command",
 *   code: 1,
 *   message: "Command failed with error",
 * });
 * ```
 */
export class CommandError extends Error {
  /**
   * The exit code of the command.
   */
  exitCode;
  /**
   * The name of the command.
   */
  fileName;
  /**
   * The arguments passed to the command.
   */
  args;
  /**
   * The descriptor of the target when the error occurred.
   */
  target;
  /**
   * A link to more information about the error.
   */
  link;
  /**
   * Creates a new instance of the CommandError class.
   */
  constructor() {
    const arg = arguments.length === 1 ? arguments[0] : undefined;
    const options = typeof arg === "object" ? arguments[0] : {};
    const message = typeof arg === "string" ? arguments[0] : options.message;
    super(
      message ??
        `Command ${options?.fileName} failed with exit code ${options?.code}`,
      options,
    );
    this.name = "CommandError";
    this.exitCode = options.code;
    this.fileName = options.fileName;
    this.args = options.args;
    this.target = options.target;
    this.link = options.link ??
      "https://jsr.io/@frostyeti/exec/doc/errors/~/CommandError";
  }
}
/** *
 * Represents an error that occurs when a command is not found on the PATH.
 *
 * @example
 * ```ts
 * import { NotFoundOnPathError, exec } from "@frostyeti/exec";
 *
 * try {
 *   await exec(["non-existent-command"]);
 * } catch (e) {
 *   if (e instanceof NotFoundOnPathError) {
 *     console.log("Executable not found:", e.exe);
 *   }
 * }
 * ```
 */
export class NotFoundOnPathError extends Error {
  /**
   * The descriptor of the target when the error occurred.
   */
  target;
  /**
   * A link to more information about the error.
   */
  link;
  /**
   * The name or path of the command that was not found.
   */
  exe;
  constructor() {
    const arg = arguments.length === 1 ? arguments[0] : undefined;
    const options = typeof arg === "object" ? arguments[0] : {};
    const message = typeof arg === "string" ? arguments[0] : options.message;
    super(
      message ?? `Executable ${options.exe} not found on environment PATH.`,
      options,
    );
    this.name = "NotFoundOnPathError";
    this.target = options.target;
    this.link = options.link ??
      "https://jsr.io/@frostyeti/exec/doc/errors/~/NotFoundOnPathError";
    this.exe = options.exe;
  }
}
