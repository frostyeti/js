/**
 * ## Overview
 *
 * Cross-runtime Windows Credential Manager module that works with
 * Deno, Bun, and Node.js. Each runtime uses its own FFI mechanism to
 * call the Win32 advapi32.dll credential functions directly -- no
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
 * [![JSR](https://jsr.io/badges/@frostyeti/win-cred)](https://jsr.io/@frostyeti/win-cred)
 *
 * ## Installation
 *
 * ```bash
 * # Deno
 * deno add jsr:@frostyeti/win-cred
 *
 * # npm from jsr
 * npx jsr add @frostyeti/win-cred
 *
 * # from npmjs.org (Node.js also needs koffi)
 * npm install @frostyeti/win-cred
 * npm install koffi
 * ```
 *
 * ## Usage
 *
 * ```typescript
 * import { WinCred, decodeSecret } from "@frostyeti/win-cred";
 *
 * // Write a credential
 * WinCred.write({
 *     targetName: "myapp/api-token",
 *     secret: "my-secret-value",
 *     userName: "myuser",
 * });
 *
 * // Read it back
 * const secret = WinCred.readSecret("myapp/api-token");
 * console.log(secret); // "my-secret-value"
 *
 * // Read full credential object
 * const cred = WinCred.read("myapp/api-token");
 * if (cred) {
 *     console.log(cred.userName);
 *     console.log(decodeSecret(cred.credentialBlob));
 * }
 *
 * // Enumerate credentials
 * const all = WinCred.enumerate("myapp/*");
 * for (const c of all) {
 *     console.log(c.targetName);
 * }
 *
 * // Delete a credential
 * WinCred.delete("myapp/api-token");
 * ```
 *
 * ## Permissions
 *
 * - **Deno**: requires `--allow-ffi`.
 * - **Bun**: `bun:ffi` is used automatically.
 * - **Node.js**: requires the `koffi` npm package to be installed.
 *
 * ## License
 *
 * [MIT License](./LICENSE.md)
 *
 * @module
 */

export {
    decodeSecret,
    encodeSecret,
    setBackend,
    WinCred,
    type WriteOptions,
} from "./credential.ts";
export {
    type Credential,
    type CredentialBackend,
    CredEnumerateFlags,
    CredPersist,
    CredType,
    CredWriteFlags,
    type RawCredential,
} from "./types.ts";

import { setBackend } from "./credential.ts";
import type { CredentialBackend } from "./types.ts";

// ── Runtime detection & backend auto-loading ────────────────────────────────

// deno-lint-ignore no-explicit-any
const g = globalThis as any;

async function loadBackend(): Promise<CredentialBackend> {
    if (g.Deno !== undefined) {
        const mod = await import("./ffi_deno.ts");
        return mod.backend;
    }

    if (g.Bun !== undefined) {
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
            `[win-cred] Failed to load FFI backend: ${err?.message ?? err}`,
        );
    }
});

/**
 * Returns a promise that resolves when the FFI backend has finished loading.
 * You normally don't need to await this unless you are importing this module
 * and immediately calling `WinCred` methods in the same microtask.
 *
 * ```typescript
 * import { ready, WinCred } from "@frostyeti/win-cred";
 *
 * await ready();
 * WinCred.write({ targetName: "test", secret: "hello" });
 * ```
 */
export function ready(): Promise<void> {
    return _backendReady;
}
