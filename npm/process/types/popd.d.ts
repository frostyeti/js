/**
 * Pops the last directory from the directory stack and
 * changes the current working directory to that directory.
 * In the browser environment, this function calls history.back
 * to change the URL.
 *
 * @returns The last directory in the stack.
 * @throws Error if pop is not implemented.
 */
export declare function popd(): string | undefined;
