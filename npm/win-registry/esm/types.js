/**
 * The Access Rights for the registry key.
 */
export var Rights;
(function (Rights) {
  /**
   * Full access
   */
  Rights[Rights["ALL_ACCESS"] = 983103] = "ALL_ACCESS";
  /**
   * Create a link to the key.
   */
  Rights[Rights["CREATE_LINK"] = 32] = "CREATE_LINK";
  /**
   * Create a subkey.
   */
  Rights[Rights["CREATE_SUB_KEY"] = 4] = "CREATE_SUB_KEY";
  /**
   * Enumerate the subkeys.
   */
  Rights[Rights["ENUMERATE_SUB_KEYS"] = 8] = "ENUMERATE_SUB_KEYS";
  /**
   * Execute a key.
   */
  Rights[Rights["EXECUTE"] = 131097] = "EXECUTE";
  /**
   * Notify the key.
   */
  Rights[Rights["NOTIFY"] = 16] = "NOTIFY";
  /**
   * Query the values from a key.
   */
  Rights[Rights["QUERY_VALUE"] = 1] = "QUERY_VALUE";
  /**
   * Read the key.
   */
  Rights[Rights["READ"] = 131097] = "READ";
  /**
   * Set value for a key.
   */
  Rights[Rights["SET_VALUE"] = 2] = "SET_VALUE";
  /**
   * Get access to the 32-bit view of the key.
   */
  Rights[Rights["WOW64_32KEY"] = 512] = "WOW64_32KEY";
  /**
   * Get access to the 64-bit view of the key.
   */
  Rights[Rights["WOW64_64KEY"] = 256] = "WOW64_64KEY";
  /**
   * Write the key.
   */
  Rights[Rights["WRITE"] = 131078] = "WRITE";
})(Rights || (Rights = {}));
/**
 * The value types for the registry key.
 */
export var Types;
(function (Types) {
  // Registry value types.
  Types[Types["NONE"] = 0] = "NONE";
  /**
   * A null-terminated string.
   */
  Types[Types["SZ"] = 1] = "SZ";
  /**
   * A null-terminated string that contains unexpanded references to environment variables.
   */
  Types[Types["EXPAND_SZ"] = 2] = "EXPAND_SZ";
  /**
   * Binary data in any form.
   */
  Types[Types["BINARY"] = 3] = "BINARY";
  /**
   * A 32-bit number.
   */
  Types[Types["DWORD"] = 4] = "DWORD";
  /**
   * A 32-bit number in big-endian format.
   */
  Types[Types["DWORD_BIG_ENDIAN"] = 5] = "DWORD_BIG_ENDIAN";
  /**
   * A symbolic link.
   */
  Types[Types["LINK"] = 6] = "LINK";
  /**
   * An array of null-terminated strings, terminated by two null characters.
   */
  Types[Types["MULTI_SZ"] = 7] = "MULTI_SZ";
  /**
   * A resource list in the resource requirements list.
   */
  Types[Types["RESOURCE_LIST"] = 8] = "RESOURCE_LIST";
  /**
   * A resource descriptor in the resource requirements list.
   */
  Types[Types["FULL_RESOURCE_DESCRIPTOR"] = 9] = "FULL_RESOURCE_DESCRIPTOR";
  /**
   * A resource requirements list.
   */
  Types[Types["RESOURCE_REQUIREMENTS_LIST"] = 10] =
    "RESOURCE_REQUIREMENTS_LIST";
  /**
   * A 64-bit number.
   */
  Types[Types["QWORD"] = 11] = "QWORD";
})(Types || (Types = {}));
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
export function stringToWide(str) {
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
export function wideToString(buffer, byteLength) {
  const len = byteLength ?? buffer.length;
  // deno-lint-ignore no-explicit-any
  const decoder = new TextDecoder("utf-16le");
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
export function wideToMultiString(buffer, byteLength) {
  const result = [];
  // deno-lint-ignore no-explicit-any
  const decoder = new TextDecoder("utf-16le");
  const len = byteLength ?? buffer.length;
  let start = 0;
  for (let i = 0; i < len - 1; i += 2) {
    if (buffer[i] === 0 && buffer[i + 1] === 0) {
      if (i === start) {
        break; // Double null = end
      }
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
export function multiStringToWide(arr) {
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
export function parseRegistryPath(path) {
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
