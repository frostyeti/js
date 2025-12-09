/**
 * Writes a message to the output.
 * @param message The message to write.
 * @param args The message arguments.
 */
export declare function write(message: string, ...args: unknown[]): void;
/**
 * Writes a line to the output.
 * @param message The messsage to write.
 * @param args The message arguments.
 */
export declare function writeLine(message: string, ...args: unknown[]): void;
/**
 * Writes an error message to the error output.
 * @param message The message to write.
 * @param args The message arguments.
 */
export declare function writeError(message: string, ...args: unknown[]): void;
/**
 * Writes an error line to the error output.
 * @param message The message to write.
 * @param args The message arguments.
 */
export declare function writeErrorLine(
  message: string,
  ...args: unknown[]
): void;
/**
 * Writes a progress message to the output.
 * @param name The name of the progress.
 * @param value the progress value.
 */
export declare function progress(name: string, value: number): void;
export declare function handleArguments(args: IArguments): {
  msg: string | undefined;
  stack: string | undefined;
};
/**
 * Registers a secret with the secret masker.
 * @param secret The secret to register.
 */
export declare function registerSecret(secret: string): void;
/**
 * Writes an error message to the output.
 * @param e The error.
 * @param message The message to write.
 * @param args The message arguments.
 * @returns the writer.
 */
export declare function error(
  e: Error,
  message?: string,
  ...args: unknown[]
): void;
/**
 * Writes an error message to the output.
 * @param message The message to write.
 * @param args The message arguments.
 * @returns the writer.
 */
export declare function error(message: string, ...args: unknown[]): void;
/**
 * Writes an warning message to the output.
 * @param e The error.
 * @param message The message to write.
 * @param args The message arguments.
 * @returns the writer.
 */
export declare function warn(
  e: Error,
  message?: string,
  ...args: unknown[]
): void;
/**
 * Writes a warning message to the output.
 * @param message The message to write.
 * @param args The message arguments.
 * @returns the writer.
 */
export declare function warn(message: string, ...args: unknown[]): void;
export declare function setDebug(enabled: boolean): void;
export declare function isDebugEnabled(): boolean;
/**
 * Writes a debug message to the output.
 * @param message The message to write.
 * @param args The message arguments.
 * @returns the writer.
 */
export declare function debug(message: string, ...args: unknown[]): void;
/**
 * Writes an ok message to the output.
 * @param message The message to write.
 * @param args The message arguments.
 * @returns the writer.
 */
export declare function ok(message: string, ...args: unknown[]): void;
/**
 * Writes a success message to the output.
 * @param message The message to write.
 * @param args The message arguments.
 * @returns the writer.
 */
export declare function success(message: string, ...args: unknown[]): void;
/**
 * Writes a command to the output.
 * @param command The executable.
 * @param args The arguments passed to the command.
 * @returns The writer.
 */
export declare function command(file: string, args?: string[]): void;
/**
 * Start a new group of log messages.
 * @param name The name of the group.
 * @returns The writer instance.
 */
export declare function startGroup(name: string): void;
/**
 * Ends the current group.
 * @returns The writer instance.
 */
export declare function endGroup(): void;
