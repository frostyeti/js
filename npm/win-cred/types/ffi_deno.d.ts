/**
 * Deno FFI backend for Windows Credential Management.
 *
 * Uses `Deno.dlopen` to bind to advapi32.dll (Unicode variants).
 * @module
 * @internal
 */
import type { CredentialBackend } from "./types.js";
export declare const backend: CredentialBackend;
