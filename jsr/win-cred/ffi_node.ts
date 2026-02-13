/**
 * Node.js FFI backend for Windows Credential Management using Koffi.
 *
 * Uses `koffi` (npm package) to bind to advapi32.dll (Unicode variants).
 * Koffi must be installed as a dependency: `npm install koffi`.
 *
 * @module
 * @internal
 */
import type { CredentialBackend, RawCredential } from "./types.ts";

// ── Load koffi ──────────────────────────────────────────────────────────────

// deno-lint-ignore no-explicit-any
let koffi: any;
try {
    // deno-lint-ignore no-explicit-any
    const g = globalThis as any;
    const req = g.require ?? (g.process?.mainModule?.require);

    if (req) {
        koffi = req("koffi");
    } else {
        // ESM fallback
        // deno-lint-ignore no-explicit-any
        const nodeModule = await (Function('return import("node:module")')() as Promise<any>);
        const createRequire = nodeModule.createRequire ?? nodeModule.default?.createRequire;
        if (createRequire) {
            const require = createRequire(import.meta.url ?? "file:///");
            koffi = require("koffi");
        } else {
            // deno-lint-ignore no-explicit-any
            const mod = await (Function('return import("koffi")')() as Promise<any>);
            koffi = mod.default ?? mod;
        }
    }
} catch {
    throw new Error(
        "The 'koffi' package is required for Node.js credential support. " +
            "Install it with: npm install koffi",
    );
}

// ── Define types and struct ────────────────────────────────────────────────

const CREDENTIAL_ATTRIBUTEW = koffi.opaque("CREDENTIAL_ATTRIBUTEW");

const CREDENTIALW = koffi.struct("CREDENTIALW", {
    Flags: "uint32",
    Type: "uint32",
    TargetName: "char16_t *",
    Comment: "char16_t *",
    LastWrittenLow: "uint32",
    LastWrittenHigh: "uint32",
    CredentialBlobSize: "uint32",
    CredentialBlob: "uint8 *",
    Persist: "uint32",
    AttributeCount: "uint32",
    Attributes: koffi.pointer(CREDENTIAL_ATTRIBUTEW),
    TargetAlias: "char16_t *",
    UserName: "char16_t *",
});

const PCREDENTIALW = koffi.pointer("PCREDENTIALW", CREDENTIALW);

const lib = koffi.load("advapi32.dll");

const CredWriteW = lib.func(
    "int __stdcall CredWriteW(CREDENTIALW *Credential, uint32 Flags)",
);

const CredReadW = lib.func(
    "int __stdcall CredReadW(const char16_t *TargetName, uint32 Type, uint32 Flags, _Out_ PCREDENTIALW *Credential)",
);

const CredDeleteW = lib.func(
    "int __stdcall CredDeleteW(const char16_t *TargetName, uint32 Type, uint32 Flags)",
);

const CredEnumerateW = lib.func(
    "int __stdcall CredEnumerateW(const char16_t *Filter, uint32 Flags, _Out_ uint32 *Count, _Out_ PCREDENTIALW **Credentials)",
);

const CredFree = lib.func(
    "void __stdcall CredFree(void *Buffer)",
);

const k32 = koffi.load("kernel32.dll");
const GetLastError = k32.func("uint32 __stdcall GetLastError()");

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Convert a Koffi CREDENTIALW JS object to our RawCredential.
 */
// deno-lint-ignore no-explicit-any
function toRawCredential(c: any): RawCredential {
    const blobSize: number = c.CredentialBlobSize ?? 0;
    let credentialBlob = new Uint8Array(0);

    if (blobSize > 0 && c.CredentialBlob) {
        // Koffi gives us the blob pointer; decode it
        credentialBlob = koffi.decode(c.CredentialBlob, koffi.array("uint8", blobSize));
    }

    const lastWritten = (BigInt(c.LastWrittenHigh >>> 0) << 32n) |
        BigInt(c.LastWrittenLow >>> 0);

    return {
        flags: c.Flags ?? 0,
        type: c.Type ?? 0,
        targetName: c.TargetName ?? "",
        comment: c.Comment ?? "",
        lastWritten,
        credentialBlobSize: blobSize,
        credentialBlob,
        persist: c.Persist ?? 0,
        attributeCount: c.AttributeCount ?? 0,
        targetAlias: c.TargetAlias ?? "",
        userName: c.UserName ?? "",
    };
}

/**
 * Convert a RawCredential to a Koffi-compatible JS object for CredWriteW.
 */
function toKoffiCredential(cred: RawCredential): Record<string, unknown> {
    const low = Number(cred.lastWritten & 0xFFFFFFFFn);
    const high = Number((cred.lastWritten >> 32n) & 0xFFFFFFFFn);

    return {
        Flags: cred.flags,
        Type: cred.type,
        TargetName: cred.targetName,
        Comment: cred.comment || null,
        LastWrittenLow: low,
        LastWrittenHigh: high,
        CredentialBlobSize: cred.credentialBlob.length,
        CredentialBlob: cred.credentialBlob.length > 0 ? cred.credentialBlob : null,
        Persist: cred.persist,
        AttributeCount: 0,
        Attributes: null,
        TargetAlias: cred.targetAlias || null,
        UserName: cred.userName || null,
    };
}

export const backend: CredentialBackend = {
    write(cred: RawCredential, flags: number): void {
        const kCred = toKoffiCredential(cred);
        const ok = CredWriteW(kCred, flags);
        if (!ok) {
            const err = GetLastError();
            throw new Error(`CredWriteW failed with error code ${err}`);
        }
    },

    read(targetName: string, type: number): RawCredential | null {
        const outArr = [null]; // _Out_ PCREDENTIALW*

        const ok = CredReadW(targetName, type, 0, outArr);
        if (!ok) return null;

        try {
            const credObj = koffi.decode(outArr[0], CREDENTIALW);
            return toRawCredential(credObj);
        } finally {
            if (outArr[0]) {
                CredFree(outArr[0]);
            }
        }
    },

    delete(targetName: string, type: number): boolean {
        const ok = CredDeleteW(targetName, type, 0);
        return !!ok;
    },

    enumerate(filter: string | null, flags: number): RawCredential[] {
        const countArr = [0];
        const credsArr = [null];

        const ok = CredEnumerateW(filter, flags, countArr, credsArr);
        if (!ok) return [];

        const count = countArr[0];
        const results: RawCredential[] = [];

        try {
            // credsArr[0] is a pointer to an array of PCREDENTIALW
            const ptrArray = koffi.decode(
                credsArr[0],
                koffi.array(PCREDENTIALW, count),
            );

            for (let i = 0; i < count; i++) {
                const credObj = koffi.decode(ptrArray[i], CREDENTIALW);
                results.push(toRawCredential(credObj));
            }
        } finally {
            if (credsArr[0]) {
                CredFree(credsArr[0]);
            }
        }

        return results;
    },
};
