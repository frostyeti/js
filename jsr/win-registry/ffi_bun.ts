/**
 * Bun FFI backend for Windows Registry operations.
 *
 * Uses `bun:ffi` `dlopen` to bind to advapi32.dll (the W / Unicode variants).
 * @module
 * @internal
 */
import type { RegistryBackend } from "./types.ts";
import {
    ERROR_MORE_DATA,
    ERROR_NO_MORE_ITEMS,
    ERROR_SUCCESS,
    stringToWide,
    wideToString,
} from "./types.ts";

// Dynamic import hidden from static analysis so Deno/Node don't choke on "bun:ffi".
// deno-lint-ignore no-explicit-any
const bunFfi: any = await (Function('return import("bun:ffi")')() as Promise<unknown>);

const { dlopen, ptr: ptrFn } = bunFfi;

const lib = dlopen("advapi32.dll", {
    RegOpenKeyExW: {
        args: ["ptr", "ptr", "u32", "u32", "ptr"],
        returns: "i32",
    },
    RegCreateKeyExW: {
        args: [
            "ptr", // hKey
            "ptr", // lpSubKey
            "u32", // Reserved
            "ptr", // lpClass
            "u32", // dwOptions
            "u32", // samDesired
            "ptr", // lpSecurityAttributes
            "ptr", // phkResult
            "ptr", // lpdwDisposition
        ],
        returns: "i32",
    },
    RegCloseKey: {
        args: ["ptr"],
        returns: "i32",
    },
    RegDeleteKeyW: {
        args: ["ptr", "ptr"],
        returns: "i32",
    },
    RegDeleteValueW: {
        args: ["ptr", "ptr"],
        returns: "i32",
    },
    RegQueryInfoKeyW: {
        args: [
            "ptr", // hKey
            "ptr", // lpClass
            "ptr", // lpcchClass
            "ptr", // lpReserved
            "ptr", // lpcSubKeys
            "ptr", // lpcbMaxSubKeyLen
            "ptr", // lpcbMaxClassLen
            "ptr", // lpcValues
            "ptr", // lpcbMaxValueNameLen
            "ptr", // lpcbMaxValueLen
            "ptr", // lpcbSecurityDescriptor
            "ptr", // lpftLastWriteTime
        ],
        returns: "i32",
    },
    RegEnumKeyExW: {
        args: [
            "ptr", // hKey
            "u32", // dwIndex
            "ptr", // lpName
            "ptr", // lpcchName
            "ptr", // lpReserved
            "ptr", // lpClass
            "ptr", // lpcchClass
            "ptr", // lpftLastWriteTime
        ],
        returns: "i32",
    },
    RegEnumValueW: {
        args: [
            "ptr", // hKey
            "u32", // dwIndex
            "ptr", // lpValueName
            "ptr", // lpcchValueName
            "ptr", // lpReserved
            "ptr", // lpType
            "ptr", // lpData
            "ptr", // lpcbData
        ],
        returns: "i32",
    },
    RegQueryValueExW: {
        args: [
            "ptr", // hKey
            "ptr", // lpValueName
            "ptr", // lpReserved
            "ptr", // lpType
            "ptr", // lpData
            "ptr", // lpcbData
        ],
        returns: "i32",
    },
    RegSetValueExW: {
        args: [
            "ptr", // hKey
            "ptr", // lpValueName
            "u32", // Reserved
            "u32", // dwType
            "ptr", // lpData
            "u32", // cbData
        ],
        returns: "i32",
    },
});

const { symbols } = lib;

/**
 * In Bun FFI, pointer args accept TypedArrays directly (Bun auto-converts),
 * or number values for raw pointer addresses.
 * Predefined HKEY values like HKEY_LOCAL_MACHINE (0x80000002) are passed as numbers.
 */
function hkeyToPtr(hkey: bigint): number {
    return Number(hkey);
}

