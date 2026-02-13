/**
 * Bun FFI backend for Windows Credential Management.
 *
 * Uses `bun:ffi` `dlopen` to bind to advapi32.dll (Unicode variants).
 * @module
 * @internal
 */
import type { CredentialBackend, RawCredential } from "./types.ts";
import { stringToWide } from "./types.ts";

// Dynamic import hidden from static analysis so Deno/Node don't choke on "bun:ffi".
// deno-lint-ignore no-explicit-any
const bunFfi: any = await (Function('return import("bun:ffi")')() as Promise<unknown>);

const { dlopen, ptr: ptrFn, read: ffiRead, toArrayBuffer } = bunFfi;

const lib = dlopen("advapi32.dll", {
    CredWriteW: {
        args: ["ptr", "u32"],
        returns: "i32",
    },
    CredReadW: {
        args: ["ptr", "u32", "u32", "ptr"],
        returns: "i32",
    },
    CredDeleteW: {
        args: ["ptr", "u32", "u32"],
        returns: "i32",
    },
    CredEnumerateW: {
        args: ["ptr", "u32", "ptr", "ptr"],
        returns: "i32",
    },
    CredFree: {
        args: ["ptr"],
        returns: "void",
    },
});

const k32 = dlopen("kernel32.dll", {
    GetLastError: {
        args: [],
        returns: "u32",
    },
});

const { symbols } = lib;
const k32s = k32.symbols;

// ── Struct layout (x64) ────────────────────────────────────────────────────

const SIZEOF_CREDENTIALW = 80;
const OFF_FLAGS = 0;
const OFF_TYPE = 4;
const OFF_TARGET_NAME = 8;
const OFF_COMMENT = 16;
const OFF_LAST_WRITTEN = 24;
const OFF_BLOB_SIZE = 32;
const OFF_BLOB = 40;
const OFF_PERSIST = 48;
const OFF_ATTR_COUNT = 52;
const OFF_TARGET_ALIAS = 64;
const OFF_USER_NAME = 72;

function bufPtr(buf: Uint8Array): unknown {
    return ptrFn(buf);
}

/** Read a null-terminated UTF-16LE string from a native pointer. */
function readWideString(ptr: number): string {
    if (ptr === 0) return "";
    const chars: number[] = [];
    for (let i = 0; ; i += 2) {
        const lo: number = ffiRead.u8(ptr + i);
        const hi: number = ffiRead.u8(ptr + i + 1);
        if (lo === 0 && hi === 0) break;
        chars.push(lo | (hi << 8));
    }
    return String.fromCharCode(...chars);
}

/** Read raw bytes from a pointer. */
function readBytes(ptr: number, length: number): Uint8Array {
    if (ptr === 0 || length === 0) return new Uint8Array(0);
    const ab = toArrayBuffer(ptr, 0, length);
    return new Uint8Array(ab);
}

function readU32At(ptr: number, offset: number): number {
    return ffiRead.u32(ptr + offset);
}

function readPtrAt(ptr: number, offset: number): number {
    // Read a 64-bit pointer as a number. Bun's read.ptr returns a number.
    return Number(ffiRead.ptr(ptr + offset));
}

function readU64At(ptr: number, offset: number): bigint {
    return ffiRead.u64(ptr + offset);
}

/** Parse a CREDENTIALW from a pointer value. */
function parseCredential(credPtr: number): RawCredential {
    const blobSize = readU32At(credPtr, OFF_BLOB_SIZE);
    const blobPtr = readPtrAt(credPtr, OFF_BLOB);

    return {
        flags: readU32At(credPtr, OFF_FLAGS),
        type: readU32At(credPtr, OFF_TYPE),
        targetName: readWideString(readPtrAt(credPtr, OFF_TARGET_NAME)),
        comment: readWideString(readPtrAt(credPtr, OFF_COMMENT)),
        lastWritten: readU64At(credPtr, OFF_LAST_WRITTEN),
        credentialBlobSize: blobSize,
        credentialBlob: readBytes(blobPtr, blobSize),
        persist: readU32At(credPtr, OFF_PERSIST),
        attributeCount: readU32At(credPtr, OFF_ATTR_COUNT),
        targetAlias: readWideString(readPtrAt(credPtr, OFF_TARGET_ALIAS)),
        userName: readWideString(readPtrAt(credPtr, OFF_USER_NAME)),
    };
}

