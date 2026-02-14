import {
  CredEnumerateFlags,
  CredPersist,
  CredType,
  CredWriteFlags,
} from "./types.js";
import { globals } from "@frostyeti/globals/globals";
import process from "node:process";
const { createRequire } = process.getBuiltinModule("node:module");
const require = createRequire(import.meta.url);
let _backend;
if (globals.Bun !== undefined) {
  // For Bun, we can load the backend immediately since it doesn't require dynamic imports or async initialization.
  const file = "./ffi_bun.js";
  const { backend } = require(file);
  _backend = backend;
} else if (globals.Deno !== undefined) {
  // For Deno, we can also load the backend immediately since it supports top-level await and dynamic imports.
  const { backend } = require("./ffi_deno.ts");
  _backend = backend;
} else {
  const file = "./ffi_node.js";
  const { backend } = require(file);
  _backend = backend;
}
function rawToCredential(raw) {
  return {
    targetName: raw.targetName,
    type: raw.type,
    comment: raw.comment,
    credentialBlob: raw.credentialBlob,
    persist: raw.persist,
    targetAlias: raw.targetAlias,
    userName: raw.userName,
    lastWritten: raw.lastWritten,
    flags: raw.flags,
    attributeCount: raw.attributeCount,
  };
}
// ── Convenience: encode / decode secret strings ─────────────────────────────
/**
 * Encode a string secret to a `Uint8Array` suitable for `credentialBlob`.
 * Uses UTF-16 LE encoding to match typical Windows credential conventions.
 */
export function encodeSecret(secret) {
  // Windows typically stores credential blobs as raw UTF-16 LE
  const buf = new Uint8Array(secret.length * 2);
  for (let i = 0; i < secret.length; i++) {
    const code = secret.charCodeAt(i);
    buf[i * 2] = code & 0xff;
    buf[i * 2 + 1] = (code >> 8) & 0xff;
  }
  return buf;
}
/**
 * Decode a `credentialBlob` that was stored as a UTF-16 LE string.
 */
export function decodeSecret(blob) {
  // @ts-ignore - utf-16le is valid but not in older TypeScript lib definitions
  const decoder = new TextDecoder("utf-16le");
  return decoder.decode(blob);
}
/**
 * The static `WinCred` class is the primary entry point for working with
 * Windows Credential Manager.
 */
export class WinCred {
  /**
   * Write (create or update) a credential.
   *
   * @example
   * ```typescript
   * WinCred.write({
   *     targetName: "myapp/api-token",
   *     secret: "supersecret",
   *     userName: "myuser",
   * });
   * ```
   */
  static write(options) {
    const blob = typeof options.secret === "string"
      ? encodeSecret(options.secret)
      : options.secret;
    const raw = {
      flags: 0,
      type: options.type ?? CredType.GENERIC,
      targetName: options.targetName,
      comment: options.comment ?? "",
      lastWritten: 0n, // ignored on write
      credentialBlobSize: blob.length,
      credentialBlob: blob,
      persist: options.persist ?? CredPersist.LOCAL_MACHINE,
      attributeCount: 0,
      targetAlias: "",
      userName: options.userName ?? "",
    };
    _backend.write(raw, options.flags ?? CredWriteFlags.NONE);
  }
  /**
   * Read a credential by target name.
   *
   * @param targetName The target name of the credential to read.
   * @param type The credential type. Defaults to `CredType.GENERIC`.
   * @returns The credential, or `null` if not found.
   *
   * @example
   * ```typescript
   * const cred = WinCred.read("myapp/api-token");
   * if (cred) {
   *     console.log(decodeSecret(cred.credentialBlob));
   * }
   * ```
   */
  static read(targetName, type = CredType.GENERIC) {
    const raw = _backend.read(targetName, type);
    return raw ? rawToCredential(raw) : null;
  }
  /**
   * Read a credential and return the secret as a string.
   * Convenience wrapper around {@link read} + {@link decodeSecret}.
   *
   * @param targetName The target name.
   * @param type The credential type. Defaults to `CredType.GENERIC`.
   * @returns The secret string, or `null` if the credential was not found.
   */
  static readSecret(targetName, type = CredType.GENERIC) {
    const cred = WinCred.read(targetName, type);
    if (!cred) {
      return null;
    }
    return decodeSecret(cred.credentialBlob);
  }
  /**
   * Delete a credential.
   *
   * @param targetName The target name of the credential to delete.
   * @param type The credential type. Defaults to `CredType.GENERIC`.
   * @returns `true` if the credential was deleted, `false` if not found.
   */
  static delete(targetName, type = CredType.GENERIC) {
    return _backend.delete(targetName, type);
  }
  /**
   * Enumerate credentials, optionally filtered by target name prefix.
   *
   * @param filter A target name prefix filter (e.g. `"myapp/*"`),
   *               or `null`/`undefined` to return all credentials.
   * @param flags Enumeration flags. Defaults to `CredEnumerateFlags.NONE`.
   * @returns An array of credentials matching the filter.
   *
   * @example
   * ```typescript
   * const creds = WinCred.enumerate("myapp/*");
   * for (const c of creds) {
   *     console.log(c.targetName, c.userName);
   * }
   * ```
   */
  static enumerate(filter, flags = CredEnumerateFlags.NONE) {
    const rawList = _backend.enumerate(filter ?? null, flags);
    return rawList.map(rawToCredential);
  }
}
