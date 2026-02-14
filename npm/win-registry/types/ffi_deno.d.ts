/**
 * Deno FFI backend for Windows Registry operations.
 *
 * Uses `Deno.dlopen` to bind to advapi32.dll (the W / Unicode variants).
 * @module
 * @internal
 */
import type { RegistryBackend } from "./types.js";
export declare const backend: RegistryBackend;
