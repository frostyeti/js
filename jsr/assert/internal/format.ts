// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.
import { globals } from "./globals.ts";

let f = function (v: unknown): string {
    return `"${String(v).replace(/(?=["\\])/g, "\\")}"`;
};

if (globals.process && !globals.Deno) {
    const importName = "node:util";
    const { inspect } = await import(importName);

    f = function (v: unknown): string {
        return inspect(v, {
            depth: Infinity,
            sorted: true,
            compact: false,
            getters: true,
            maxStringLength: Infinity,
            maxArrayLength: Infinity,
        });
    };
} else if (globals.Deno) {
    f = function (v: unknown): string {
        return globals.Deno.inspect(v, {
            depth: Infinity,
            sorted: true,
            trailingComma: true,
            compact: false,
            iterableLimit: Infinity,
            // getters should be true in assertEquals.
            getters: true,
            strAbbreviateSize: Infinity,
        });
    };
}

/**
 * Converts the input into a string. Objects, Sets and Maps are sorted so as to
 * make tests less flaky.
 *
 * @param v Value to be formatted
 *
 * @returns The formatted string
 *
 * @example Usage
 * ```ts
 * import { format } from "@std/internal/format";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(format({ a: 1, b: 2 }), "{\n  a: 1,\n  b: 2,\n}");
 * assertEquals(format(new Set([1, 2])), "Set(2) {\n  1,\n  2,\n}");
 * assertEquals(format(new Map([[1, 2]])), "Map(1) {\n  1 => 2,\n}");
 * ```
 */
export function format(v: unknown): string {
    return f(v);
}
