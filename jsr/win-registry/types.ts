/**
 * The Access Rights for the registry key.
 */
export enum Rights {
    /**
     * Full access
     */
    ALL_ACCESS = 0xf003f,
    /**
     * Create a link to the key.
     */
    CREATE_LINK = 0x00020,
    /**
     * Create a subkey.
     */
    CREATE_SUB_KEY = 0x00004,
    /**
     * Enumerate the subkeys.
     */
    ENUMERATE_SUB_KEYS = 0x00008,
    /**
     * Execute a key.
     */
    EXECUTE = 0x20019,
    /**
     * Notify the key.
     */
    NOTIFY = 0x00010,
    /**
     * Query the values from a key.
     */
    QUERY_VALUE = 0x00001,
    /**
     * Read the key.
     */
    READ = 0x20019,
    /**
     * Set value for a key.
     */
    SET_VALUE = 0x00002,
    /**
     * Get access to the 32-bit view of the key.
     */
    WOW64_32KEY = 0x00200,
    /**
     * Get access to the 64-bit view of the key.
     */
    WOW64_64KEY = 0x00100,
    /**
     * Write the key.
     */
    WRITE = 0x20006,
}

/**
 * The value types for the registry key.
 */
export enum Types {
    // Registry value types.
    NONE = 0,
    /**
     * A null-terminated string.
     */
    SZ = 1,
    /**
     * A null-terminated string that contains unexpanded references to environment variables.
     */
    EXPAND_SZ = 2,
    /**
     * Binary data in any form.
     */
    BINARY = 3,
    /**
     * A 32-bit number.
     */
    DWORD = 4,
    /**
     * A 32-bit number in big-endian format.
     */
    DWORD_BIG_ENDIAN = 5,
    /**
     * A symbolic link.
     */
    LINK = 6,
    /**
     * An array of null-terminated strings, terminated by two null characters.
     */
    MULTI_SZ = 7,
    /**
     * A resource list in the resource requirements list.
     */
    RESOURCE_LIST = 8,
    /**
     * A resource descriptor in the resource requirements list.
     */
    FULL_RESOURCE_DESCRIPTOR = 9,
    /**
     * A resource requirements list.
     */
    RESOURCE_REQUIREMENTS_LIST = 10,
    /**
     * A 64-bit number.
     */
    QWORD = 11,
}

/**
 * Information about a registry key.
 */
export interface KeyInfo {
    /**
     * The number of subkeys that the key has.
     */
    subKeyCount: number;
    /**
     * The maximum length of the key's subkey with the longest name, in Unicode characters, not including the terminating zero byte.
     */
    maxSubKeyLength: number;
    /**
     * The number of values that the key has.
     */
    valueCount: number;
    /**
     * The maximum length of the key's value name, in Unicode characters, not including the terminating zero byte.
     */
    maxValueNameLength: number;
    /**
     * The maximum length of the key's values, in bytes.
     */
    maxValueLength: number;
    /**
     * The last write time of the key.
     */
    lastWriteTime?: number;
}

/**
 * Represents a registry key.
 */
