/**
 * ## Overview
 *
 * Cross-runtime Windows Registry module that works with Deno, Bun, and
 * Node.js. Each runtime uses its own FFI mechanism to call the Win32
 * advapi32.dll registry functions directly -- no child processes or
 * native addons required (except `koffi` for Node.js).
 *
 * | Runtime | FFI mechanism |
 * | ------- | ----------------------------- |
 * | Deno | `Deno.dlopen` (built-in FFI) |
 * | Bun | `bun:ffi` `dlopen` |
 * | Node.js | `koffi` (npm package) |
 *
 * The correct backend is loaded automatically based on the detected
 * runtime. Only the code for the current runtime is imported.
 *
 * ![logo](https://raw.githubusercontent.com/frostyeti/js/refs/heads/master/eng/assets/logo.png)
 *
 * [![JSR](https://jsr.io/badges/@frostyeti/windows-registry)](https://jsr.io/@frostyeti/windows-registry)
 *
 * ## Installation
 *
 * ```bash
 * # Deno
 * deno add jsr:@frostyeti/windows-registry
 *
 * # npm from jsr
 * npx jsr add @frostyeti/windows-registry
 *
 * # from npmjs.org (Node.js also needs koffi)
 * npm install @frostyeti/windows-registry
 * npm install koffi
 * ```
 *
 * ## Usage
 *
 * ```typescript
 * import { Registry, Rights } from "@frostyeti/windows-registry";
 *
 * // Open a key (full path with hive prefix)
 * using key = Registry.openKey("HKCU\\Software\\MyApp", Rights.READ);
 * console.log(key.getString("Version"));
 * console.log(key.getSubKeyNames());
 *
 * // Create or open a key
 * using newKey = Registry.createKey("HKCU\\Software\\MyApp\\Settings");
 * newKey.setString("Theme", "dark");
 * newKey.setInt32("FontSize", 14);
 *
 * // Use predefined hive handles directly
 * using sub = Registry.HKLM.openKey("SOFTWARE\\Microsoft\\Windows\\CurrentVersion", Rights.READ);
 * console.log(sub.getString("ProgramFilesDir"));
 * ```
 *
 * ## Permissions
 *
 * - **Deno**: requires `--allow-ffi` (FFI is no longer unstable in Deno 2.x).
 * - **Bun**: `bun:ffi` is used automatically.
 * - **Node.js**: requires the `koffi` npm package to be installed.
 *
 * ## License
 *
 * [MIT License](./LICENSE.md)
 *
 * @module
 */

export { Registry, RegistryKey, setBackend } from "./registry.ts";
export {
    type Key,
    type KeyInfo,
    type RegistryBackend,
    Rights,
    Types,
} from "./types.ts";
export {
    HKEY_CLASSES_ROOT,
    HKEY_CURRENT_CONFIG,
    HKEY_CURRENT_USER,
    HKEY_LOCAL_MACHINE,
    HKEY_PERFORMANCE_DATA,
    HKEY_USERS,
} from "./types.ts";

import { setBackend } from "./registry.ts";
import type { RegistryBackend } from "./types.ts";

// ---------------------------------------------------------------------------
// Runtime detection & backend auto-loading
// ---------------------------------------------------------------------------

// deno-lint-ignore no-explicit-any
const g = globalThis as any;

async function loadBackend(): Promise<RegistryBackend> {
    if (g.Deno !== undefined) {
        // Deno runtime
        const mod = await import("./ffi_deno.ts");
        return mod.backend;
    }

    if (g.Bun !== undefined) {
        // Bun runtime
        const mod = await import("./ffi_bun.ts");
        return mod.backend;
    }

    // Node.js (or compatible) -- use koffi
    const mod = await import("./ffi_node.ts");
    return mod.backend;
}

// Eagerly initialise the backend so consumers don't need to await anything
// beyond the initial module import.
const _backendReady = loadBackend().then((b) => setBackend(b)).catch((err) => {
    // If we're not on Windows or a backend fails to load, we log a warning
    // but don't crash module loading. Calls to Registry methods will throw
    // when they try to use the backend.
    if (typeof console !== "undefined") {
        console.warn(
            `[windows-registry] Failed to load FFI backend: ${err?.message ?? err}`,
        );
    }
});

/**
 * Returns a promise that resolves when the FFI backend has finished loading.
 * You normally don't need to await this unless you are importing this module
 * and immediately calling Registry methods in the same microtask.
 *
 * ```typescript
 * import { ready, Registry } from "@frostyeti/windows-registry";
 *
 * await ready();
 * using key = Registry.openKey("HKCU\\Software");
 * ```
 */
export function ready(): Promise<void> {
    return _backendReady;
}
