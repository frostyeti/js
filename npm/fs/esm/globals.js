import { globals, WINDOWS } from "@frostyeti/globals";
export { globals, WINDOWS };
/**
 * @internal
 */
export const WIN = WINDOWS;
export function loadFs() {
  if (globals.process && globals.process.getBuiltinModule) {
    return globals.process.getBuiltinModule("node:fs");
  } else if (globals.Bun && typeof require !== "undefined") {
    try {
      return require("node:fs");
    } catch (_) {
      // Ignore error
    }
  }
  return undefined;
}
export function loadFsAsync() {
  if (globals.process && globals.process.getBuiltinModule) {
    return globals.process.getBuiltinModule("node:fs/promises");
  } else if (globals.Bun && typeof require !== "undefined") {
    try {
      return require("node:fs/promises");
    } catch (_) {
      // Ignore error
    }
  }
  return undefined;
}
