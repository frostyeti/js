/**
 * Gets the current working directory of the process.
 * In the browser environment, this function returns the
 * current URL or the last URL in the history if its
 * stored in the state.
 *
 * @returns The current working directory.
 * @throws Error if cwd is not implemented or if the runtime does not support
 * getting the current working directory.
 */
export declare function cwd(): string;