export interface Key {
    /**
     * Returns true if the key is null.
     * @returns `true` if the key is null; otherwise, `false`.
     */
    isNull(): boolean;
    /**
     * Returns the underlying handle.
     * @returns The underlying handle.
     */
    unwrap(): unknown;
    /**
     * Gets the path of the key.
     */
    readonly path: string;
    /**
     * Gets a value indicating whether the key was created.
     * @returns `true` if the key was created; otherwise, `false`.
     */
    readonly created: boolean;
    /**
     * Close the key, effectively releasing the handle and disposing the key.
     */
    close(): void;
    /**
     * Dispose the key, effectively releasing the handle and disposing the key.
     */
    [Symbol.dispose](): void;
    /**
     * Open a subkey.
     * @param path The path of the subkey to open.
     * @param access The access rights to open the key with. Defaults to `Rights.ALL_ACCESS`.
     * @returns The opened key.
     */
    openKey(path: string, access?: number): Key;
    /**
     * Create a subkey.
     * @param path The path of the subkey to open.
     * @param access The access rights to open the key with. Defaults to `Rights.ALL_ACCESS`.
     * @returns The created key.
     */
    createKey(path: string, access?: number): Key;
    /**
     * Delete a subkey.
     * @param name The name of the key to delete.
     * @returns `true` if the key was deleted; otherwise, `false`.
     */
    deleteKey(name: string): boolean;
    /**
     * Delete a value.
     * @param name The name of the value to delete.
     * @returns `true` if the value was deleted; otherwise, `false`.
     */
    deleteValue(name: string): boolean;
    /**
     * Get the names of the subkeys.
     * @param n The maximum number of subkey names to retrieve.
     * @remarks If `n` is not specified, all value names are returned.
     * @returns The names of the subkeys.
     */
    getSubKeyNames(n?: number): string[];
    /**
     * Get the names of the values.
     * @param n The maximum number of value names to retrieve.
     * @remarks If `n` is not specified, all value names are returned.
     * @returns The names of the values.
     */
    getValueNames(n?: number): string[];
    /**
     * Gets the raw value as a binary buffer.
     * @param name The name of the value to retrieve.
     * @param buffer The buffer to store the value data.
     * @returns The value data and type.
     */
    getValue(name: string, buffer?: Uint8Array): { data: Uint8Array; type: number };
    /**
     * Gets the value as a string.
     * @param name The name of the value to retrieve.
     * @returns The string value.
     */
    getString(name: string): string;
    /**
     * Gets the value as a string array.
     * @param name The name of the value to retrieve.
     * @returns The string array.
     */
    getMultiString(name: string): string[];
    /**
     * Gets the int32 value, which is often referred to as DWORD in the Windows registry.
     * @param name The name of the value to retrieve.
     * @returns The int32 value.
     */
    getInt32(name: string): number;
    /**
     * Gets the big integer value, which is often referred to as QWORD in the Windows registry or long.
     * @param name The name of the value to retrieve.
     * @returns The big integer value.
     */
    getInt64(name: string): bigint;
    /**
     * Gets binary data.
     * @param name The name of the value to retrieve.
     * @returns The binary data.
     */
    getBinary(name: string): Uint8Array;
    /**
     * Sets the raw value as a binary buffer.
     * @param name The name of the value to set.
     * @param data The data to set.
     * @param type The type of the data.
     */
    setValue(name: string, data: Uint8Array, type: Types): void;
    /**
     * Sets the multi-string value.
     * @param name The name of the value to set.
     * @param value The value to set.
     */
    setMultiString(name: string, value: string[]): void;
    /**
     * Sets the binary value.
     * @param name The name of the value to set.
     * @param data The data to set.
     */
    setBinary(name: string, data: Uint8Array): void;
    /**
     * Sets the string value.
     * @param name The name of the value to set.
     * @param value The value to set.
     */
    setString(name: string, value: string): void;
    /**
     * Sets the expand string value.
     * @param name The name of the value to set.
     * @param value The value to set.
     */
    setExpandString(name: string, value: string): void;
    /**
     * Sets the int32 value, which is often referred to as DWORD in the Windows registry.
     * @param name The name of the value to set.
     * @param value The value to set.
     */
    setInt32(name: string, value: number): void;
    /**
     * Sets the big integer value, which is often referred to as QWORD in the Windows registry or long.
     * @param name The name of the value to set.
     * @param value The value to set.
     */
    setInt64(name: string, value: bigint): void;
    /**
     * Get the key information.
     * @returns The key information.
     */
    stat(): KeyInfo;
}

/** Predefined handle for `HKEY_CLASSES_ROOT`. */
export const HKEY_CLASSES_ROOT = 0x80000000n;
/** Predefined handle for `HKEY_CURRENT_USER`. */
export const HKEY_CURRENT_USER = 0x80000001n;
/** Predefined handle for `HKEY_LOCAL_MACHINE`. */
export const HKEY_LOCAL_MACHINE = 0x80000002n;
/** Predefined handle for `HKEY_USERS`. */
export const HKEY_USERS = 0x80000003n;
/** Predefined handle for `HKEY_PERFORMANCE_DATA`. */
export const HKEY_PERFORMANCE_DATA = 0x80000004n;
/** Predefined handle for `HKEY_CURRENT_CONFIG`. */
export const HKEY_CURRENT_CONFIG = 0x80000005n;

// Win32 error codes
/** @internal */
export const ERROR_SUCCESS = 0;
/** @internal */
export const ERROR_FILE_NOT_FOUND = 2;
/** @internal */
export const ERROR_MORE_DATA = 234;
/** @internal */
export const ERROR_NO_MORE_ITEMS = 259;

/**
 * Converts a JavaScript string to a UTF-16 LE encoded buffer with null terminator.
 * @param str The string to convert.
 * @returns A `Uint8Array` containing the UTF-16 LE encoded string.
 * @internal
 */
export function stringToWide(str: string): Uint8Array<ArrayBuffer> {
    const buf = new Uint8Array((str.length + 1) * 2);
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        buf[i * 2] = code & 0xff;
        buf[i * 2 + 1] = (code >> 8) & 0xff;
    }
    // Null terminator already zero-initialized
    return buf;
}

/**
 * Converts a UTF-16 LE encoded buffer to a JavaScript string.
 * Stops at the first null terminator if present.
 * @param buffer The UTF-16 LE buffer.
 * @param byteLength Optional byte length to read (otherwise reads to null or end).
 * @returns The decoded string.
 * @internal
 */
export function wideToString(buffer: Uint8Array, byteLength?: number): string {
    const len = byteLength ?? buffer.length;
    // deno-lint-ignore no-explicit-any
    const decoder = new TextDecoder("utf-16le" as any);
    // Find null terminator
    let end = len;
    for (let i = 0; i < len - 1; i += 2) {
        if (buffer[i] === 0 && buffer[i + 1] === 0) {
            end = i;
            break;
        }
    }
    return decoder.decode(buffer.subarray(0, end));
}

