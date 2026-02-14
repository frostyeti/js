/**
 * High-level, runtime-agnostic credential management facade.
 *
 * The `WinCred` class provides static methods for reading, writing,
 * deleting and enumerating Windows credentials.
 *
 * @module
 */
import type { Credential } from "./types.js";
import {
  CredEnumerateFlags,
  CredPersist,
  CredType,
  CredWriteFlags,
} from "./types.js";
/**
 * Encode a string secret to a `Uint8Array` suitable for `credentialBlob`.
 * Uses UTF-16 LE encoding to match typical Windows credential conventions.
 */
export declare function encodeSecret(secret: string): Uint8Array;
/**
 * Decode a `credentialBlob` that was stored as a UTF-16 LE string.
 */
export declare function decodeSecret(blob: Uint8Array): string;
/**
 * Options for writing a credential.
 */
export interface WriteOptions {
  /** Target name (unique key). Required. */
  targetName: string;
  /** The secret data as raw bytes, or a string that will be UTF-16 LE encoded. */
  secret: Uint8Array | string;
  /** Credential type. Defaults to `CredType.GENERIC`. */
  type?: CredType;
  /** Persistence scope. Defaults to `CredPersist.LOCAL_MACHINE`. */
  persist?: CredPersist;
  /** Optional user name. */
  userName?: string;
  /** Optional comment. */
  comment?: string;
  /** Write flags. Defaults to `CredWriteFlags.NONE`. */
  flags?: CredWriteFlags;
}
/**
 * The static `WinCred` class is the primary entry point for working with
 * Windows Credential Manager.
 */
export declare class WinCred {
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
  static write(options: WriteOptions): void;
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
  static read(targetName: string, type?: CredType): Credential | null;
  /**
   * Read a credential and return the secret as a string.
   * Convenience wrapper around {@link read} + {@link decodeSecret}.
   *
   * @param targetName The target name.
   * @param type The credential type. Defaults to `CredType.GENERIC`.
   * @returns The secret string, or `null` if the credential was not found.
   */
  static readSecret(targetName: string, type?: CredType): string | null;
  /**
   * Delete a credential.
   *
   * @param targetName The target name of the credential to delete.
   * @param type The credential type. Defaults to `CredType.GENERIC`.
   * @returns `true` if the credential was deleted, `false` if not found.
   */
  static delete(targetName: string, type?: CredType): boolean;
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
  static enumerate(
    filter?: string | null,
    flags?: CredEnumerateFlags,
  ): Credential[];
}
