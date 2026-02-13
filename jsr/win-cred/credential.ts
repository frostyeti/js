/**
 * High-level, runtime-agnostic credential management facade.
 *
 * The `WinCred` class provides static methods for reading, writing,
 * deleting and enumerating Windows credentials. It delegates to the
 * active {@link CredentialBackend} which is injected via
 * {@link setBackend}.
 *
 * @module
 */
import type {
    Credential,
    CredentialBackend,
    RawCredential,
} from "./types.ts";
import {
    CredEnumerateFlags,
    CredPersist,
    CredType,
    CredWriteFlags,
} from "./types.ts";

let _backend: CredentialBackend | null = null;

/**
 * Set the FFI backend used by `WinCred`.
 * Called automatically by `mod.ts` after runtime detection.
 * @internal
 */
export function setBackend(b: CredentialBackend): void {
    _backend = b;
}

function getBackend(): CredentialBackend {
    if (!_backend) {
        throw new Error(
            "WinCred backend not initialised. Import from " +
                "'@frostyeti/win-cred' (mod.ts) which auto-detects the runtime, " +
                "or call setBackend() manually.",
        );
    }
    return _backend;
}

// ── Internal conversion ─────────────────────────────────────────────────────

function rawToCredential(raw: RawCredential): Credential {
    return {
        targetName: raw.targetName,
        type: raw.type as CredType,
        comment: raw.comment,
        credentialBlob: raw.credentialBlob,
        persist: raw.persist as CredPersist,
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
export function encodeSecret(secret: string): Uint8Array {
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
export function decodeSecret(blob: Uint8Array): string {
    const decoder = new TextDecoder("utf-16le");
    return decoder.decode(blob);
}

// ── Public API ──────────────────────────────────────────────────────────────

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
    static write(options: WriteOptions): void {
        const blob = typeof options.secret === "string"
            ? encodeSecret(options.secret)
            : options.secret;

        const raw: RawCredential = {
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

        getBackend().write(raw, options.flags ?? CredWriteFlags.NONE);
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
    static read(
        targetName: string,
        type: CredType = CredType.GENERIC,
    ): Credential | null {
        const raw = getBackend().read(targetName, type);
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
    static readSecret(
        targetName: string,
        type: CredType = CredType.GENERIC,
    ): string | null {
        const cred = WinCred.read(targetName, type);
        if (!cred) return null;
        return decodeSecret(cred.credentialBlob);
    }

    /**
     * Delete a credential.
     *
     * @param targetName The target name of the credential to delete.
     * @param type The credential type. Defaults to `CredType.GENERIC`.
     * @returns `true` if the credential was deleted, `false` if not found.
     */
    static delete(
        targetName: string,
        type: CredType = CredType.GENERIC,
    ): boolean {
        return getBackend().delete(targetName, type);
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
    static enumerate(
        filter?: string | null,
        flags: CredEnumerateFlags = CredEnumerateFlags.NONE,
    ): Credential[] {
        const rawList = getBackend().enumerate(filter ?? null, flags);
        return rawList.map(rawToCredential);
    }
}
