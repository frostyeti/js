import { type SubstitutionOptions } from "./expand.js";
declare let proxy: Record<string, string | undefined>;
export { proxy };
/**
 * Retrieves the value of the specified environment variable.
 *
 * @param name - The name of the environment variable.
 * @returns The value of the environment variable, or `undefined` if it is not set.
 * @example
 * ```ts
 * import { get } from "@frostyeti/env";
 *
 * console.log(set("MY_VAR", "test")); // test
 * console.log(get("MY_VAR")); // test
 * ```
 */
export declare function get(name: string): string | undefined;
/**
 * Expands a template string using the current environment variables.
 * @param template The template string to expand.
 * @param options
 * @returns The expanded string.
 * ```ts
 * import { expand } from "@frostyeti/env";
 *
 * console.log(expand("${HOME}")); // /home/alice
 * console.log(expand("${HOME:-/home/default}")); // /home/alice
 * console.log(expand("${HOME:=/home/default}")); // /home/alice
 * ```
 */
export declare function expand(
  template: string,
  options?: SubstitutionOptions,
): string;
/**
 * Sets the value of the specified environment variable.
 * @param name The name of the environment variable.
 * @param value The value to set.
 * ```ts
 * import { set, get } from "@frostyeti/env";
 *
 * console.log(set("MY_VAR", "test")); // test
 * console.log(get("MY_VAR")); // test
 * ```
 */
export declare function set(name: string, value: string): void;
/**
 * Sets the value of the specified environment variable if it is not already set.
 * @param name The name of the environment variable.
 * @param value The value to set.
 * ```ts
 * import { remove, get, set } from "@frostyeti/env";
 *
 * set("MY_VAR", "test")
 * console.log(get("MY_VAR")); // test
 * remove("MY_VAR");
 * console.log(get("MY_VAR")); // undefined
 * ```
 */
export declare function remove(name: string): void;
/**
 * Determines if the specified environment variable is set.
 * @param name The name of the environment variable.
 * @returns `true` if the environment variable is set, `false` otherwise.
 * ```ts
 * import { has, set } from "@frostyeti/env";
 *
 * set("MY_VAR", "test");
 * console.log(has("MY_VAR")); // true
 * console.log(has("NOT_SET")); // false
 * ```
 */
export declare function has(name: string): boolean;
/**
 * Clones and returns the environment variables as a record of key-value pairs.
 * @returns The environment variables as a record of key-value pairs.
 * ```ts
 * import { toObject, set } from "@frostyeti/env";
 *
 * set("MY_VAR", "test");
 * // may include other environment variables
 * console.log(toObject()); // { MY_VAR: "test" }
 * ```
 */
export declare function toObject(): Record<string, string | undefined>;
/**
 * Merges the provided environment variables into the current environment.
 * @remarks
 * This function will overwrite existing values in the environment with the provided values.
 * If a value is `undefined`, it will be removed from the environment.
 * @param values The values to merge into the environment.
 * ```ts
 * import { merge, set, toObject } from "@frostyeti/env";
 *
 * set("MY_VAR", "test");
 * merge({ "MY_VAR": undefined, "MY_VAR2": "test2" });
 * console.log(toObject()); // { MY_VAR2: "test2" }
 * ```
 */
export declare function merge(values: Record<string, string | undefined>): void;
/**
 * Union of the provided environment variables into the current environment.
 *
 * @remarks
 * This function will only add new values to the environment if they do not already exist.
 * If a value is `undefined`, it will be ignored.
 *
 * @param values The values to merge into the environment.
 * ```ts
 * import { union, set, toObject } from "@frostyeti/env";
 *
 * set("MY_VAR", "test");
 * union({ "MY_VAR": undefined, "MY_VAR2": "test2" });
 * console.log(toObject()); // { MY_VAR: "test", MY_VAR2: "test2" }
 * ```
 */
export declare function union(values: Record<string, string | undefined>): void;
/**
 * Gets the environment path.
 * @remarks
 * This function retrieves the environment path as a string.
 * @returns The environment path as a string.
 * ```ts
 * import { getPath } from "@frostyeti/env";
 *
 * console.log(getPath()); // /usr/local/bin:/usr/bin:/bin
 * ```
 */
export declare function getPath(): string;
/**
 * Sets the environment path.
 * @remarks
 * This function sets the environment path to the specified value.
 * @param value The value to set.
 * ```ts
 * import { setPath } from "@frostyeti/env";
 *
 * setPath("/usr/local/bin:/usr/bin:/bin");
 * console.log(getPath()); // /usr/local/bin:/usr/bin:/bin
 * ```
 */
