// deno-lint-ignore-file no-explicit-any
// @ts-ignore no-explicit-any
export const globals = globalThis;
export const WINDOWS =
  // @ts-ignore no-explicit-any
  (typeof globalThis.Deno !== "undefined" &&
    globalThis.Deno.build.os === "windows") ||
  (typeof globalThis.process !== "undefined" &&
    globalThis.process.platform === "win32");