function readU32(buf: Uint8Array, offset = 0): number {
    return (
        (buf[offset]) |
        (buf[offset + 1] << 8) |
        (buf[offset + 2] << 16) |
        (buf[offset + 3] << 24)
    ) >>> 0;
}

function writeU32(buf: Uint8Array, value: number, offset = 0): void {
    buf[offset] = value & 0xff;
    buf[offset + 1] = (value >> 8) & 0xff;
    buf[offset + 2] = (value >> 16) & 0xff;
    buf[offset + 3] = (value >> 24) & 0xff;
}

function readU64(buf: Uint8Array, offset = 0): bigint {
    const lo = BigInt(readU32(buf, offset));
    const hi = BigInt(readU32(buf, offset + 4));
    return (hi << 32n) | lo;
}

/** Get a Bun FFI pointer from a Uint8Array. */
function bufPtr(buf: Uint8Array): unknown {
    return ptrFn(buf);
}

export const backend: RegistryBackend = {
    openKey(hkey: bigint, subKey: string, access: number): bigint {
        const wSubKey = stringToWide(subKey);
        const resultBuf = new Uint8Array(8);

        const status = symbols.RegOpenKeyExW(
            hkeyToPtr(hkey),
            bufPtr(wSubKey),
            0,
            access,
            bufPtr(resultBuf),
        );

        if (status !== ERROR_SUCCESS) {
            throw new Error(
                `RegOpenKeyExW failed for "${subKey}" with error code ${status}`,
            );
        }

        return readU64(resultBuf);
    },

    createKey(
        hkey: bigint,
        subKey: string,
        access: number,
    ): { handle: bigint; created: boolean } {
        const wSubKey = stringToWide(subKey);
        const handleBuf = new Uint8Array(8);
        const dispositionBuf = new Uint8Array(4);

        const status = symbols.RegCreateKeyExW(
            hkeyToPtr(hkey),
            bufPtr(wSubKey),
            0,
            null,
            0,
            access,
            null,
            bufPtr(handleBuf),
            bufPtr(dispositionBuf),
        );

        if (status !== ERROR_SUCCESS) {
            throw new Error(
                `RegCreateKeyExW failed for "${subKey}" with error code ${status}`,
            );
        }

        const REG_CREATED_NEW_KEY = 1;
        return {
            handle: readU64(handleBuf),
            created: readU32(dispositionBuf) === REG_CREATED_NEW_KEY,
        };
    },

    closeKey(hkey: bigint): void {
        symbols.RegCloseKey(hkeyToPtr(hkey));
    },

    deleteKey(hkey: bigint, subKey: string): number {
        const wSubKey = stringToWide(subKey);
        return symbols.RegDeleteKeyW(hkeyToPtr(hkey), bufPtr(wSubKey));
    },

    deleteValue(hkey: bigint, valueName: string): number {
        const wName = stringToWide(valueName);
        return symbols.RegDeleteValueW(hkeyToPtr(hkey), bufPtr(wName));
    },

    queryInfoKey(hkey: bigint) {
        const subKeyCountBuf = new Uint8Array(4);
        const maxSubKeyLenBuf = new Uint8Array(4);
        const valueCountBuf = new Uint8Array(4);
        const maxValueNameLenBuf = new Uint8Array(4);
        const maxValueLenBuf = new Uint8Array(4);
        const lastWriteTimeBuf = new Uint8Array(8);

        const status = symbols.RegQueryInfoKeyW(
            hkeyToPtr(hkey),
            null,
            null,
            null,
            bufPtr(subKeyCountBuf),
            bufPtr(maxSubKeyLenBuf),
            null,
            bufPtr(valueCountBuf),
            bufPtr(maxValueNameLenBuf),
            bufPtr(maxValueLenBuf),
            null,
            bufPtr(lastWriteTimeBuf),
        );

        if (status !== ERROR_SUCCESS) {
            throw new Error(
                `RegQueryInfoKeyW failed with error code ${status}`,
            );
        }

        return {
            subKeyCount: readU32(subKeyCountBuf),
            maxSubKeyLength: readU32(maxSubKeyLenBuf),
            valueCount: readU32(valueCountBuf),
            maxValueNameLength: readU32(maxValueNameLenBuf),
            maxValueLength: readU32(maxValueLenBuf),
            lastWriteTime: Number(readU64(lastWriteTimeBuf)),
        };
    },

    enumKeyNames(
        hkey: bigint,
        index: number,
        nameBufferSize: number,
    ): string | null {
        const nameBuf = new Uint8Array((nameBufferSize + 1) * 2);
        const sizeBuf = new Uint8Array(4);
        writeU32(sizeBuf, nameBufferSize + 1);

        const status = symbols.RegEnumKeyExW(
            hkeyToPtr(hkey),
            index,
            bufPtr(nameBuf),
            bufPtr(sizeBuf),
            null,
            null,
            null,
            null,
        );

        if (status === ERROR_NO_MORE_ITEMS) return null;
        if (status !== ERROR_SUCCESS) {
            throw new Error(
                `RegEnumKeyExW failed with error code ${status}`,
            );
        }

        const charCount = readU32(sizeBuf);
        return wideToString(nameBuf, charCount * 2);
    },

    enumValueNames(
        hkey: bigint,
        index: number,
        nameBufferSize: number,
    ): string | null {
        const nameBuf = new Uint8Array((nameBufferSize + 1) * 2);
        const sizeBuf = new Uint8Array(4);
        writeU32(sizeBuf, nameBufferSize + 1);
        const typeBuf = new Uint8Array(4);

        const status = symbols.RegEnumValueW(
            hkeyToPtr(hkey),
            index,
            bufPtr(nameBuf),
            bufPtr(sizeBuf),
            null,
            bufPtr(typeBuf),
            null,
            null,
        );

        if (status === ERROR_NO_MORE_ITEMS) return null;
        if (status !== ERROR_SUCCESS) {
            throw new Error(
                `RegEnumValueW failed with error code ${status}`,
            );
        }

        const charCount = readU32(sizeBuf);
        return wideToString(nameBuf, charCount * 2);
    },

    queryValue(
        hkey: bigint,
        valueName: string,
        buffer: Uint8Array,
    ): { type: number; bytesRead: number } | null {
        const wName = stringToWide(valueName);
        const typeBuf = new Uint8Array(4);
        const sizeBuf = new Uint8Array(4);
        writeU32(sizeBuf, buffer.length);

        let status = symbols.RegQueryValueExW(
            hkeyToPtr(hkey),
            bufPtr(wName),
            null,
            bufPtr(typeBuf),
            bufPtr(buffer),
            bufPtr(sizeBuf),
        );

        if (status === ERROR_MORE_DATA) {
            const needed = readU32(sizeBuf);
            const bigBuf = new Uint8Array(needed);
            writeU32(sizeBuf, needed);

            status = symbols.RegQueryValueExW(
                hkeyToPtr(hkey),
                bufPtr(wName),
                null,
                bufPtr(typeBuf),
                bufPtr(bigBuf),
                bufPtr(sizeBuf),
            );

            if (status !== ERROR_SUCCESS) return null;

            buffer.set(bigBuf.subarray(0, Math.min(buffer.length, needed)));
            return {
                type: readU32(typeBuf),
                bytesRead: needed,
            };
        }

        if (status !== ERROR_SUCCESS) return null;

        return {
            type: readU32(typeBuf),
            bytesRead: readU32(sizeBuf),
        };
    },

    setValue(
        hkey: bigint,
        valueName: string,
        type: number,
        data: Uint8Array,
    ): void {
        const wName = stringToWide(valueName);

        const status = symbols.RegSetValueExW(
            hkeyToPtr(hkey),
            bufPtr(wName),
            0,
            type,
            bufPtr(data),
            data.length,
        );

        if (status !== ERROR_SUCCESS) {
            throw new Error(
                `RegSetValueExW failed with error code ${status}`,
            );
        }
    },
};
