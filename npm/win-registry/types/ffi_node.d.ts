/**
 * Node.js FFI backend for Windows Registry operations using Koffi.
 *
 * Uses `koffi` (npm package) to bind to advapi32.dll (the W / Unicode variants).
 * Koffi must be installed as a dependency: `npm install koffi`.
 *
 * @module
 * @internal
 */
import type { RegistryBackend } from "./types.js";
export declare const backend: RegistryBackend;
