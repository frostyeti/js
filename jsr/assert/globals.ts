// deno-lint-ignore no-explicit-any
export const globals: typeof globalThis & Record<string, any> = globalThis;

export const WINDOWS =
    (typeof globalThis.Deno !== "undefined" && globalThis.Deno.build.os === "windows") ||
    (typeof globalThis.process !== "undefined" && globalThis.process.platform === "win32");
