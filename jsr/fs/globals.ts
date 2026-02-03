import { globals, WINDOWS } from "@frostyeti/globals";

export { globals, WINDOWS };

/**
 * @internal
 */
export const WIN = WINDOWS;

export const IS_DENO = typeof globals.Deno !== "undefined";

export function loadFs(): typeof import("node:fs") | undefined {
    if (globals.process && globals.process.getBuiltinModule) {
        return globals.process.getBuiltinModule("node:fs") as typeof import("node:fs");
    } else if (globals.Bun && typeof require !== "undefined") {
        try {
            return require("node:fs") as typeof import("node:fs");
        } catch (_) {
            // Ignore error
        }
    }

    return undefined;
}

export function getNodeFs() {
    // deno-lint-ignore no-explicit-any
    return (globals as any).process.getBuiltinModule("node:fs");
}

export function loadFsAsync(): typeof import("node:fs/promises") | undefined {
    if (globals.process && globals.process.getBuiltinModule) {
        return globals.process.getBuiltinModule(
            "node:fs/promises",
        ) as typeof import("node:fs/promises");
    } else if (globals.Bun && typeof require !== "undefined") {
        try {
            return require("node:fs/promises") as typeof import("node:fs/promises");
        } catch (_) {
            // Ignore error
        }
    }

    return undefined;
}
