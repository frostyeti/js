/**
 * Error thrown when the there is an error changing the directory.
 */
export declare class ChangeDirectoryError extends Error {
  constructor(message: string, options?: ErrorOptions);
}
/**
 * Updates the current working directory of the process. In
 * the browser environment, this function calls pushState
 *
 * @param directory The directory to change to.
 * @throws ChangeDirectoryError if chdir is not implemented, if the directory is not found,
 * or if the runtime does not support changing the directory.
 */
export declare function chdir(directory: string): void;
