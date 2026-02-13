/**
 * Registry key implementation and Registry facade.
 *
 * The `RegistryKey` class wraps a native HKEY handle and provides
 * high-level methods for reading/writing registry values.
 *
 * The `Registry` class is the main entry point. It must be initialised
 * with a backend before use; the `mod.ts` module does this automatically
 * based on the detected runtime.
 *
 * @module
 * @internal
 */
import type { Key, KeyInfo, RegistryBackend } from "./types.ts";
import {
    HKEY_CLASSES_ROOT,
    HKEY_CURRENT_CONFIG,
    HKEY_CURRENT_USER,
    HKEY_LOCAL_MACHINE,
    HKEY_PERFORMANCE_DATA,
    HKEY_USERS,
    multiStringToWide,
    parseRegistryPath,
    Rights,
    stringToWide,
    Types,
    wideToMultiString,
    wideToString,
} from "./types.ts";

let _backend: RegistryBackend | null = null;

/**
 * Set the FFI backend used by Registry and RegistryKey.
 * @internal
 */
export function setBackend(b: RegistryBackend): void {
    _backend = b;
}

function getBackend(): RegistryBackend {
    if (!_backend) {
        throw new Error(
            "Registry backend not initialised. Import from '@frostyeti/windows-registry' " +
                "(mod.ts) which auto-detects the runtime, or call setBackend() manually.",
        );
    }
    return _backend;
}

/**
 * Concrete implementation of the `Key` interface backed by a native HKEY handle.
 */
export class RegistryKey implements Key {
    #handle: bigint;
    #path: string;
    #created: boolean;
    #closed = false;

    constructor(handle: bigint, path: string, created = false) {
        this.#handle = handle;
        this.#path = path;
        this.#created = created;
    }

    get path(): string {
        return this.#path;
    }

    get created(): boolean {
        return this.#created;
    }

    isNull(): boolean {
        return this.#handle === 0n;
    }

    unwrap(): bigint {
        return this.#handle;
    }

    close(): void {
        if (!this.#closed && !this.#isPredefined()) {
            getBackend().closeKey(this.#handle);
            this.#closed = true;
        }
    }

    [Symbol.dispose](): void {
        this.close();
    }

    #isPredefined(): boolean {
        return (
            this.#handle === HKEY_CLASSES_ROOT ||
            this.#handle === HKEY_CURRENT_USER ||
            this.#handle === HKEY_LOCAL_MACHINE ||
            this.#handle === HKEY_USERS ||
            this.#handle === HKEY_PERFORMANCE_DATA ||
            this.#handle === HKEY_CURRENT_CONFIG
        );
    }

