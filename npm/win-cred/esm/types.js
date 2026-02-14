/**
 * Shared types, enums, constants and backend interface for the
 * Windows Credential Management module.
 *
 * All Win32 constants are sourced from `wincred.h`.
 * @module
 */
// ── Credential type ─────────────────────────────────────────────────────────
/**
 * The type of credential.
 * Maps directly to the `CRED_TYPE_*` constants from `wincred.h`.
 */
export var CredType;
(function (CredType) {
  /**
   * A generic credential. Not used by any particular authentication package.
   * Applications define the meaning of the credential.
   */
  CredType[CredType["GENERIC"] = 1] = "GENERIC";
  /**
   * A password credential specific to Microsoft authentication packages
   * (NTLM, Kerberos, Negotiate).
   */
  CredType[CredType["DOMAIN_PASSWORD"] = 2] = "DOMAIN_PASSWORD";
  /**
   * A certificate credential specific to Microsoft authentication packages.
   */
  CredType[CredType["DOMAIN_CERTIFICATE"] = 3] = "DOMAIN_CERTIFICATE";
  /**
   * A password credential for a Windows domain visible to third-party packages.
   */
  CredType[CredType["DOMAIN_VISIBLE_PASSWORD"] = 4] = "DOMAIN_VISIBLE_PASSWORD";
  /**
   * A certificate credential specific to authentication packages in a
   * Generic Security Services (GSS) context.
   */
  CredType[CredType["GENERIC_CERTIFICATE"] = 5] = "GENERIC_CERTIFICATE";
  /**
   * Extended credential for a domain.
   */
  CredType[CredType["DOMAIN_EXTENDED"] = 6] = "DOMAIN_EXTENDED";
  /**
   * Maximum known credential type value (fence).
   */
  CredType[CredType["MAXIMUM"] = 7] = "MAXIMUM";
  /**
   * Extended maximum known credential type value.
   */
  CredType[CredType["MAXIMUM_EX"] = 1007] = "MAXIMUM_EX";
})(CredType || (CredType = {}));
// ── Credential persistence ──────────────────────────────────────────────────
/**
 * Defines the persistence of a credential.
 * Maps to `CRED_PERSIST_*` constants from `wincred.h`.
 */
export var CredPersist;
(function (CredPersist) {
  /**
   * The credential persists only for the life of the current logon session.
   */
  CredPersist[CredPersist["SESSION"] = 1] = "SESSION";
  /**
   * The credential persists for all subsequent logon sessions on this
   * same computer. It is not visible on other computers.
   */
  CredPersist[CredPersist["LOCAL_MACHINE"] = 2] = "LOCAL_MACHINE";
  /**
   * The credential persists for all subsequent logon sessions on this
   * same computer and is visible on other computers in the same domain.
   * This may be downgraded to local machine persistence if the user
   * account does not support roaming.
   */
  CredPersist[CredPersist["ENTERPRISE"] = 3] = "ENTERPRISE";
})(CredPersist || (CredPersist = {}));
// ── Credential flags ────────────────────────────────────────────────────────
/**
 * Flags for credential write operations.
 */
export var CredWriteFlags;
(function (CredWriteFlags) {
  /** Default, no special behavior. */
  CredWriteFlags[CredWriteFlags["NONE"] = 0] = "NONE";
  /**
   * Preserve the existing credential blob when updating a credential.
   * The `CredentialBlobSize` of the passed credential must be zero.
   */
  CredWriteFlags[CredWriteFlags["PRESERVE_CREDENTIAL_BLOB"] = 1] =
    "PRESERVE_CREDENTIAL_BLOB";
})(CredWriteFlags || (CredWriteFlags = {}));
/**
 * Flags for credential enumeration.
 */
export var CredEnumerateFlags;
(function (CredEnumerateFlags) {
  /** Default, filter by target name prefix. */
  CredEnumerateFlags[CredEnumerateFlags["NONE"] = 0] = "NONE";
  /**
   * Enumerate all credentials, returning target names in
   * `"namespace:attribute=target"` format.
   */
  CredEnumerateFlags[CredEnumerateFlags["ALL_CREDENTIALS"] = 1] =
    "ALL_CREDENTIALS";
})(CredEnumerateFlags || (CredEnumerateFlags = {}));
// ── Helpers ─────────────────────────────────────────────────────────────────
/**
 * Converts a JavaScript string to a null-terminated UTF-16 LE `Uint8Array`.
 * @internal
 */
export function stringToWide(str) {
  const buf = new Uint8Array((str.length + 1) * 2);
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    buf[i * 2] = code & 0xff;
    buf[i * 2 + 1] = (code >> 8) & 0xff;
  }
  return buf;
}
/**
 * Converts a UTF-16 LE buffer to a JavaScript string.
 * Stops at the first null terminator or the end of the buffer.
 * @internal
 */
export function wideToString(buffer, byteLength) {
  const len = byteLength ?? buffer.length;
  // @ts-ignore - utf-16le is valid but not in older TypeScript lib definitions
  const decoder = new TextDecoder("utf-16le");
  let end = len;
  for (let i = 0; i < len - 1; i += 2) {
    if (buffer[i] === 0 && buffer[i + 1] === 0) {
      end = i;
      break;
    }
  }
  return decoder.decode(buffer.subarray(0, end));
}
