import { equalFold } from "@frostyeti/strings/equal";
import { expand as substitute, type SubstitutionOptions } from "./expand.ts";
import { BROWSER, globals, WINDOWS } from "./globals.ts";

const WIN_DESKTOP = WINDOWS && !BROWSER;
const SEP = WIN_DESKTOP ? ";" : ":";
const PATH_NAME = WIN_DESKTOP ? "Path" : "PATH";

let proxy: Record<string, string | undefined> = {};

if (globals.Deno) {
    proxy = new Proxy({}, {
        get(_target, name) {
            if (typeof name !== "string" || name === "") {
                return undefined;
            }

            return globals.Deno.env.get(name as string);
        },
        set(_target, name, value) {
            if (typeof name !== "string" || name === "") {
                return false;
            }

            globals.Deno.env.set(name as string, value as string);
            return true;
        },
        deleteProperty(_target, name) {
            if (typeof name !== "string" || name === "") {
                return false;
            }

            globals.Deno.env.delete(name as string);
            return true;
        },
        has(_target, name) {
            if (typeof name !== "string" || name === "") {
                return false;
            }

            return globals.Deno.env.get(name as string) !== undefined;
        },
        ownKeys(_target) {
            return Object.keys(globals.Deno.env.toObject());
        },
        getOwnPropertyDescriptor(_target, name) {
            return {
                value: globals.Deno.env.get(name as string),
                writable: true,
                enumerable: true,
                configurable: true,
            };
        },
    });
} else if (globals.process) {
    proxy = new Proxy({}, {
        get(_target, name) {
            if (typeof name !== "string" || name === "") {
                return undefined;
            }

            return globals.process.env[name as string];
        },
        set(_target, name, value) {
            if (typeof name !== "string" || name === "") {
                return false;
            }

            globals.process.env[name as string] = value as string;
            return true;
        },
        deleteProperty(_target, name) {
            if (typeof name !== "string" || name === "") {
                return false;
            }

            delete globals.process.env[name as string];
            return true;
        },
        has(_target, name) {
            if (typeof name !== "string" || name === "") {
                return false;
            }

            return globals.process.env[name as string] !== undefined;
        },
        ownKeys(_target) {
            return Object.keys(globals.process.env);
        },
        getOwnPropertyDescriptor(_target, name) {
            return {
                value: globals.process.env[name as string],
                writable: true,
                enumerable: true,
                configurable: true,
            };
        },
    });
}

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
export function get(name: string): string | undefined {
    return proxy[name];
}

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
export function expand(template: string, options?: SubstitutionOptions): string {
    return substitute(template, get, set, options);
}

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
export function set(name: string, value: string): void {
    proxy[name] = value;
}

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
export function remove(name: string): void {
    delete proxy[name];
}

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
export function has(name: string): boolean {
    return proxy[name] !== undefined;
}

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
export function toObject(): Record<string, string | undefined> {
    return { ...proxy };
}

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
export function merge(values: Record<string, string | undefined>): void {
    for (const [key, value] of Object.entries(values)) {
        if (value === undefined || value === null) {
            delete proxy[key];
        } else {
            proxy[key] = value;
        }
    }
}

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
export function union(values: Record<string, string | undefined>): void {
    for (const [key, value] of Object.entries(values)) {
        if (value === undefined) {
            continue;
        }

        if (proxy[key] === undefined) {
            proxy[key] = value;
        }
    }
}

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
export function getPath(): string {
    const value = get(PATH_NAME);
    if (value === undefined) {
        return "";
    }

    return value;
}

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
export function setPath(value: string): void {
    set(PATH_NAME, value);
}

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
export function hasPath(value: string, paths?: string[]): boolean {
    if (paths === undefined) {
        paths = splitPath();
    }

    return paths.some((path) => WIN_DESKTOP ? equalFold(path, value) : path === value);
}

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
export function joinPath(paths: string[]): string {
    return paths.join(SEP);
}

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
export function splitPath(path?: string): string[] {
    return (path ?? getPath())
        .split(SEP)
        .filter((p) => p.length > 0);
}

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
export function appendPath(path: string, force = false): void {
    const paths = splitPath();
    if (force || !hasPath(path, paths)) {
        paths.push(path);
        setPath(joinPath(paths));
    }
}

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
export function prependPath(path: string, force = false): void {
    const paths = splitPath();
    if (force || !hasPath(path, paths)) {
        paths.unshift(path);
        setPath(joinPath(paths));
    }
}

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
export function removePath(path: string): void {
    const paths = splitPath();
    const index = paths.findIndex((p) => WIN_DESKTOP ? equalFold(p, path) : p === path);
    if (index !== -1) {
        paths.splice(index, 1);
        setPath(joinPath(paths));
    }
}

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
export function replacePath(oldPath: string, newPath: string): void {
    const paths = splitPath();
    const index = paths.findIndex((p) => WIN_DESKTOP ? equalFold(p, oldPath) : p === oldPath);
    if (index !== -1) {
        paths[index] = newPath;
        setPath(joinPath(paths));
    }
}

/**
 * Gets the current user's home directory using the HOME or USERPROFILE environment variable.
 * @returns The current user's home directory.
 * ```ts
 * import { home } from "@frostyeti/env";
 *
 * console.log(home()); // /home/alice
 * ```
 */
export function home(): string | undefined {
    return get("HOME") ?? get("USERPROFILE") ?? undefined;
}

/**
 * Gets the current user's name using the USER or USERNAME environment variable.
 * @returns The current user's name.
 * ```ts
 * import { user } from "@frostyeti/env";
 *
 * console.log(user()); // alice
 * ```
 */
export function user(): string | undefined {
    return get("USER") ?? get("USERNAME") ?? undefined;
}

/**
 * Gets the current user's shell using the SHELL or ComSpec environment variable.
 * @returns The current user's shell.
 * ```ts
 * import { shell } from "@frostyeti/env";
 *
 * console.log(shell()); // /bin/bash
 * ```
 */
export function shell(): string | undefined {
    return get("SHELL") ?? get("ComSpec") ?? undefined;
}

/**
 * Gets the current user's hostname using the HOSTNAME or COMPUTERNAME environment variable.
 * @returns The current user's hostname.
 * ```ts
 * import { hostname } from "@frostyeti/env";
 *
 * console.log(hostname()); // my-computer
 * ```
 */
export function hostname(): string | undefined {
    return get("HOSTNAME") ?? get("COMPUTERNAME") ?? undefined;
}

/**
 * Gets the current os using the OS or OSTYPE environment variable.
 * @returns The current operating system.
 * ```ts
 * import { os } from "@frostyeti/env";
 *
 * console.log(os()); // linux-gnu
 * ```
 */
export function os(): string | undefined {
    return get("OS") ?? get("OSTYPE") ?? undefined;
}