    #ensureOpen(): void {
        if (this.#closed) {
            throw new Error("Registry key has been closed.");
        }
    }

    openKey(path: string, access: number = Rights.READ): Key {
        this.#ensureOpen();
        const handle = getBackend().openKey(this.#handle, path, access);
        return new RegistryKey(
            handle,
            this.#path ? `${this.#path}\\${path}` : path,
        );
    }

    createKey(path: string, access: number = Rights.ALL_ACCESS): Key {
        this.#ensureOpen();
        const result = getBackend().createKey(this.#handle, path, access);
        return new RegistryKey(
            result.handle,
            this.#path ? `${this.#path}\\${path}` : path,
            result.created,
        );
    }

    deleteKey(name: string): boolean {
        this.#ensureOpen();
        const status = getBackend().deleteKey(this.#handle, name);
        return status === 0; // ERROR_SUCCESS
    }

    deleteValue(name: string): boolean {
        this.#ensureOpen();
        const status = getBackend().deleteValue(this.#handle, name);
        return status === 0;
    }

    stat(): KeyInfo {
        this.#ensureOpen();
        const info = getBackend().queryInfoKey(this.#handle);
        return {
            subKeyCount: info.subKeyCount,
            maxSubKeyLength: info.maxSubKeyLength,
            valueCount: info.valueCount,
            maxValueNameLength: info.maxValueNameLength,
            maxValueLength: info.maxValueLength,
            lastWriteTime: info.lastWriteTime || undefined,
        };
    }

    getSubKeyNames(n?: number): string[] {
        this.#ensureOpen();
        const info = getBackend().queryInfoKey(this.#handle);
        const names: string[] = [];
        const limit = n ?? info.subKeyCount;
        const bufSize = info.maxSubKeyLength;

        for (let i = 0; i < limit; i++) {
            const name = getBackend().enumKeyNames(
                this.#handle,
                i,
                bufSize,
            );
            if (name === null) break;
            names.push(name);
        }
        return names;
    }

    getValueNames(n?: number): string[] {
        this.#ensureOpen();
        const info = getBackend().queryInfoKey(this.#handle);
        const names: string[] = [];
        const limit = n ?? info.valueCount;
        const bufSize = info.maxValueNameLength;

        for (let i = 0; i < limit; i++) {
            const name = getBackend().enumValueNames(
                this.#handle,
                i,
                bufSize,
            );
            if (name === null) break;
            names.push(name);
        }
        return names;
    }

    getValue(
        name: string,
        buffer?: Uint8Array,
    ): { data: Uint8Array; type: number } {
        this.#ensureOpen();
        const buf = buffer ?? new Uint8Array(4096);
        const result = getBackend().queryValue(this.#handle, name, buf);
        if (!result) {
            throw new Error(
                `Registry value "${name}" not found under "${this.#path}".`,
            );
        }

        return {
            data: buf.subarray(0, result.bytesRead),
            type: result.type,
        };
    }

    getString(name: string): string {
        const { data, type } = this.getValue(name);
        if (type !== Types.SZ && type !== Types.EXPAND_SZ) {
            throw new Error(
                `Expected SZ or EXPAND_SZ but got type ${type} for "${name}".`,
            );
        }
        return wideToString(data);
    }

    getMultiString(name: string): string[] {
        const { data, type } = this.getValue(name);
        if (type !== Types.MULTI_SZ) {
            throw new Error(
                `Expected MULTI_SZ but got type ${type} for "${name}".`,
            );
        }
        return wideToMultiString(data);
    }

    getInt32(name: string): number {
        const { data, type } = this.getValue(name);
        if (type !== Types.DWORD && type !== Types.DWORD_BIG_ENDIAN) {
            throw new Error(
                `Expected DWORD but got type ${type} for "${name}".`,
            );
        }
        if (type === Types.DWORD_BIG_ENDIAN) {
            return (data[0] << 24) | (data[1] << 16) | (data[2] << 8) |
                data[3];
        }
        return data[0] | (data[1] << 8) | (data[2] << 16) | (data[3] << 24);
    }

    getInt64(name: string): bigint {
        const { data, type } = this.getValue(name);
        if (type !== Types.QWORD) {
            throw new Error(
                `Expected QWORD but got type ${type} for "${name}".`,
            );
        }
        const view = new DataView(
            data.buffer,
            data.byteOffset,
            data.byteLength,
        );
        return view.getBigInt64(0, true); // little-endian
    }

    getBinary(name: string): Uint8Array {
        const { data, type } = this.getValue(name);
        if (type !== Types.BINARY) {
            throw new Error(
                `Expected BINARY but got type ${type} for "${name}".`,
            );
        }
        return data;
    }

    setValue(name: string, data: Uint8Array, type: Types): void {
        this.#ensureOpen();
        getBackend().setValue(this.#handle, name, type, data);
    }

    setString(name: string, value: string): void {
        const wide = stringToWide(value);
        this.setValue(name, wide, Types.SZ);
    }

    setExpandString(name: string, value: string): void {
        const wide = stringToWide(value);
        this.setValue(name, wide, Types.EXPAND_SZ);
    }

    setMultiString(name: string, value: string[]): void {
        const wide = multiStringToWide(value);
        this.setValue(name, wide, Types.MULTI_SZ);
    }

    setBinary(name: string, data: Uint8Array): void {
        this.setValue(name, data, Types.BINARY);
    }

    setInt32(name: string, value: number): void {
        const buf = new Uint8Array(4);
        buf[0] = value & 0xff;
        buf[1] = (value >> 8) & 0xff;
        buf[2] = (value >> 16) & 0xff;
        buf[3] = (value >> 24) & 0xff;
        this.setValue(name, buf, Types.DWORD);
    }

    setInt64(name: string, value: bigint): void {
        const buf = new Uint8Array(8);
        const view = new DataView(buf.buffer);
        view.setBigInt64(0, value, true); // little-endian
        this.setValue(name, buf, Types.QWORD);
    }
}

/**
 * Creates a predefined RegistryKey wrapper for the given HKEY constant.
 */
function predefinedKey(hkey: bigint, name: string): Key {
    return new RegistryKey(hkey, name);
}

/**
 * The static Registry class which is the primary entry point for working
 * with the Windows registry.
 */
export class Registry {
    /** Returns the key for `HKEY_CLASSES_ROOT`. */
    static get HKCR(): Key {
        return predefinedKey(HKEY_CLASSES_ROOT, "HKEY_CLASSES_ROOT");
    }

    /** Returns the key for `HKEY_CURRENT_USER`. */
    static get HKCU(): Key {
        return predefinedKey(HKEY_CURRENT_USER, "HKEY_CURRENT_USER");
    }

    /** Returns the key for `HKEY_LOCAL_MACHINE`. */
    static get HKLM(): Key {
        return predefinedKey(HKEY_LOCAL_MACHINE, "HKEY_LOCAL_MACHINE");
    }

    /** Returns the key for `HKEY_USERS`. */
    static get HKU(): Key {
        return predefinedKey(HKEY_USERS, "HKEY_USERS");
    }

    /** Returns the key for `HKEY_PERFORMANCE_DATA`. */
    static get HKPD(): Key {
        return predefinedKey(HKEY_PERFORMANCE_DATA, "HKEY_PERFORMANCE_DATA");
    }

    /** Returns the key for `HKEY_CURRENT_CONFIG`. */
    static get HKCC(): Key {
        return predefinedKey(HKEY_CURRENT_CONFIG, "HKEY_CURRENT_CONFIG");
    }

    /**
     * Open a registry key.
     * @param path The full registry path (e.g. "HKLM\\SOFTWARE\\Foo").
     * @param access The access rights. Defaults to `Rights.READ`.
     * @returns The opened key.
     */
    static openKey(path: string, access?: number): Key;
    /**
     * Open a registry key relative to a parent key.
     * @param key The parent key.
     * @param path The sub-path to open.
     * @param access The access rights. Defaults to `Rights.READ`.
     * @returns The opened key.
     */
    static openKey(key: Key, path: string, access?: number): Key;
    static openKey(
        arg1: Key | string,
        arg2?: string | number,
        arg3?: number,
    ): Key {
        if (typeof arg1 === "string") {
            // openKey(path, access?)
            const { hkey, subKey } = parseRegistryPath(arg1);
            const access = (arg2 as number | undefined) ?? Rights.READ;
            const handle = getBackend().openKey(hkey, subKey, access);
            return new RegistryKey(handle, arg1);
        }

        // openKey(key, path, access?)
        const parent = arg1 as Key;
        const path = arg2 as string;
        const access = arg3 ?? Rights.READ;
        return parent.openKey(path, access);
    }

    /**
     * Create a registry key.
     * @param path The full registry path (e.g. "HKLM\\SOFTWARE\\Foo").
     * @param access The access rights. Defaults to `Rights.ALL_ACCESS`.
     * @returns The created key.
     */
    static createKey(path: string, access?: number): Key;
    /**
     * Create a registry key relative to a parent key.
     * @param key The parent key.
     * @param path The sub-path to create.
     * @param access The access rights. Defaults to `Rights.ALL_ACCESS`.
     * @returns The created key.
     */
    static createKey(key: Key, path: string, access?: number): Key;
    static createKey(
        arg1: Key | string,
        arg2?: string | number,
        arg3?: number,
    ): Key {
        if (typeof arg1 === "string") {
            const { hkey, subKey } = parseRegistryPath(arg1);
            const access = (arg2 as number | undefined) ?? Rights.ALL_ACCESS;
            const result = getBackend().createKey(hkey, subKey, access);
            return new RegistryKey(result.handle, arg1, result.created);
        }

        const parent = arg1 as Key;
        const path = arg2 as string;
        const access = arg3 ?? Rights.ALL_ACCESS;
        return parent.createKey(path, access);
    }

    /**
     * Delete a registry key.
     * @param path The full registry path to delete.
     */
    static deleteKey(path: string): void;
    /**
     * Delete a registry sub-key relative to a parent key.
     * @param key The parent key.
     * @param path The sub-path to delete.
     */
    static deleteKey(key: Key, path: string): void;
    static deleteKey(arg1: Key | string, arg2?: string): void {
        if (typeof arg1 === "string") {
            const { hkey, subKey } = parseRegistryPath(arg1);
            const status = getBackend().deleteKey(hkey, subKey);
            if (status !== 0) {
                throw new Error(
                    `Failed to delete registry key "${arg1}" with error code ${status}`,
                );
            }
            return;
        }

        const parent = arg1;
        const path = arg2 as string;
        if (!parent.deleteKey(path)) {
            throw new Error(
                `Failed to delete registry key "${path}"`,
            );
        }
    }
}
