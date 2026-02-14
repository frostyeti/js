/**
 * ## Overview
 *
 * Cross-runtime Windows OS release detection module that works with
 * Deno, Bun, and Node.js. Determines if the system is a workstation,
 * server, or domain controller, and provides detailed version and
 * edition information.
 *
 * | Runtime | FFI mechanism |
 * | ------- | ----------------------------- |
 * | Deno | `Deno.dlopen` (built-in FFI) |
 * | Bun | `bun:ffi` `dlopen` |
 * | Node.js | `koffi` (npm package) |
 *
 * ### Win32 APIs used
 *
 * | DLL | Function | Purpose |
 * | --- | -------- | ------- |
 * | ntdll.dll | `RtlGetVersion` | True OS version (unaffected by manifesting) |
 * | kernel32.dll | `GetProductInfo` | Product edition (Home, Pro, Enterprise, Server, etc.) |
 * | netapi32.dll | `DsRoleGetPrimaryDomainInformation` | Machine role & domain membership |
 *
 * ![logo](https://raw.githubusercontent.com/frostyeti/js/refs/heads/master/eng/assets/logo.png)
 *
 * [![JSR](https://jsr.io/badges/@frostyeti/win-os-release)](https://jsr.io/@frostyeti/win-os-release)
 *
 * ## Installation
 *
 * ```bash
 * # Deno
 * deno add jsr:@frostyeti/win-os-release
 *
 * # npm from jsr
 * npx jsr add @frostyeti/win-os-release
 *
 * # from npmjs.org (Node.js also needs koffi)
 * npm install @frostyeti/win-os-release
 * npm install koffi
 * ```
 *
 * ## Usage
 *
 * ```typescript
 * import { WinOsRelease } from "@frostyeti/win-os-release";
 *
 * // Get the full OS release info
 * const info = WinOsRelease.getOsRelease();
 * console.log(info.displayName);        // "Windows 11 Pro"
 * console.log(info.isServer);           // false
 * console.log(info.isDomainController); // false
 * console.log(info.isWorkstation);      // true
 * console.log(info.version.buildNumber); // 22631
 *
 * // Quick checks
 * console.log(WinOsRelease.isServer());           // false
 * console.log(WinOsRelease.isDomainController());  // false
 * console.log(WinOsRelease.isDomainJoined());      // true/false
 *
 * // Raw version info
 * const ver = WinOsRelease.getVersion();
 * console.log(ver.majorVersion, ver.minorVersion, ver.buildNumber);
 *
 * // Domain info
 * const domain = WinOsRelease.getDomainInfo();
 * console.log(domain.machineRole, domain.domainNameFlat);
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

export { setBackend, WinOsRelease } from "./os_release.ts";
export {
    type DomainInfo,
    MachineRole,
    type OsRelease,
    type OsReleaseLike,
    type OsReleaseBackend,
    type OsVersionInfo,
    ProductEdition,
    ProductType,
    SuiteMask,
} from "./types.ts";

import { setBackend } from "./os_release.ts";
import type { OsReleaseBackend } from "./types.ts";

// ── Runtime detection & backend auto-loading ────────────────────────────────

// deno-lint-ignore no-explicit-any
const g = globalThis as any;

async function loadBackend(): Promise<OsReleaseBackend> {
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
            `[win-os-release] Failed to load FFI backend: ${err?.message ?? err}`,
        );
    }
});

/**
 * Returns a promise that resolves when the FFI backend has finished loading.
 *
 * ```typescript
 * import { ready, WinOsRelease } from "@frostyeti/win-os-release";
 *
 * await ready();
 * console.log(WinOsRelease.isServer());
 * ```
 */
export function ready(): Promise<void> {
    return _backendReady;
}
