/**
 * Bun FFI backend for Windows Credential Management.
 *
 * Uses `bun:ffi` `dlopen` to bind to advapi32.dll (Unicode variants).
 * @module
 * @internal
 */
import type { CredentialBackend } from "./types.js";
export declare const backend: CredentialBackend;
