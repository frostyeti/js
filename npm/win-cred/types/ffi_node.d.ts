/**
 * Node.js FFI backend for Windows Credential Management using Koffi.
 *
 * Uses `koffi` (npm package) to bind to advapi32.dll (Unicode variants).
 * Koffi must be installed as a dependency: `npm install koffi`.
 *
 * @module
 * @internal
 */
import type { CredentialBackend } from "./types.js";
export declare const backend: CredentialBackend;
