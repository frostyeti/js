/**
 * Writes a message to the output (without newline).
 * @param message The message to write.
 * @param args The message arguments (sprintf-style formatting).
 * @example
 * ```ts
 * import { write } from "@frostyeti/ci-env";
 *
 * write("Hello ");
 * write("World!");
 * // Output: Hello World!
 *
 * // With formatting
 * write("Count: %d, Name: %s", 42, "test");
 * ```
 */
export declare function write(message: string, ...args: unknown[]): void;
/**
 * Writes a line to the output (with newline).
 * @param message The message to write.
 * @param args The message arguments (sprintf-style formatting).
 * @example
 * ```ts
 * import { writeLine } from "@frostyeti/ci-env";
 *
 * writeLine("Hello World!");
 *
 * // With formatting
 * writeLine("Build %s completed in %d seconds", "v1.0.0", 45);
 * ```
 */
export declare function writeLine(message: string, ...args: unknown[]): void;
/**
 * Writes a message to stderr (without newline).
 * @param message The message to write.
 * @param args The message arguments (sprintf-style formatting).
 * @example
 * ```ts
 * import { writeError } from "@frostyeti/ci-env";
 *
 * writeError("Warning: %s", "Something went wrong");
 * ```
 */
export declare function writeError(message: string, ...args: unknown[]): void;
/**
 * Writes a line to stderr (with newline).
 * @param message The message to write.
 * @param args The message arguments (sprintf-style formatting).
 * @example
 * ```ts
 * import { writeErrorLine } from "@frostyeti/ci-env";
 *
 * writeErrorLine("Error: File not found");
 * writeErrorLine("Failed to process %s", "config.json");
 * ```
 */
export declare function writeErrorLine(
  message: string,
  ...args: unknown[]
): void;
/**
 * Writes a progress message to the output.
 *
 * In CI environments, this emits CI-specific progress commands:
 * - **GitHub Actions**: `::progress name=...::...`
 * - **Azure DevOps**: `##vso[task.setprogress]`
 *
 * @param name The name of the progress indicator.
 * @param value The progress value (0-100).
 * @example
 * ```ts
 * import { progress } from "@frostyeti/ci-env";
 *
 * for (let i = 0; i <= 100; i += 10) {
 *   progress("Downloading", i);
 *   await delay(100);
 * }
 * ```
 */
export declare function progress(name: string, value: number): void;
export declare function handleArguments(args: IArguments): {
  msg: string | undefined;
  stack: string | undefined;
};
/**
 * Registers a secret with the secret masker.
 *
 * Once registered, the secret value will be masked (replaced with `***`)
 * in all log output to prevent accidental exposure.
 *
 * @param secret The secret value to register.
 * @example
 * ```ts
 * import { registerSecret, writeLine } from "@frostyeti/ci-env";
 *
 * const apiKey = "super-secret-key";
 * registerSecret(apiKey);
 *
 * // Secret is automatically masked in output
 * writeLine("Using API key: " + apiKey);
 * // Output: Using API key: ***
 * ```
 */
export declare function registerSecret(secret: string): void;
/**
 * Writes an error message to the output.
 *
 * In CI environments, this emits CI-specific error annotations:
 * - **GitHub Actions**: `::error::...`
 * - **Azure DevOps**: `##[error]...`
 *
 * @param e The error object.
 * @param message Optional message override.
 * @param args The message arguments.
 * @example
 * ```ts
 * import { error } from "@frostyeti/ci-env";
 *
 * // Simple error message
 * error("Build failed: missing dependencies");
 *
 * // Error with formatting
 * error("Failed to compile %s: %d errors", "main.ts", 5);
 *
 * // Error with Error object
 * try {
 *   throw new Error("Something went wrong");
 * } catch (e) {
 *   error(e, "Custom error message");
 * }
 * ```
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
 */
export declare function error(message: string, ...args: unknown[]): void;
/**
 * Writes a warning message to the output.
 *
 * In CI environments, this emits CI-specific warning annotations:
 * - **GitHub Actions**: `::warning::...`
 * - **Azure DevOps**: `##[warning]...`
 *
 * @param e The error object.
 * @param message Optional message override.
 * @param args The message arguments.
 * @example
 * ```ts
 * import { warn } from "@frostyeti/ci-env";
 *
 * // Simple warning
 * warn("Deprecated API usage detected");
 *
 * // Warning with formatting
 * warn("File %s not found, using default", "config.json");
 * ```
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
 */