/**
 * Converts a UTF-16 LE MULTI_SZ buffer to a string array.
 * @param buffer The UTF-16 LE MULTI_SZ buffer.
 * @param byteLength Optional byte length.
 * @returns An array of strings.
 * @internal
 */
export function wideToMultiString(buffer: Uint8Array, byteLength?: number): string[] {
    const result: string[] = [];
    // deno-lint-ignore no-explicit-any
    const decoder = new TextDecoder("utf-16le" as any);
    const len = byteLength ?? buffer.length;
    let start = 0;

    for (let i = 0; i < len - 1; i += 2) {
        if (buffer[i] === 0 && buffer[i + 1] === 0) {
            if (i === start) break; // Double null = end
            result.push(decoder.decode(buffer.subarray(start, i)));
            start = i + 2;
        }
    }

    return result;
}

/**
 * Converts a string array to a UTF-16 LE MULTI_SZ buffer.
 * @param arr The string array.
 * @returns A `Uint8Array` containing the MULTI_SZ encoded data.
 * @internal
 */
export function multiStringToWide(arr: string[]): Uint8Array {
    if (arr.length === 0) {
        return new Uint8Array([0, 0, 0, 0]); // Double null terminator
    }

    // Calculate total size: each string as UTF-16 + null + final null
    let totalChars = 0;
    for (const s of arr) {
        totalChars += s.length + 1; // +1 for null terminator per string
    }
    totalChars += 1; // Final null terminator

    const buf = new Uint8Array(totalChars * 2);
    let offset = 0;

    for (const s of arr) {
        for (let i = 0; i < s.length; i++) {
            const code = s.charCodeAt(i);
            buf[offset] = code & 0xff;
            buf[offset + 1] = (code >> 8) & 0xff;
            offset += 2;
        }
        // Null terminator for this string
        buf[offset] = 0;
        buf[offset + 1] = 0;
        offset += 2;
    }

    // Final null terminator
    buf[offset] = 0;
    buf[offset + 1] = 0;

    return buf;
}

/**
 * Parses the root hive from a full registry path string.
 *
 * @param path A full registry path like `"HKEY_LOCAL_MACHINE\\SOFTWARE\\Foo"`.
 * @returns An object with `hkey` (the predefined HKEY bigint) and `subKey` (the remaining path).
 * @internal
 */
export function parseRegistryPath(
    path: string,
): { hkey: bigint; subKey: string } {
    const sep = path.indexOf("\\");
    const root = sep === -1 ? path : path.substring(0, sep);
    const subKey = sep === -1 ? "" : path.substring(sep + 1);

    switch (root.toUpperCase()) {
        case "HKEY_CLASSES_ROOT":
        case "HKCR":
            return { hkey: HKEY_CLASSES_ROOT, subKey };
        case "HKEY_CURRENT_USER":
        case "HKCU":
            return { hkey: HKEY_CURRENT_USER, subKey };
        case "HKEY_LOCAL_MACHINE":
        case "HKLM":
            return { hkey: HKEY_LOCAL_MACHINE, subKey };
        case "HKEY_USERS":
        case "HKU":
            return { hkey: HKEY_USERS, subKey };
        case "HKEY_PERFORMANCE_DATA":
        case "HKPD":
            return { hkey: HKEY_PERFORMANCE_DATA, subKey };
        case "HKEY_CURRENT_CONFIG":
        case "HKCC":
            return { hkey: HKEY_CURRENT_CONFIG, subKey };
        default:
            throw new Error(`Unknown registry root key: ${root}`);
    }
}

/**
 * The interface that each FFI backend must implement.
 * @internal
 */
export interface RegistryBackend {
    openKey(hkey: bigint, subKey: string, access: number): bigint;
    createKey(hkey: bigint, subKey: string, access: number): { handle: bigint; created: boolean };
    closeKey(hkey: bigint): void;
    deleteKey(hkey: bigint, subKey: string): number;
    deleteValue(hkey: bigint, valueName: string): number;
    queryInfoKey(
        hkey: bigint,
    ): {
        subKeyCount: number;
        maxSubKeyLength: number;
        valueCount: number;
        maxValueNameLength: number;
        maxValueLength: number;
        lastWriteTime: number;
    };
    enumKeyNames(hkey: bigint, index: number, nameBufferSize: number): string | null;
    enumValueNames(
        hkey: bigint,
        index: number,
        nameBufferSize: number,
    ): string | null;
    queryValue(
        hkey: bigint,
        valueName: string,
        buffer: Uint8Array,
    ): { type: number; bytesRead: number } | null;
    setValue(
        hkey: bigint,
        valueName: string,
        type: number,
        data: Uint8Array,
    ): void;
}
