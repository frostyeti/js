import { globals } from "@frostyeti/globals";
export { BROWSER, globals, WINDOWS } from "@frostyeti/globals";
export function loadChildProcess() {
  if (globals.process && globals.process.getBuiltinModule) {
    return globals.process.getBuiltinModule("node:child_process");
  } else if (globals.Bun && typeof require !== "undefined") {
    try {
      return require("node:child_process");
    } catch (_) {
      // Ignore error
    }
  }
  return undefined;
}
