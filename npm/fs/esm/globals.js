import { globals, WINDOWS } from "@frostyeti/globals";
export { globals, WINDOWS };
/**
 * @internal
 */
export const WIN = WINDOWS;
export const IS_DENO = typeof globals.Deno !== "undefined";
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
export function getNodeFs() {
  // deno-lint-ignore no-explicit-any
  return globals.process.getBuiltinModule("node:fs");
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
