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
export * from "./bash.js";
export * from "./bun.js";
export * from "./deno.js";
export * from "./dotnet.js";
export * from "./go.js";
export * from "./node.js";
export * from "./powershell.js";
export * from "./pwsh.js";
export * from "./python.js";
export * from "./ruby.js";
export * from "./sh.js";
