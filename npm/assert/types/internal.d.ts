/**
 * Remove ANSI escape codes from the string.
 *
 * @param string Text to remove ANSI escape codes from
 *
 * @returns Text without ANSI escape codes
 *
 * @example Usage
 * ```ts no-assert
 * import { red, stripAnsiCode } from "@std/internal/styles";
 *
 * console.log(stripAnsiCode(red("Hello, world!"))); // Prints "Hello, world!"
 * ```
 */
export declare function stripAnsiCode(str: string): string;
