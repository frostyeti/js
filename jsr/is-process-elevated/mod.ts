/**
 * ## Overview
 *
 * Determines if the current process is elevated. The function
 * checks if the process is running as root on Linux and macOS. On Windows,
 * the function checks if the process is elevated by Administrator
 * or a privileged account.
 *
 * ## Documentation
 *
 * Documentation is available on [jsr.io](https://jsr.io/@frostyeti/is-process-elevated/doc)
 *
 * ## Usage
 * ```typescript
 * import { isProcessElevated } from "@frostyeti/is-process-elevated";
 *
 * if (!isProcessElevated()) {
 *     throw new Error("This action requires sudo or admin rights");
 * }
 *
 * // Force re-evaluation without using cache
 * const elevated = isProcessElevated(false);
 * ```
 *
 * ## License
 *
 * [MIT License](./LICENSE.md)
 *
 * @module
 */

import { RUNTIME } from "@frostyeti/globals";

// deno-lint-ignore no-unused-vars
let isElevated = function (cache = true): boolean {
    return false;
};

switch (RUNTIME) {
    case "deno":
        isElevated = (await import("./deno.ts")).evalIsProcessElevated;
        break;
    case "node":
        isElevated = (await import("./node.ts")).evalIsProcessElevated;
        break;
    case "bun":
        isElevated = (await import("./bun.ts")).evalIsProcessElevated;
        break;
}

/**
 * Determines if the current process is running with elevated privileges.
 *
 * On **Linux** and **macOS**, this checks if the process is running as root (UID 0).
 *
 * On **Windows**, the behavior varies by runtime:
 * - **Deno** and **Bun**: Uses Windows FFI to query the process token elevation status
 *   via `Advapi32.dll` and `Kernel32.dll`.
 * - **Node.js**: Uses the `net session` command to check for elevated privileges.
 *
 * @param cache - Whether to use the cached result if available. Defaults to `true`.
 *   Set to `false` to force re-evaluation of the elevation status.
 * @returns `true` if the process is running with elevated privileges, `false` otherwise.
 *
 * @throws {Error} On Windows with Deno/Bun, throws if it fails to open the process token
 *   or retrieve token information.
 *
 * @example Check for elevation before performing privileged operation
 * ```typescript
 * import { isProcessElevated } from "@frostyeti/is-process-elevated";
 *
 * if (!isProcessElevated()) {
 *     console.error("Please run this script with sudo or as Administrator");
 *     process.exit(1);
 * }
 *
 * // Perform privileged operation...
 * ```
 *
 * @example Force re-evaluation of elevation status
 * ```typescript
 * import { isProcessElevated } from "@frostyeti/is-process-elevated";
 *
 * // First call - evaluates and caches
 * console.log(isProcessElevated()); // true or false
 *
 * // Subsequent call - uses cache
 * console.log(isProcessElevated()); // same as above
 *
 * // Force re-evaluation
 * console.log(isProcessElevated(false)); // re-checks elevation status
 * ```
 *
 * @example Conditional logic based on elevation
 * ```typescript
 * import { isProcessElevated } from "@frostyeti/is-process-elevated";
 *
 * const elevated = isProcessElevated();
 *
 * if (elevated) {
 *     console.log("Running with admin/root privileges");
 * } else {
 *     console.log("Running as normal user");
 * }
 * ```
 */
export function isProcessElevated(cache = true): boolean {
    return isElevated(cache);
}
