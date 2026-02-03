import { CI, CI_DRIVER } from "./driver.ts";
import { stderr, stdout } from "@frostyeti/process";
import { get } from "@frostyeti/env";
import { sprintf } from "@frostyeti/fmt";
import { setLogger } from "@frostyeti/exec";
import {
    AnsiModes,
    AnsiSettings,
    bold,
    cyan,
    green,
    magenta,
    red,
    rgb24,
    yellow,
} from "@frostyeti/ansi";
import { secretMasker } from "@frostyeti/secrets";
import { isSpaceAt } from "@frostyeti/chars/is-space";

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
export function write(message: string, ...args: unknown[]): void {
    const formatted = args.length ? sprintf(message, ...args) : message;
    stdout.writeSync(new TextEncoder().encode(formatted));
}

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
export function writeLine(message: string, ...args: unknown[]): void {
    const formatted = args.length ? sprintf(message, ...args) : message;
    stdout.writeSync(new TextEncoder().encode(formatted + "\n"));
}

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
export function writeError(message: string, ...args: unknown[]): void {
    const formatted = args.length ? sprintf(message, ...args) : message;

    stderr.writeSync(new TextEncoder().encode(formatted));
}

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
export function writeErrorLine(message: string, ...args: unknown[]): void {
    const formatted = args.length ? sprintf(message, ...args) : message;
    stderr.writeSync(new TextEncoder().encode(formatted + "\n"));
}

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
export function progress(name: string, value: number): void {
    if (!CI) {
        write(`${name}: ${cyan(value.toString().padStart(2))}% \r`);
        return;
    }

    switch (CI_DRIVER) {
        case "github":
            writeLine(`::progress name=${name}::${value}`);
            break;
        case "azdo":
            writeLine(`##vso[task.setprogress value=${value};]${name}`);
            break;
        default:
            write(`${name}: ${value}% \r`);
            break;
    }
}

const mode = AnsiSettings.current.mode;
const isAtLeast8Bit = mode >= AnsiModes.EightBit;
const colorEnabled = mode >= AnsiModes.None;

function handleStack(stack?: string) {
    stack = stack ?? "";
    const index = stack.indexOf("\n");
    if (index === -1) {
        return stack;
    }

    return stack.substring(index + 1);
}

export function handleArguments(
    args: IArguments,
): { msg: string | undefined; stack: string | undefined } {
    let msg: string | undefined = undefined;
    let stack: string | undefined = undefined;

    switch (args.length) {
        case 0:
            return { msg, stack };
        case 1: {
            if (args[0] instanceof Error) {
                const e = args[0] as Error;
                msg = e.message;
                stack = handleStack(e.stack);
            } else {
                msg = args[0] as string;
            }

            return { msg, stack };
        }

        case 2: {
            if (args[0] instanceof Error) {
                const e = args[0] as Error;
                const message = args[1] as string;
                msg = message;
                stack = handleStack(e.stack);
            } else {
                const message = args[0] as string;
                const splat = Array.from(args).slice(1);
                msg = sprintf(message, ...splat);
            }
            return { msg, stack };
        }

        default: {
            if (args[0] instanceof Error) {
                const e = args[0] as Error;
                const message = args[1] as string;
                const splat = Array.from(args).slice(2);
                msg = sprintf(message, ...splat);
                stack = handleStack(e.stack);
            } else {
                const message = args[0] as string;
                const splat = Array.from(args).slice(1);
                msg = sprintf(message, ...splat);
            }

            return { msg, stack };
        }
    }
}

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
export function registerSecret(secret: string): void {
    secretMasker.add(secret);
}

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
export function error(e: Error, message?: string, ...args: unknown[]): void;
/**
 * Writes an error message to the output.
 * @param message The message to write.
 * @param args The message arguments.
 */
export function error(message: string, ...args: unknown[]): void;
export function error(): void {
    const { msg, stack } = handleArguments(arguments);
    switch (CI_DRIVER) {
        case "github":
            writeLine(`::error::${msg} ${stack}`);
            break;
        case "azdo":
            writeLine(`##[error]${msg} ${stack}`);
            break;
        default:
            if (isAtLeast8Bit) {
                writeError(rgb24("❱ [ERROR]: ", 0xff0000));
            } else if (colorEnabled) {
                writeError(red("❱ [ERROR]: "));
            } else {
                writeError("❱ [ERROR]: ");
            }

            writeError(msg || "");
            if (stack) {
                writeError(stack);
            }

            writeErrorLine("");

            break;
    }
}

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
export function warn(e: Error, message?: string, ...args: unknown[]): void;
/**
 * Writes a warning message to the output.
 * @param message The message to write.
 * @param args The message arguments.
 */
export function warn(message: string, ...args: unknown[]): void;
export function warn(): void {
    const { msg, stack } = handleArguments(arguments);

    switch (CI_DRIVER) {
        case "github":
            writeLine(`::warning::${msg} ${stack}`);
            return;
        case "azdo":
            writeLine(`##[warning]${msg} ${stack}`);
            return;
        default:
            {
                if (isAtLeast8Bit) {
                    writeError(rgb24("❱ [WARN]:  ", 0xff8700));
                } else if (colorEnabled) {
                    writeError(yellow("❱ [WARN]:  "));
                } else {
                    writeError("❱ [WARN]:  ");
                }

                writeError(msg || "");
                if (stack) {
                    writeError(stack);
                }

                writeErrorLine("");
            }
            break;
    }
}

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
export function info(e: Error, message?: string, ...args: unknown[]): void;
/**
 * Writes an info message to the output.
 * @param message The message to write.
 * @param args The message arguments.
 */
