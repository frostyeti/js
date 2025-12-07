import { globals } from "@frostyeti/globals/globals";

/**
 * Error thrown when the there is an error changing the directory.
 */
export class ChangeDirectoryError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
        this.name = "ChangeDirectoryError";
    }
}

/**
 * Updates the current working directory of the process. In
 * the browser environment, this function calls pushState
 *
 * @param directory The directory to change to.
 * @throws ChangeDirectoryError if chdir is not implemented, if the directory is not found,
 * or if the runtime does not support changing the directory.
 * 
 * @example
 * ```ts
 * import { chdir } from "@frostyeti/process/chdir.ts";
 * 
 * chdir("/path/to/directory");
 * console.log(`Changed directory to: /path/to/directory`);
 * ```
 */
export function chdir(directory: string): void {
    if (globals.Deno) {
        try {
            globals.Deno.chdir(directory);
            return;
        } catch (e) {
            if (!(e instanceof Error)) {
                throw new ChangeDirectoryError(`Unexpected error ${e}`, { cause: e });
            }

            throw new ChangeDirectoryError(e.message, { cause: e });
        }
    }

    if (globals.process) {
        try {
            globals.process.chdir(directory);
            return;
        } catch (e) {
            if (!(e instanceof Error)) {
                throw new ChangeDirectoryError(`Unexpected error ${e}`, { cause: e });
            }

            throw new ChangeDirectoryError(e.message, { cause: e });
        }
    }

    // deno-lint-ignore no-explicit-any
    if (globals.window && (globals.window as any).history) {
        // deno-lint-ignore no-explicit-any
        (globals.window as any).history.pushState({ url: directory }, "", directory);
        return;
    }

    throw new ChangeDirectoryError("chdir is not implemented");
}
