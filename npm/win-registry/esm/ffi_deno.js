import {
  ERROR_MORE_DATA,
  ERROR_NO_MORE_ITEMS,
  ERROR_SUCCESS,
  stringToWide,
  wideToString,
} from "./types.js";
import { globals } from "@frostyeti/globals/globals";
const Deno = globals.Deno;
const lib = Deno.dlopen("advapi32.dll", {
  RegOpenKeyExW: {
    parameters: ["pointer", "buffer", "u32", "u32", "buffer"],
    result: "i32",
  },
  RegCreateKeyExW: {
    parameters: [
      "pointer",
      "buffer",
      "u32",
      "pointer",
      "u32",
      "u32",
      "pointer",
      "buffer",
      "buffer",
    ],
    result: "i32",
  },
  RegCloseKey: {
    parameters: ["pointer"],
    result: "i32",
  },
  RegDeleteKeyW: {
    parameters: ["pointer", "buffer"],
    result: "i32",
  },
  RegDeleteValueW: {
    parameters: ["pointer", "buffer"],
    result: "i32",
  },
  RegQueryInfoKeyW: {
    parameters: [
      "pointer", // hKey
      "pointer", // lpClass
      "pointer", // lpcchClass
      "pointer", // lpReserved
      "buffer", // lpcSubKeys
      "buffer", // lpcbMaxSubKeyLen
      "pointer", // lpcbMaxClassLen
      "buffer", // lpcValues
      "buffer", // lpcbMaxValueNameLen
      "buffer", // lpcbMaxValueLen
      "pointer", // lpcbSecurityDescriptor
      "buffer", // lpftLastWriteTime
    ],
    result: "i32",
  },
  RegEnumKeyExW: {
    parameters: [
      "pointer", // hKey
      "u32", // dwIndex
      "buffer", // lpName
      "buffer", // lpcchName
      "pointer", // lpReserved
      "pointer", // lpClass
      "pointer", // lpcchClass
      "pointer", // lpftLastWriteTime
    ],
    result: "i32",
  },
  RegEnumValueW: {
    parameters: [
      "pointer", // hKey
      "u32", // dwIndex
      "buffer", // lpValueName
      "buffer", // lpcchValueName
      "pointer", // lpReserved
      "buffer", // lpType
      "buffer", // lpData
      "buffer", // lpcbData
    ],
    result: "i32",
  },
  RegQueryValueExW: {
    parameters: [
      "pointer", // hKey
      "buffer", // lpValueName
      "pointer", // lpReserved
      "buffer", // lpType
      "buffer", // lpData
      "buffer", // lpcbData
    ],
    result: "i32",
  },
  RegSetValueExW: {
    parameters: [
      "pointer", // hKey
      "buffer", // lpValueName
      "u32", // Reserved
      "u32", // dwType
      "buffer", // lpData
      "u32", // cbData
    ],
    result: "i32",
  },
});
const { symbols } = lib;
function readU32(buf, offset = 0) {
  return buf[offset] | (buf[offset + 1] << 8) | (buf[offset + 2] << 16) |
    (buf[offset + 3] << 24);
}
function writeU32(buf, value, offset = 0) {
  buf[offset] = value & 0xff;
  buf[offset + 1] = (value >> 8) & 0xff;
  buf[offset + 2] = (value >> 16) & 0xff;
  buf[offset + 3] = (value >> 24) & 0xff;
}
function readU64(buf, offset = 0) {
  const lo = BigInt(readU32(buf, offset) >>> 0);
  const hi = BigInt(readU32(buf, offset + 4) >>> 0);
  return (hi << 32n) | lo;
}
export const backend = {
  openKey(hkey, subKey, access) {
    const wSubKey = stringToWide(subKey);
    const resultBuf = new Uint8Array(8); // PHKEY = pointer-sized
    const status = symbols.RegOpenKeyExW(
      Deno.UnsafePointer.create(hkey),
      wSubKey,
      0,
      access,
      resultBuf,
    );
    if (status !== ERROR_SUCCESS) {
      throw new Error(
        `RegOpenKeyExW failed for "${subKey}" with error code ${status}`,
      );
    }
    return readU64(resultBuf);
  },
  createKey(hkey, subKey, access) {
    const wSubKey = stringToWide(subKey);
    const handleBuf = new Uint8Array(8);
    const dispositionBuf = new Uint8Array(4);
    const status = symbols.RegCreateKeyExW(
      Deno.UnsafePointer.create(hkey),
      wSubKey,
      0,
      null, // lpClass
      0, // dwOptions = REG_OPTION_NON_VOLATILE
      access,
      null, // lpSecurityAttributes
      handleBuf,
      dispositionBuf,
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
  closeKey(hkey) {
    symbols.RegCloseKey(Deno.UnsafePointer.create(hkey));
  },
  deleteKey(hkey, subKey) {
    const wSubKey = stringToWide(subKey);
    return symbols.RegDeleteKeyW(Deno.UnsafePointer.create(hkey), wSubKey);
  },
  deleteValue(hkey, valueName) {
    const wName = stringToWide(valueName);
    return symbols.RegDeleteValueW(Deno.UnsafePointer.create(hkey), wName);
  },
  queryInfoKey(hkey) {
    const subKeyCountBuf = new Uint8Array(4);
    const maxSubKeyLenBuf = new Uint8Array(4);
    const valueCountBuf = new Uint8Array(4);
    const maxValueNameLenBuf = new Uint8Array(4);
    const maxValueLenBuf = new Uint8Array(4);
    const lastWriteTimeBuf = new Uint8Array(8);
    const status = symbols.RegQueryInfoKeyW(
      Deno.UnsafePointer.create(hkey),
      null,
      null,
      null,
      subKeyCountBuf,
      maxSubKeyLenBuf,
      null,
      valueCountBuf,
      maxValueNameLenBuf,
      maxValueLenBuf,
      null,
      lastWriteTimeBuf,
    );
    if (status !== ERROR_SUCCESS) {
      throw new Error(`RegQueryInfoKeyW failed with error code ${status}`);
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
  enumKeyNames(hkey, index, nameBufferSize) {
    const nameBuf = new Uint8Array((nameBufferSize + 1) * 2);
    const sizeBuf = new Uint8Array(4);
    writeU32(sizeBuf, nameBufferSize + 1);
    const status = symbols.RegEnumKeyExW(
      Deno.UnsafePointer.create(hkey),
      index,
      nameBuf,
      sizeBuf,
      null,
      null,
      null,
      null,
    );
    if (status === ERROR_NO_MORE_ITEMS) {
      return null;
    }
    if (status !== ERROR_SUCCESS) {
      throw new Error(`RegEnumKeyExW failed with error code ${status}`);
    }
    const charCount = readU32(sizeBuf);
    return wideToString(nameBuf, charCount * 2);
  },
  enumValueNames(hkey, index, nameBufferSize) {
    const nameBuf = new Uint8Array((nameBufferSize + 1) * 2);
    const sizeBuf = new Uint8Array(4);
    writeU32(sizeBuf, nameBufferSize + 1);
    const typeBuf = new Uint8Array(4);
    const status = symbols.RegEnumValueW(
      Deno.UnsafePointer.create(hkey),
      index,
      nameBuf,
      sizeBuf,
      null,
      typeBuf,
      null,
      null,
    );
    if (status === ERROR_NO_MORE_ITEMS) {
      return null;
    }
    if (status !== ERROR_SUCCESS) {
      throw new Error(`RegEnumValueW failed with error code ${status}`);
    }
    const charCount = readU32(sizeBuf);
    return wideToString(nameBuf, charCount * 2);
  },
  queryValue(hkey, valueName, buffer) {
    const wName = stringToWide(valueName);
    const typeBuf = new Uint8Array(4);
    const sizeBuf = new Uint8Array(4);
    writeU32(sizeBuf, buffer.length);
    let status = symbols.RegQueryValueExW(
      Deno.UnsafePointer.create(hkey),
      wName,
      null,
      typeBuf,
      buffer,
      sizeBuf,
    );
    if (status === ERROR_MORE_DATA) {
      // The buffer was too small; sizeBuf now contains the required size.
      // The caller can retry with a larger buffer, but we also try once more
      // by expanding.
      const needed = readU32(sizeBuf);
      const bigBuf = new Uint8Array(needed);
      writeU32(sizeBuf, needed);
      status = symbols.RegQueryValueExW(
        Deno.UnsafePointer.create(hkey),
        wName,
        null,
        typeBuf,
        bigBuf,
        sizeBuf,
      );
      if (status !== ERROR_SUCCESS) {
        return null;
      }
      // Copy as much as fits into the caller's buffer
      buffer.set(bigBuf.subarray(0, Math.min(buffer.length, needed)));
      return {
        type: readU32(typeBuf),
        bytesRead: needed,
      };
    }
    if (status !== ERROR_SUCCESS) {
      return null;
    }
    return {
      type: readU32(typeBuf),
      bytesRead: readU32(sizeBuf),
    };
  },
  setValue(hkey, valueName, type, data) {
    const wName = stringToWide(valueName);
    const status = symbols.RegSetValueExW(
      Deno.UnsafePointer.create(hkey),
      wName,
      0,
      type,
      data,
      data.length,
    );
    if (status !== ERROR_SUCCESS) {
      throw new Error(`RegSetValueExW failed with error code ${status}`);
    }
  },
};