/**
 * Build a CREDENTIALW struct for CredWriteW.
 * Returns the struct buffer and an array of refs that must be kept alive.
 */
function buildCredentialBuffer(
    cred: RawCredential,
): { structBuf: Uint8Array; refs: Uint8Array[] } {
    const refs: Uint8Array[] = [];
    const buf = new Uint8Array(SIZEOF_CREDENTIALW);
    const view = new DataView(buf.buffer);

    view.setUint32(OFF_FLAGS, cred.flags, true);
    view.setUint32(OFF_TYPE, cred.type, true);

    const wTarget = stringToWide(cred.targetName);
    refs.push(wTarget);
    view.setBigUint64(OFF_TARGET_NAME, BigInt(ptrFn(wTarget)), true);

    const wComment = stringToWide(cred.comment);
    refs.push(wComment);
    view.setBigUint64(OFF_COMMENT, BigInt(ptrFn(wComment)), true);

    view.setBigUint64(OFF_LAST_WRITTEN, cred.lastWritten, true);
    view.setUint32(OFF_BLOB_SIZE, cred.credentialBlob.length, true);

    const blob = cred.credentialBlob;
    refs.push(blob);
    if (blob.length > 0) {
        view.setBigUint64(OFF_BLOB, BigInt(ptrFn(blob)), true);
    }

    view.setUint32(OFF_PERSIST, cred.persist, true);
    view.setUint32(OFF_ATTR_COUNT, 0, true);

    const wAlias = stringToWide(cred.targetAlias);
    refs.push(wAlias);
    if (cred.targetAlias) {
        view.setBigUint64(OFF_TARGET_ALIAS, BigInt(ptrFn(wAlias)), true);
    }

    const wUser = stringToWide(cred.userName);
    refs.push(wUser);
    if (cred.userName) {
        view.setBigUint64(OFF_USER_NAME, BigInt(ptrFn(wUser)), true);
    }

    return { structBuf: buf, refs };
}

export const backend: CredentialBackend = {
    write(cred: RawCredential, flags: number): void {
        const { structBuf, refs: _refs } = buildCredentialBuffer(cred);
        const ok = symbols.CredWriteW(bufPtr(structBuf), flags);
        if (!ok) {
            const err = k32s.GetLastError();
            throw new Error(`CredWriteW failed with error code ${err}`);
        }
    },

    read(targetName: string, type: number): RawCredential | null {
        const wTarget = stringToWide(targetName);
        const outBuf = new Uint8Array(8);

        const ok = symbols.CredReadW(bufPtr(wTarget), type, 0, bufPtr(outBuf));
        if (!ok) return null;

        const outView = new DataView(outBuf.buffer);
        const credPtr = Number(outView.getBigUint64(0, true));

        try {
            return parseCredential(credPtr);
        } finally {
            symbols.CredFree(credPtr);
        }
    },

    delete(targetName: string, type: number): boolean {
        const wTarget = stringToWide(targetName);
        const ok = symbols.CredDeleteW(bufPtr(wTarget), type, 0);
        return !!ok;
    },

    enumerate(filter: string | null, flags: number): RawCredential[] {
        const countBuf = new Uint8Array(4);
        const credsBuf = new Uint8Array(8);

        let filterArg: unknown = null;
        let wFilter: Uint8Array | null = null;
        if (filter !== null) {
            wFilter = stringToWide(filter);
            filterArg = bufPtr(wFilter);
        }

        const ok = symbols.CredEnumerateW(
            filterArg,
            flags,
            bufPtr(countBuf),
            bufPtr(credsBuf),
        );

        if (!ok) return [];

        const count = new DataView(countBuf.buffer).getUint32(0, true);
        const arrayPtr = Number(new DataView(credsBuf.buffer).getBigUint64(0, true));

        const results: RawCredential[] = [];
        try {
            for (let i = 0; i < count; i++) {
                const credPtr = Number(ffiRead.ptr(arrayPtr + i * 8));
                results.push(parseCredential(credPtr));
            }
        } finally {
            symbols.CredFree(arrayPtr);
        }

        return results;
    },
};