export function info(message: string, ...args: unknown[]): void;
export function info(): void {
    const { msg, stack } = handleArguments(arguments);

    if (isAtLeast8Bit) {
        writeError(rgb24("❱ [INFO]:  ", 0x00ffff));
    } else if (colorEnabled) {
        writeError(cyan("❱ [INFO]:  "));
    } else {
        writeError("❱ [INFO]:  ");
    }

    writeError(msg || "");
    if (stack) {
        writeError(stack);
    }

    writeErrorLine("");
}

let debugEnabled = get("DEBUG") === "true" || get("DEBUG") === "1" ||
    get("SYSTEM_DEBUG") === "true" || get("SYSTEM_DEBUG") === "1" ||
    get("ACTIONS_STEP_DEBUG") === "true" || get("ACTIONS_STEP_DEBUG") === "1";

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
export function setDebug(enabled: boolean): void {
    debugEnabled = enabled;
}

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
export function isDebugEnabled(): boolean {
    return debugEnabled;
}

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
export function debug(message: string, ...args: unknown[]): void {
    if (!debugEnabled) {
        return;
    }

    const formatted = args.length ? sprintf(message, ...args) : message;

    switch (CI_DRIVER) {
        case "github":
            writeLine(`::debug::${formatted}`);
            break;
        case "azdo":
            writeLine(`##[debug]${formatted}`);
            break;
        default:
            {
                if (isAtLeast8Bit) {
                    writeError(green("❱ [DEBUG]: "));
                } else if (colorEnabled) {
                    writeError(green("❱ [DEBUG]: "));
                } else {
                    writeError("❱ [DEBUG]: ");
                }

                writeErrorLine(formatted);
            }
            break;
    }
}

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
export function ok(message: string, ...args: unknown[]): void {
    const formatted = args.length ? sprintf(message, ...args) : message;

    if (isAtLeast8Bit) {
        write(green("❱ [OK]:    "));
    } else if (colorEnabled) {
        write(green("❱ [OK]:    "));
    } else {
        write("❱ [OK]:    ");
    }

    writeLine(formatted);
}

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
export function success(message: string, ...args: unknown[]): void {
    const formatted = args.length ? sprintf(message, ...args) : message;

    if (isAtLeast8Bit) {
        write(green("✔ [SUCCESS]: "));
    } else if (colorEnabled) {
        write(green("✔ [SUCCESS]: "));
    } else {
        write("✔ [SUCCESS]: ");
    }

    writeLine(formatted);
}

function hasSpace(string: string): boolean {
    for (let i = 0; i < string.length; i++) {
        if (isSpaceAt(string, i)) {
            return true;
        }
    }

    return false;
}

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
export function command(file: string, args?: string[]): void {
    switch (CI_DRIVER) {
        case "azdo":
            console.log(`##[command]${file} ${args?.join(" ") ?? ""}`);
            break;

        default: {
            if (isAtLeast8Bit) {
                write(cyan("❱ $ "));
                write(rgb24(`${file}`, 0xff8700));
                if (args && args.length > 0) {
                    for (const value of args) {
                        if (value.startsWith("-") || value.startsWith("/")) {
                            write(" ");
                            write(cyan(`${value}`));
                            continue;
                        }

                        const next = secretMasker.mask(value) ?? "";

                        if (hasSpace(next)) {
                            if (!value.includes("'")) {
                                write(" ");
                                write(magenta(`'${next}'`));
                            } else {
                                write(" ");
                                write(magenta(`"${next}"`));
                            }
                            continue;
                        }

                        write(` ${next}`);
                    }
                }

                writeLine("");
                return;
            } else if (colorEnabled) {
                write(cyan("❱ $ "));
                write(`${file}`);
                if (args && args.length > 0) {
                    for (const value of args) {
                        if (value.startsWith("-") || value.startsWith("/")) {
                            write(" ");
                            write(cyan(`${value}`));
                            continue;
                        }

                        const next = secretMasker.mask(value) ?? "";

                        if (hasSpace(next)) {
                            if (!next.includes("'")) {
                                write(" ");
                                write(magenta(`'${next}'`));
                            } else {
                                write(" ");
                                write(magenta(`"${next}"`));
                            }
                            continue;
                        }

                        write(` ${next}`);
                    }
                }

                writeLine("");
                return;
            } else {
                write(`❱ $ ${file}`);
                if (args && args.length > 0) {
                    for (const value of args) {
                        if (value.startsWith("-") || value.startsWith("/")) {
                            write(` ${value}`);
                            continue;
                        }

                        const next = secretMasker.mask(value) ?? "";

                        if (hasSpace(next)) {
                            if (!next.includes("'")) {
                                write(` '${next}'`);
                            } else {
                                write(` "${next}"`);
                            }
                            continue;
                        }

                        write(` ${next}`);
                    }
                }

                writeLine("");
                return;
            }
        }
    }
}
setLogger((file: string, args?: string[]) => {
    command(file, args);
});

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
export function startGroup(name: string): void {
    switch (CI_DRIVER) {
        case "azdo":
            writeLine(`##[group]❱${name}`);
            return;
        case "github":
            writeLine(`::group::❱ ${name}`);
            return;
        default:
            writeLine("");
            write("❱ ");
            writeLine(bold(name));
    }
}

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
export function endGroup(): void {
    switch (CI_DRIVER) {
        case "azdo":
            writeLine("##[endgroup]");
            return;
        case "github":
            writeLine("::endgroup::");
            return;
        default:
            writeLine("");
            return;
    }
}
