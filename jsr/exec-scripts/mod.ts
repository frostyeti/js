/**
 * @module
 * Convenience wrappers for creating {@link Command} instances that execute
 * common script runtimes/shells (bash, sh, node, deno, bun, python, ruby, go,
 * dotnet, powershell).
 *
 * Each exported function (for example `node()` or `bash()`) creates a command
 * for invoking that runtime directly.
 *
 * Most functions also expose a `.script(script, options)` helper that builds
 * a command which executes either:
 * - a script file (auto-detected by extension), or
 * - inline/eval code (when `options.isFile` is false or auto-detection fails).
 */
export * from "./bash.ts";
export * from "./bun.ts";
export * from "./deno.ts";
export * from "./dotnet.ts";
export * from "./go.ts";
export * from "./node.ts";
export * from "./powershell.ts";
export * from "./pwsh.ts";
export * from "./python.ts";
export * from "./ruby.ts";
export * from "./sh.ts";
