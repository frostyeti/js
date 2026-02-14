/**
 * The Access Rights for the registry key.
 */
export declare enum Rights {
  /**
   * Full access
   */
  ALL_ACCESS = 983103,
  /**
   * Create a link to the key.
   */
  CREATE_LINK = 32,
  /**
   * Create a subkey.
   */
  CREATE_SUB_KEY = 4,
  /**
   * Enumerate the subkeys.
   */
  ENUMERATE_SUB_KEYS = 8,
  /**
   * Execute a key.
   */
  EXECUTE = 131097,
  /**
   * Notify the key.
   */
  NOTIFY = 16,
  /**
   * Query the values from a key.
   */
  QUERY_VALUE = 1,
  /**
   * Read the key.
   */
  READ = 131097,
  /**
   * Set value for a key.
   */
  SET_VALUE = 2,
  /**
   * Get access to the 32-bit view of the key.
   */
  WOW64_32KEY = 512,
  /**
   * Get access to the 64-bit view of the key.
   */
  WOW64_64KEY = 256,
  /**
   * Write the key.
   */
  WRITE = 131078,
}
/**
 * The value types for the registry key.
 */
export declare enum Types {
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
  getValue(name: string, buffer?: Uint8Array): {
    data: Uint8Array;
    type: number;
  };
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
export declare const HKEY_CLASSES_ROOT = 2147483648n;
/** Predefined handle for `HKEY_CURRENT_USER`. */
export declare const HKEY_CURRENT_USER = 2147483649n;
/** Predefined handle for `HKEY_LOCAL_MACHINE`. */
export declare const HKEY_LOCAL_MACHINE = 2147483650n;
/** Predefined handle for `HKEY_USERS`. */
export declare const HKEY_USERS = 2147483651n;
/** Predefined handle for `HKEY_PERFORMANCE_DATA`. */
export declare const HKEY_PERFORMANCE_DATA = 2147483652n;
/** Predefined handle for `HKEY_CURRENT_CONFIG`. */
export declare const HKEY_CURRENT_CONFIG = 2147483653n;
/** @internal */
export declare const ERROR_SUCCESS = 0;
/** @internal */
export declare const ERROR_FILE_NOT_FOUND = 2;
/** @internal */
export declare const ERROR_MORE_DATA = 234;
/** @internal */
export declare const ERROR_NO_MORE_ITEMS = 259;
/**
 * Converts a JavaScript string to a UTF-16 LE encoded buffer with null terminator.
 * @param str The string to convert.
 * @returns A `Uint8Array` containing the UTF-16 LE encoded string.
 * @internal
 */
export declare function stringToWide(str: string): Uint8Array<ArrayBuffer>;
/**
 * Converts a UTF-16 LE encoded buffer to a JavaScript string.
 * Stops at the first null terminator if present.
 * @param buffer The UTF-16 LE buffer.
 * @param byteLength Optional byte length to read (otherwise reads to null or end).
 * @returns The decoded string.
 * @internal
 */
export declare function wideToString(
  buffer: Uint8Array,
  byteLength?: number,
): string;
/**
 * Converts a UTF-16 LE MULTI_SZ buffer to a string array.
 * @param buffer The UTF-16 LE MULTI_SZ buffer.
 * @param byteLength Optional byte length.
 * @returns An array of strings.
 * @internal
 */
export declare function wideToMultiString(
  buffer: Uint8Array,
  byteLength?: number,
): string[];
/**
 * Converts a string array to a UTF-16 LE MULTI_SZ buffer.
 * @param arr The string array.
 * @returns A `Uint8Array` containing the MULTI_SZ encoded data.
 * @internal
 */
export declare function multiStringToWide(arr: string[]): Uint8Array;
/**
 * Parses the root hive from a full registry path string.
 *
 * @param path A full registry path like `"HKEY_LOCAL_MACHINE\\SOFTWARE\\Foo"`.
 * @returns An object with `hkey` (the predefined HKEY bigint) and `subKey` (the remaining path).
 * @internal
 */
export declare function parseRegistryPath(path: string): {
  hkey: bigint;
  subKey: string;
};
/**
 * The interface that each FFI backend must implement.
 * @internal
 */
export interface RegistryBackend {
  openKey(hkey: bigint, subKey: string, access: number): bigint;
  createKey(hkey: bigint, subKey: string, access: number): {
    handle: bigint;
    created: boolean;
  };
  closeKey(hkey: bigint): void;
  deleteKey(hkey: bigint, subKey: string): number;
  deleteValue(hkey: bigint, valueName: string): number;
  queryInfoKey(hkey: bigint): {
    subKeyCount: number;
    maxSubKeyLength: number;
    valueCount: number;
    maxValueNameLength: number;
    maxValueLength: number;
    lastWriteTime: number;
  };
  enumKeyNames(
    hkey: bigint,
    index: number,
    nameBufferSize: number,
  ): string | null;
  enumValueNames(
    hkey: bigint,
    index: number,
    nameBufferSize: number,
  ): string | null;
  queryValue(hkey: bigint, valueName: string, buffer: Uint8Array): {
    type: number;
    bytesRead: number;
  } | null;
  setValue(
    hkey: bigint,
    valueName: string,
    type: number,
    data: Uint8Array,
  ): void;
}
