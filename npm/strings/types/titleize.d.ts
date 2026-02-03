/**
 * The titleize module provides a function to convert a string to title case.
 *
 * @module
 */
/**
 * Converts the string to title case.
 * @param s The string to titleize.
 * @returns The titleized string.
 *
 * @example
 * ```typescript
 * import { titleize } from "@frostyeti/strings";
 *
 * titleize("hello world");     // "Hello World"
 * titleize("the quick fox");   // "The Quick Fox"
 * titleize("HELLO WORLD");     // "Hello World"
 * ```
 */
export declare function titleize(s: string): string;
