/**
 * Node.js FFI backend for Windows OS release detection using Koffi.
 *
 * Uses `koffi` (npm package) to bind to ntdll.dll, kernel32.dll, and netapi32.dll.
 * @module
 * @internal
 */
import type { OsReleaseBackend } from "./types.js";
export declare const backend: OsReleaseBackend;