export declare function warn(message: string, ...args: unknown[]): void;
/**
 * Writes an info message to the output.
 *
 * @param e The error object.
 * @param message Optional message override.
 * @param args The message arguments.
 * @example
 * ```ts
 * import { info } from "@frostyeti/ci-env";
 *
 * info("Starting build process");
 * info("Processing %d files", 42);
 * ```
 */
export declare function info(
  e: Error,
  message?: string,
  ...args: unknown[]
): void;
/**
 * Writes an info message to the output.
 * @param message The message to write.
 * @param args The message arguments.
 */
export declare function info(message: string, ...args: unknown[]): void;
/**
 * Enables or disables debug logging.
 *
 * Debug mode is automatically enabled when `DEBUG`, `SYSTEM_DEBUG`,
 * or `ACTIONS_STEP_DEBUG` environment variables are set to `true` or `1`.
 *
 * @param enabled Whether to enable debug logging.
 * @example
 * ```ts
 * import { setDebug, debug } from "@frostyeti/ci-env";
 *
 * // Enable debug mode
 * setDebug(true);
 *
 * // Now debug messages will be shown
 * debug("Variable value: %s", someVar);
 * ```
 */
export declare function setDebug(enabled: boolean): void;
/**
 * Returns whether debug logging is enabled.
 *
 * @returns `true` if debug logging is enabled, `false` otherwise.
 * @example
 * ```ts
 * import { isDebugEnabled } from "@frostyeti/ci-env";
 *
 * if (isDebugEnabled()) {
 *   console.log("Detailed diagnostics enabled");
 * }
 * ```
 */
export declare function isDebugEnabled(): boolean;
/**
 * Writes a debug message to the output.
 *
 * Debug messages are only shown when debug mode is enabled.
 * In CI environments, this emits CI-specific debug commands:
 * - **GitHub Actions**: `::debug::...`
 * - **Azure DevOps**: `##[debug]...`
 *
 * @param message The message to write.
 * @param args The message arguments.
 * @example
 * ```ts
 * import { debug, setDebug } from "@frostyeti/ci-env";
 *
 * setDebug(true);
 * debug("Processing file: %s", filename);
 * debug("Cache hit: %s", cacheKey);
 * ```
 */
export declare function debug(message: string, ...args: unknown[]): void;
/**
 * Writes an "OK" message to the output.
 *
 * @param message The message to write.
 * @param args The message arguments.
 * @example
 * ```ts
 * import { ok } from "@frostyeti/ci-env";
 *
 * ok("All tests passed");
 * ok("Deployed to %s successfully", "production");
 * ```
 */
export declare function ok(message: string, ...args: unknown[]): void;
/**
 * Writes a "SUCCESS" message to the output.
 *
 * @param message The message to write.
 * @param args The message arguments.
 * @example
 * ```ts
 * import { success } from "@frostyeti/ci-env";
 *
 * success("Build completed");
 * success("Published version %s", "1.2.3");
 * ```
 */
export declare function success(message: string, ...args: unknown[]): void;
/**
 * Writes a command to the output, with syntax highlighting.
 *
 * Arguments containing spaces are automatically quoted.
 * Secrets are automatically masked.
 *
 * @param file The executable/command name.
 * @param args The arguments passed to the command.
 * @example
 * ```ts
 * import { command } from "@frostyeti/ci-env";
 *
 * command("npm", ["install", "--save", "lodash"]);
 * // Output: ❱ $ npm --save lodash
 *
 * command("git", ["commit", "-m", "Initial commit"]);
 * // Output: ❱ $ git -m 'Initial commit'
 * ```
 */
export declare function command(file: string, args?: string[]): void;
/**
 * Starts a new collapsible group of log messages.
 *
 * In CI environments, this emits CI-specific group commands:
 * - **GitHub Actions**: `::group::...`
 * - **Azure DevOps**: `##[group]...`
 *
 * @param name The name of the group.
 * @example
 * ```ts
 * import { startGroup, endGroup, writeLine } from "@frostyeti/ci-env";
 *
 * startGroup("Installing dependencies");
 * writeLine("npm install lodash");
 * writeLine("npm install typescript");
 * endGroup();
 *
 * startGroup("Running tests");
 * writeLine("Running 42 tests...");
 * endGroup();
 * ```
 */
export declare function startGroup(name: string): void;
/**
 * Ends the current collapsible group.
 *
 * @example
 * ```ts
 * import { startGroup, endGroup, writeLine } from "@frostyeti/ci-env";
 *
 * startGroup("Build");
 * writeLine("Compiling...");
 * endGroup();
 * ```
 */
export declare function endGroup(): void;
