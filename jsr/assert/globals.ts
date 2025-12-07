// deno-lint-ignore-file no-explicit-any
// @ts-ignore no-explicit-any
export const globals: typeof globalThis & Record<string, any> & {
    Deno?: { build: { os: string } };
    // deno-lint-ignore no-process-global
    process?: typeof process;
} = globalThis;

export const WINDOWS =
    (typeof globalThis.Deno !== "undefined" && globalThis.Deno.build.os === "windows") ||
    (typeof globalThis.process !== "undefined" && globalThis.process.platform === "win32");
