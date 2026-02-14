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
export enum CredType {
    /**
     * A generic credential. Not used by any particular authentication package.
     * Applications define the meaning of the credential.
     */
    GENERIC = 1,
    /**
     * A password credential specific to Microsoft authentication packages
     * (NTLM, Kerberos, Negotiate).
     */
    DOMAIN_PASSWORD = 2,
    /**
     * A certificate credential specific to Microsoft authentication packages.
     */
    DOMAIN_CERTIFICATE = 3,
    /**
     * A password credential for a Windows domain visible to third-party packages.
     */
    DOMAIN_VISIBLE_PASSWORD = 4,
    /**
     * A certificate credential specific to authentication packages in a
     * Generic Security Services (GSS) context.
     */
    GENERIC_CERTIFICATE = 5,
    /**
     * Extended credential for a domain.
     */
    DOMAIN_EXTENDED = 6,
    /**
     * Maximum known credential type value (fence).
     */
    MAXIMUM = 7,
    /**
     * Extended maximum known credential type value.
     */
    MAXIMUM_EX = MAXIMUM + 1000,
}

// ── Credential persistence ──────────────────────────────────────────────────

/**
 * Defines the persistence of a credential.
 * Maps to `CRED_PERSIST_*` constants from `wincred.h`.
 */
export enum CredPersist {
    /**
     * The credential persists only for the life of the current logon session.
     */
    SESSION = 1,
    /**
     * The credential persists for all subsequent logon sessions on this
     * same computer. It is not visible on other computers.
     */
    LOCAL_MACHINE = 2,
    /**
     * The credential persists for all subsequent logon sessions on this
     * same computer and is visible on other computers in the same domain.
     * This may be downgraded to local machine persistence if the user
     * account does not support roaming.
     */
    ENTERPRISE = 3,
}

// ── Credential flags ────────────────────────────────────────────────────────

/**
 * Flags for credential write operations.
 */
export enum CredWriteFlags {
    /** Default, no special behavior. */
    NONE = 0,
    /**
     * Preserve the existing credential blob when updating a credential.
     * The `CredentialBlobSize` of the passed credential must be zero.
     */
    PRESERVE_CREDENTIAL_BLOB = 1,
}

/**
 * Flags for credential enumeration.
 */
export enum CredEnumerateFlags {
    /** Default, filter by target name prefix. */
    NONE = 0,
    /**
     * Enumerate all credentials, returning target names in
     * `"namespace:attribute=target"` format.
     */
    ALL_CREDENTIALS = 1,
}

// ── Public data types ───────────────────────────────────────────────────────

/**
 * Represents a single credential as exposed to consumers.
 */
export interface Credential {
    /** Target name (unique identifier together with type). */
    targetName: string;
    /** Type of credential. */
    type: CredType;
    /** Comment associated with the credential. */
    comment: string;
    /** The secret data (password, token, etc.) as raw bytes. */
    credentialBlob: Uint8Array;
    /** Persistence scope. */
    persist: CredPersist;
    /** Target alias. */
    targetAlias: string;
    /** User name. */
    userName: string;
    /** Last written timestamp (Windows FILETIME, 100-ns intervals since 1601-01-01). */
    lastWritten: bigint;
    /** Credential flags. */
    flags: number;
    /** Attribute count (informational). */
    attributeCount: number;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Converts a JavaScript string to a null-terminated UTF-16 LE `Uint8Array`.
 * @internal
 */
export function stringToWide(str: string): Uint8Array {
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
export function wideToString(buffer: Uint8Array, byteLength?: number): string {
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

// ── Backend interface ───────────────────────────────────────────────────────

/**
 * A raw credential structure as returned by the FFI backend, using
 * only primitives / byte arrays so it is runtime-agnostic.
 * @internal
 */
export interface RawCredential {
    flags: number;
    type: number;
    targetName: string;
    comment: string;
    lastWritten: bigint;
    credentialBlobSize: number;
    credentialBlob: Uint8Array;
    persist: number;
    attributeCount: number;
    targetAlias: string;
    userName: string;
}

/**
 * The interface that each FFI backend must implement.
 * @internal
 */
export interface CredentialBackend {
    /**
     * Write (create or update) a credential.
     * @param cred The credential to write.
     * @param flags Write flags.
     */
    write(cred: RawCredential, flags: number): void;

    /**
     * Read a single credential by target name and type.
     * @returns The credential, or `null` if not found.
     */
    read(targetName: string, type: number): RawCredential | null;

    /**
     * Delete a credential by target name and type.
     * @returns `true` if deleted, `false` if not found.
     */
    delete(targetName: string, type: number): boolean;

    /**
     * Enumerate credentials, optionally filtering by target name prefix.
     * @param filter A prefix filter (e.g. `"myapp/*"`), or `null` for all.
     * @param flags Enumeration flags.
     * @returns An array of credentials.
     */
    enumerate(filter: string | null, flags: number): RawCredential[];
}
