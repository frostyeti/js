import { globals } from "@frostyeti/globals";
export { BROWSER, globals, WINDOWS } from "@frostyeti/globals";

export function loadChildProcess(): typeof import("node:child_process") | undefined {
    if (globals.process && globals.process.getBuiltinModule) {
        return globals.process.getBuiltinModule(
            "node:child_process",
        ) as typeof import("node:child_process");
    } else if (globals.Bun && typeof require !== "undefined") {
        try {
            return require("node:child_process") as typeof import("node:child_process");
        } catch (_) {
            // Ignore error
        }
    }

    return undefined;
}
