/**
 * ## Overview
 *
 * Cross-runtime Linux libsecret module that works with
 * Deno, Bun, and Node.js. Each runtime uses its own FFI mechanism to
 * call the libsecret-1 and GLib shared libraries directly -- no
 * child processes or native addons required (except `koffi` for Node.js).
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
 * [![JSR](https://jsr.io/badges/@frostyeti/libsecret)](https://jsr.io/@frostyeti/libsecret)
 *
 * ## Installation
 *
 * ```bash
 * # Deno
 * deno add jsr:@frostyeti/libsecret
 *
 * # npm from jsr
 * npx jsr add @frostyeti/libsecret
 *
 * # from npmjs.org (Node.js also needs koffi)
 * npm install @frostyeti/libsecret
 * npm install koffi
 * ```
 *
 * ## Usage
 *
 * ```typescript
 * import { LibSecret } from "@frostyeti/libsecret";
 *
 * // Store a password
 * LibSecret.store({
 *     service: "myapp",
 *     account: "user@example.com",
 *     password: "s3cret",
 * });
 *
 * // Look up a password
 * const pw = LibSecret.lookup({
 *     service: "myapp",
 *     account: "user@example.com",
 * });
 * console.log(pw); // "s3cret"
 *
 * // Search for items
 * const items = LibSecret.search({
 *     service: "myapp",
 *     account: "user@example.com",
 * });
 * for (const item of items) {
 *     console.log(item.label, item.attributes, item.password);
 * }
 *
 * // Clear a password
 * LibSecret.clear({
 *     service: "myapp",
 *     account: "user@example.com",
 * });
 * ```
 *
 * ## Custom Schemas
 *
 * ```typescript
 * import {
 *     LibSecret,
 *     SecretSchemaAttributeType,
 *     SecretSchemaFlags,
 * } from "@frostyeti/libsecret";
 *
 * const schema = {
 *     name: "com.example.myapp.Token",
 *     flags: SecretSchemaFlags.NONE,
 *     attributes: [
 *         { name: "service", type: SecretSchemaAttributeType.STRING },
 *         { name: "account", type: SecretSchemaAttributeType.STRING },
 *         { name: "kind", type: SecretSchemaAttributeType.STRING },
 *     ],
 * };
 *
 * LibSecret.store({
 *     service: "myapp",
 *     account: "user@example.com",
 *     password: "token-value",
 *     schema,
 *     attributes: {
 *         service: "myapp",
 *         account: "user@example.com",
 *         kind: "oauth2",
 *     },
 * });
 * ```
 *
 * ## Permissions
 *
 * - **Deno**: requires `--allow-ffi`.
 * - **Bun**: `bun:ffi` is used automatically.
 * - **Node.js**: requires the `koffi` npm package to be installed.
 * - **All**: requires `libsecret-1.so.0` and `libglib-2.0.so.0` to be
 *   available on the system. Install with:
 *   `sudo apt install libsecret-1-dev` (Debian/Ubuntu) or
 *   `sudo dnf install libsecret-devel` (Fedora/RHEL).
 *
 * ## License
 *
 * [MIT License](./LICENSE.md)
 *
 * @module
 */

export {
    DEFAULT_SCHEMA,
    LibSecret,
    type LookupOptions,
    type SearchOptions,
    setBackend,
    type StoreOptions,
} from "./libsecret.ts";
export {
    type LibSecretBackend,
    type SearchResult,
    SECRET_COLLECTION_DEFAULT,
    SECRET_COLLECTION_SESSION,
    type SecretSchemaAttribute,
    SecretSchemaAttributeType,
    type SecretSchemaDefinition,
    SecretSchemaFlags,
    SecretSearchFlags,
} from "./types.ts";

import { setBackend } from "./libsecret.ts";
import type { LibSecretBackend } from "./types.ts";
import { globals } from "@frostyeti/globals/globals";

// ── Runtime detection & backend auto-loading ────────────────────────────────

async function loadBackend(): Promise<LibSecretBackend> {
    if (globals.Deno !== undefined) {
        const mod = await import("./ffi_deno.ts");
        return mod.backend;
    }

    if (globals.Bun !== undefined) {
        const mod = await import("./ffi_bun.ts");
        return mod.backend;
    }

    // Node.js (or compatible) -- use koffi
    const mod = await import("./ffi_node.ts");
    return mod.backend;
}

const _backendReady = loadBackend().then((b) => setBackend(b)).catch((err) => {
    if (typeof console !== "undefined") {
        console.warn(
            `[libsecret] Failed to load FFI backend: ${err?.message ?? err}`,
        );
    }
});

/**
 * Returns a promise that resolves when the FFI backend has finished loading.
 * You normally don't need to await this unless you are importing this module
 * and immediately calling `LibSecret` methods in the same microtask.
 *
 * ```typescript
 * import { ready, LibSecret } from "@frostyeti/libsecret";
 *
 * await ready();
 * LibSecret.store({
 *     service: "myapp",
 *     account: "user@example.com",
 *     password: "hello",
 * });
 * ```
 */
export function ready(): Promise<void> {
    return _backendReady;
}
