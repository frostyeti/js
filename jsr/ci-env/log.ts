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

/**
 * Writes a message to the output.
 * @param message The message to write.
 * @param args The message arguments.
 */
export function write(message: string, ...args: unknown[]): void {
    const formatted = args.length ? sprintf(message, ...args) : message;

    stdout.write(new TextEncoder().encode(formatted));
}

/**
 * Writes a line to the output.
 * @param message The messsage to write.
 * @param args The message arguments.
 */
export function writeLine(message: string, ...args: unknown[]): void {
    const formatted = args.length ? sprintf(message, ...args) : message;

    stdout.write(new TextEncoder().encode(formatted + "\n"));
}

/**
 * Writes an error message to the error output.
 * @param message The message to write.
 * @param args The message arguments.
 */
export function writeError(message: string, ...args: unknown[]): void {
    const formatted = args.length ? sprintf(message, ...args) : message;

    stderr.write(new TextEncoder().encode(formatted));
}

/**
 * Writes an error line to the error output.
 * @param message The message to write.
 * @param args The message arguments.
 */
export function writeErrorLine(message: string, ...args: unknown[]): void {
    const formatted = args.length ? sprintf(message, ...args) : message;

    stderr.write(new TextEncoder().encode(formatted + "\n"));
}

/**
 * Writes a progress message to the output.
 * @param name The name of the progress.
 * @param value the progress value.
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
 * @param secret The secret to register.
 */
export function registerSecret(secret: string): void {
    secretMasker.add(secret);
}

/**
 * Writes an error message to the output.
 * @param e The error.
 * @param message The message to write.
 * @param args The message arguments.
 * @returns the writer.
 */
export function error(e: Error, message?: string, ...args: unknown[]): void;
/**
 * Writes an error message to the output.
 * @param message The message to write.
 * @param args The message arguments.
 * @returns the writer.
 */
export function error(message: string, ...args: unknown[]): void;
export function error(): void {
    const { msg, stack } = handleArguments(arguments);
    switch (CI_DRIVER) {
        case "github":
            writeErrorLine(`::error::${msg} ${stack}`);
            break;
        case "azdo":
            writeErrorLine(`##[error]${msg} ${stack}`);
            break;
        default:
            if (isAtLeast8Bit) {
                write(rgb24("❱ [ERROR]: ", 0xff0000));
            } else if (colorEnabled) {
                write(red("❱ [ERROR]: "));
            } else {
                write("❱ [ERROR]: ");
            }

            writeLine(msg || "");
            if (stack) {
                writeLine(stack);
            }

            break;
    }
}

/**
 * Writes an warning message to the output.
 * @param e The error.
 * @param message The message to write.
 * @param args The message arguments.
 * @returns the writer.
 */
export function warn(e: Error, message?: string, ...args: unknown[]): void;
/**
 * Writes a warning message to the output.
 * @param message The message to write.
 * @param args The message arguments.
 * @returns the writer.
 */
export function warn(message: string, ...args: unknown[]): void;
export function warn(): void {
    const { msg, stack } = handleArguments(arguments);

    switch (CI_DRIVER) {
        case "github":
            writeErrorLine(`::warning::${msg} ${stack}`);
            return;
        case "azdo":
            writeErrorLine(`##[warning]${msg} ${stack}`);
            return;
        default:
            {
                if (isAtLeast8Bit) {
                    write(rgb24("❱ [WARN]:  ", 0xff8700));
                } else if (colorEnabled) {
                    write(yellow("❱ [WARN]:  "));
                } else {
                    write("❱ [WARN]:  ");
                }

                writeLine(msg || "");
                if (stack) {
                    writeLine(stack);
                }
            }
            break;
    }
}

let debugEnabled = get("DEBUG") === "true" || get("DEBUG") === "1" ||
    get("SYSTEM_DEBUG") === "true" || get("SYSTEM_DEBUG") === "1" ||
    get("ACTIONS_STEP_DEBUG") === "true" || get("ACTIONS_STEP_DEBUG") === "1";

export function setDebug(enabled: boolean): void {
    debugEnabled = enabled;
}

export function isDebugEnabled(): boolean {
    return debugEnabled;
}

/**
 * Writes a debug message to the output.
 * @param message The message to write.
 * @param args The message arguments.
 * @returns the writer.
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
                    write(green("❱ [DEBUG]: "));
                } else if (colorEnabled) {
                    write(green("❱ [DEBUG]: "));
                } else {
                    write("❱ [DEBUG]: ");
                }

                writeLine(formatted);
            }
            break;
    }
}

/**
 * Writes an ok message to the output.
 * @param message The message to write.
 * @param args The message arguments.
 * @returns the writer.
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
 * Writes a success message to the output.
 * @param message The message to write.
 * @param args The message arguments.
 * @returns the writer.
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

/**
 * Writes a command to the output.
 * @param command The executable.
 * @param args The arguments passed to the command.
 * @returns The writer.
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

                        if (next.includes(" ") || next.includes("\n") || next.includes("\t")) {
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

                        if (next.includes(" ") || next.includes("\n") || next.includes("\t")) {
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

                        if (next.includes(" ") || next.includes("\n") || next.includes("\t")) {
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
 * Start a new group of log messages.
 * @param name The name of the group.
 * @returns The writer instance.
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
 * Ends the current group.
 * @returns The writer instance.
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
