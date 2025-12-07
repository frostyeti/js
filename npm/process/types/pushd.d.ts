/**
 * Pushes the current working directory onto the directory
 * stack and changes the current working directory to the
 * specified directory.
 *
 * @param directory The directory to change to.
 * @throws ChangeDirectoryError if chdir is not implemented, if the directory is not found,
 * or if the runtime does not support changing the directory.
 */
export declare function pushd(directory: string): void;
