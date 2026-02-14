/**
 * Options for the AssertionError class.
 * @see {@link AssertionError}
 */
export interface AssertionErrorOptions extends ErrorOptions {
    /**
     * The expected value of the assertion.
     */
    expected?: unknown;
    /**
     * The actual value of the assertion.
     */
    actual?: unknown;
    /**
     * A link to the documentation for the assertion.
     */
    link?: string;
}
/**
 * Represents an assertion error with additional context.
 *
 * @remarks
 * This class extends the built-in `Error` class to provide additional
 * information about assertion errors, including a link to documentation
 * and an optional target related to the error.
 *
 * @example
 * ```typescript
 * import { AssertionError } from "@frostyetiassert";
 *
 * throw new AssertionError("Assertion failed", { link: "https://example.com/docs", target: someObject });
 * ```
 *
 * @public
 */
export declare class AssertionError extends Error {
    /**
     * Creates a new instance of `AssertionError`.
     *
     * @param message - The error message.
     * @param options - The options for the error.
     */
    constructor(message: string, options?: AssertionErrorOptions);
    /**
     * Determines if the given error is an `AssertionError`.
     * @param e The error to check.
     * @returns `true` if the error is an `AssertionError`, otherwise `false`.
     */
    static is(e: unknown): e is AssertionError;
    /**
     * The expected of the assertion.
     */
    expected?: unknown;
    /**
     * The actual value of the assertion.
     */
    actual?: unknown;
    /**
     * A link to the documentation for the assertion.
     */
    link?: string;
}
