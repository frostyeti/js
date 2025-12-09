/**
 * Provides the inspect function for inspecting objects which
 * abstracts over the Deno and NodeJS inspect functions and then
 * falls back to JSON.stringify.
 *
 * @module
 */

import { DENO, globals } from "./globals.ts";

/**
 * The options for the inspect function.
 */
export interface InspectOptions {
    /** Stylize output with ANSI colors.
     *
     * @default {false} */
    colors?: boolean;
    /** Try to fit more than one entry of a collection on the same line.
     *
     * @default {true} */
    compact?: boolean;
    /** Traversal depth for nested objects.
     *
     * @default {4} */
    depth?: number;
    /** The maximum length for an inspection to take up a single line.
     *
     * @default {80} */
    breakLength?: number;
    /** Whether or not to escape sequences.
     *
     * @default {true} */
    escapeSequences?: boolean;
    /** The maximum number of iterable entries to print.
     *
     * @default {100} */
    iterableLimit?: number;
    /** Show a Proxy's target and handler.
     *
     * @default {false} */
    showProxy?: boolean;
    /** Sort Object, Set and Map entries by key.
     *
     * @default {false} */
    sorted?: boolean;
    /** Add a trailing comma for multiline collections.
     *
     * @default {false} */
    trailingComma?: boolean;
    /** Evaluate the result of calling getters.
     *
     * @default {false} */
    getters?: boolean;
    /** Show an object's non-enumerable properties.
     *
     * @default {false} */
    showHidden?: boolean;
    /** The maximum length of a string before it is truncated with an
     * ellipsis. */
    strAbbreviateSize?: number;
}

// deno-lint-ignore no-explicit-any
function getNodeUtil(): any {
    if (globals.process && globals.process.getBuiltinModule) {
        return globals.process.getBuiltinModule("node:util");
    }
    if (globals.Bun) {
        try {
            // @ts-ignore ignore
            const utils = require("node:util");
            return utils;
        } catch (_) {
            console.log("require failed, falling back to JSON.stringify");
            // ignore
        }
    }

    return {
        // deno-lint-ignore no-unused-vars
        inspect: (value: unknown, options?: InspectOptions): string => {
            console.log("NodeJS environment detected, using JSON.stringify");
            return JSON.stringify(value, null, 2);
        },
    };
}

/**
 * Returns a string representation of the given value.
 *
 * @description
 * When inspect is called in a browser environment, it will return a JSON.stringify
 * representation of the value. In a NodeJS like environment, it will return a string
 * representation of the value using the util.inspect function. In a Deno environment,
 * it will return a string representation of the value using the Deno.inspect function.
 *
 * @param value The value to inspect.
 * @param options The options for the function.
 * @returns A string representation of the given value.
 */
export function inspect(value: unknown, options?: InspectOptions): string {
    options ??= {};
    if (DENO) {
        return globals.Deno.inspect(value, options);
    }
    if (globals.process) {
        let compact: number | boolean = 3;
        if (options.compact === false) {
            compact = false;
        } else if (options.compact === true) {
            compact = true;
        }
        let depth = 4;
        if (options.depth !== undefined) {
            depth = options.depth;
        }

        const o: Record<string, unknown> = {
            colors: options.colors ?? false,
            showHidden: options.showHidden,
            depth: depth,
            breakLength: options.breakLength,
            compact: compact,
            sorted: options.sorted,
            getters: options.getters,
            showProxy: options.showProxy,
            trailingComma: options.trailingComma,
            escapeSequences: options.escapeSequences,
            maxArrayLength: options.iterableLimit,
            maxStringLength: options.strAbbreviateSize,
            numericSeparator: options.escapeSequences,
            customInspect: true,
        };

        return getNodeUtil().inspect(value, o) as string;
    }

    return JSON.stringify(value, null, 2);
}
