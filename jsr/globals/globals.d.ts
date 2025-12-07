/**
 * The reference to the `globalThis` object and makes it
 * possible to access the global scope in a type-safe way.
 * This is useful for accessing global variables and functions
 */
// deno-lint-ignore no-explicit-any
export declare const globals: typeof globalThis & Record<string | symbol, any>;

/**
 * Checks whether a global variable or property exists in the `globals` object.
 *
 * If the `name` parameter is a dot-separated string (e.g., `"foo.bar.baz"`),
 * the function traverses the nested properties of `globals` to determine if the
 * entire path exists. If `name` is a symbol or a simple string, it checks for
 * direct existence in `globals`.
 *
 * @param name - The name or symbol of the global variable or property to check.
 *               Dot-separated strings are treated as paths to nested properties.
 * @returns `true` if the global variable or property exists, otherwise `false`.
 */
export declare function hasGlobal(name: string | symbol): boolean;

/**
 * Retrieves a global value by its name or symbol.
 *
 * If the name is a dot-separated string (e.g., "foo.bar.baz"), this function traverses
 * the global object (`globalThis`) following the path specified by the segments.
 * If any segment does not exist, it returns `undefined`.
 * Otherwise, it returns the value at the specified path.
 *
 * If the name is a symbol or a string without dots, it retrieves the value from the `globals` object.
 *
 * @typeParam T - The expected type of the returned value.
 * @param name - The name or symbol of the global value to retrieve. Dot-separated strings are treated as paths.
 * @returns The value associated with the given name or symbol, or `undefined` if not found.
 */
// deno-lint-ignore no-explicit-any
export declare function getGlobal<T = any>(name: string | symbol): T | undefined;

/**
 * Sets a global variable on the `globalThis` object. Supports nested property paths using dot notation.
 *
 * If the `name` parameter is a string containing dots (e.g., `"foo.bar.baz"`), the function will
 * traverse or create the nested objects as needed and set the value at the specified path.
 * If the `name` is a string without dots or a symbol, the value is set directly on the `globals` object.
 *
 * @param name - The name of the global variable to set. Can be a string (with optional dot notation for nesting) or a symbol.
 * @param value - The value to assign to the global variable.
 */
// deno-lint-ignore no-explicit-any
export declare function setGlobal(name: string | symbol, value: any): void;