export declare function setPath(value: string): void;
/**
 * Determines if the specified path exists in the environment path.
 * @param value The path to check.
 * @param paths The paths to check against. If not provided, the current environment path will be used.
 * @returns `true` if the path exists, `false` otherwise.
 * ```ts
 * import { hasPath, getPath } from "@frostyeti/env";
 *
 * console.log(hasPath("/usr/local/bin")); // true
 * console.log(hasPath("/usr/local/bin", getPath().split(":"))); // true
 * console.log(hasPath("/usr/local/bin", ["/usr/bin", "/bin"])); // false
 * ```
 */
export declare function hasPath(value: string, paths?: string[]): boolean;
/**
 * Joins the provided paths into a single string.
 * @param paths The paths to join.
 * @returns the joined path as a string.
 *
 * ```ts
 * import { joinPath } from "@frostyeti/env";
 *
 * console.log(joinPath(["/usr/local/bin", "/usr/bin", "/bin"])); // /usr/local/bin:/usr/bin:/bin
 * ```
 */
export declare function joinPath(paths: string[]): string;
/**
 * Splits the environment path into an array of paths.
 * @returns The environment path as an array of paths
 * as long as the path is not empty.
 * ```ts
 * import { splitPath } from "@frostyeti/env";
 *
 * console.log(splitPath()); // ["/usr/local/bin", "/usr/bin", "/bin"]
 * console.log(splitPath("/usr/local/bin:/usr/bin:/bin")); // ["/usr/local/bin", "/usr/bin", "/bin"]
 * ```
 */
export declare function splitPath(path?: string): string[];
/**
 * Appends the specified path to the environment path.
 * @param path The path to append.
 * @param force Force the append even if the path already exists.
 * ```ts
 * import { appendPath, setPath } from "@frostyeti/env";
 *
 * setPath("/usr/bin:/bin");
 * appendPath("/usr/local/bin");
 * console.log(getPath()); // /usr/bin:/bin:/usr/local/bin
 * ```
 */
export declare function appendPath(path: string, force?: boolean): void;
/**
 * Prepends the specified path to the environment path.
 * @param path The path to prepend.
 * @param force Force the prepend even if the path already exists.
 * ```ts
 * import { prependPath, setPath } from "@frostyeti/env";
 *
 * setPath("/usr/bin:/bin");
 * prependPath("/usr/local/bin");
 * console.log(getPath()); // /usr/local/bin:/usr/bin:/bin
 * ```
 */
export declare function prependPath(path: string, force?: boolean): void;
/**
 * Removes the specified path from the environment path.
 * @param path - The path to remove.
 * ```ts
 * import { removePath, setPath, getPath } from "@frostyeti/env";
 *
 * setPath("/usr/bin:/bin:/usr/local/bin");
 * removePath("/usr/local/bin");
 * console.log(getPath()); // /usr/bin:/bin
 * ```
 */
export declare function removePath(path: string): void;
/**
 * Replaces the specified old path with the new path in the environment path.
 * @param oldPath - The path to replace.
 * @param newPath - The new path.
 * ```ts
 * import { replacePath, setPath, getPath } from "@frostyeti/env";
 *
 * setPath("/usr/bin:/bin:/usr/local/bin");
 * replacePath("/usr/local/bin", "/opt/local/bin");
 * console.log(getPath()); // /usr/bin:/bin:/opt/local/bin
 * ```
 */
export declare function replacePath(oldPath: string, newPath: string): void;
/**
 * Gets the current user's home directory using the HOME or USERPROFILE environment variable.
 * @returns The current user's home directory.
 * ```ts
 * import { home } from "@frostyeti/env";
 *
 * console.log(home()); // /home/alice
 * ```
 */
export declare function home(): string | undefined;
/**
 * Gets the current user's name using the USER or USERNAME environment variable.
 * @returns The current user's name.
 * ```ts
 * import { user } from "@frostyeti/env";
 *
 * console.log(user()); // alice
 * ```
 */
export declare function user(): string | undefined;
/**
 * Gets the current user's shell using the SHELL or ComSpec environment variable.
 * @returns The current user's shell.
 * ```ts
 * import { shell } from "@frostyeti/env";
 *
 * console.log(shell()); // /bin/bash
 * ```
 */
export declare function shell(): string | undefined;
/**
 * Gets the current user's hostname using the HOSTNAME or COMPUTERNAME environment variable.
 * @returns The current user's hostname.
 * ```ts
 * import { hostname } from "@frostyeti/env";
 *
 * console.log(hostname()); // my-computer
 * ```
 */
export declare function hostname(): string | undefined;
/**
 * Gets the current os using the OS or OSTYPE environment variable.
 * @returns The current operating system.
 * ```ts
 * import { os } from "@frostyeti/env";
 *
 * console.log(os()); // linux-gnu
 * ```
 */
export declare function os(): string | undefined;
