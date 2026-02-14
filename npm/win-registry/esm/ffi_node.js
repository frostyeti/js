import {
  ERROR_MORE_DATA,
  ERROR_NO_MORE_ITEMS,
  ERROR_SUCCESS,
} from "./types.js";
import process from "node:process";
const { createRequire } = process.getBuiltinModule("node:module");
const req = createRequire(import.meta.url ?? "file:///");
const koffi = req("koffi");
const lib = koffi.load("advapi32.dll");
// Use simple C-like prototype syntax with __stdcall.
// For HKEY we use void* since predefined handles are integer constants
// cast to pointers. Koffi can accept numbers for void* params.
// For output HKEY pointers we use _Out_ void** which Koffi handles as an array.
const RegOpenKeyExW = lib.func(
  "int32 __stdcall RegOpenKeyExW(void *hKey, const char16_t *lpSubKey, uint32 ulOptions, uint32 samDesired, _Out_ void **phkResult)",
);
const RegCreateKeyExW = lib.func(
  "int32 __stdcall RegCreateKeyExW(void *hKey, const char16_t *lpSubKey, uint32 Reserved, void *lpClass, uint32 dwOptions, uint32 samDesired, void *lpSecurityAttributes, _Out_ void **phkResult, _Out_ uint32 *lpdwDisposition)",
);
const RegCloseKey = lib.func("int32 __stdcall RegCloseKey(void *hKey)");
const RegDeleteKeyW = lib.func(
  "int32 __stdcall RegDeleteKeyW(void *hKey, const char16_t *lpSubKey)",
);
const RegDeleteValueW = lib.func(
  "int32 __stdcall RegDeleteValueW(void *hKey, const char16_t *lpValueName)",
);
const RegQueryInfoKeyW = lib.func(
  "int32 __stdcall RegQueryInfoKeyW(void *hKey, void *lpClass, void *lpcchClass, void *lpReserved, _Out_ uint32 *lpcSubKeys, _Out_ uint32 *lpcbMaxSubKeyLen, void *lpcbMaxClassLen, _Out_ uint32 *lpcValues, _Out_ uint32 *lpcbMaxValueNameLen, _Out_ uint32 *lpcbMaxValueLen, void *lpcbSecurityDescriptor, void *lpftLastWriteTime)",
);
const RegEnumKeyExW = lib.func(
  "int32 __stdcall RegEnumKeyExW(void *hKey, uint32 dwIndex, char16_t *lpName, _Inout_ uint32 *lpcchName, void *lpReserved, void *lpClass, void *lpcchClass, void *lpftLastWriteTime)",
);
const RegEnumValueW = lib.func(
  "int32 __stdcall RegEnumValueW(void *hKey, uint32 dwIndex, char16_t *lpValueName, _Inout_ uint32 *lpcchValueName, void *lpReserved, _Out_ uint32 *lpType, void *lpData, _Inout_ uint32 *lpcbData)",
);
const RegQueryValueExW = lib.func(
  "int32 __stdcall RegQueryValueExW(void *hKey, const char16_t *lpValueName, void *lpReserved, _Out_ uint32 *lpType, void *lpData, _Inout_ uint32 *lpcbData)",
);
const RegSetValueExW = lib.func(
  "int32 __stdcall RegSetValueExW(void *hKey, const char16_t *lpValueName, uint32 Reserved, uint32 dwType, void *lpData, uint32 cbData)",
);
/**
 * Convert a bigint HKEY handle to a value Koffi can use as void*.
 * Predefined handles (0x80000000-0x80000005) and opened handles
 * are both pointers under the hood. Koffi accepts numbers for void*.
 */
function toHKEY(hkey) {
  // Koffi void* accepts numbers. For predefined HKEY values
  // we need to sign-extend since they are negative when treated as int32
  // but positive as uint32. We pass them as the raw numeric value.
  return Number(hkey & 0xffffffffffffffffn);
}
export const backend = {
  openKey(hkey, subKey, access) {
    const resultArr = [null]; // _Out_ void **phkResult
    const status = RegOpenKeyExW(toHKEY(hkey), subKey, 0, access, resultArr);
    if (status !== ERROR_SUCCESS) {
      throw new Error(
        `RegOpenKeyExW failed for "${subKey}" with error code ${status}`,
      );
    }
    // Koffi returns the pointer as an opaque value; get numeric address
    return BigInt(koffi.address(resultArr[0]));
  },
  createKey(hkey, subKey, access) {
    const handleArr = [null];
    const dispositionArr = [0];
    const status = RegCreateKeyExW(
      toHKEY(hkey),
      subKey,
      0,
      null,
      0,
      access,
      null,
      handleArr,
      dispositionArr,
    );
    if (status !== ERROR_SUCCESS) {
      throw new Error(
        `RegCreateKeyExW failed for "${subKey}" with error code ${status}`,
      );
    }
    const REG_CREATED_NEW_KEY = 1;
    return {
      handle: BigInt(koffi.address(handleArr[0])),
      created: dispositionArr[0] === REG_CREATED_NEW_KEY,
    };
  },
  closeKey(hkey) {
    RegCloseKey(toHKEY(hkey));
  },
  deleteKey(hkey, subKey) {
    return RegDeleteKeyW(toHKEY(hkey), subKey);
  },
  deleteValue(hkey, valueName) {
    return RegDeleteValueW(toHKEY(hkey), valueName);
  },
  queryInfoKey(hkey) {
    const subKeyCount = [0];
    const maxSubKeyLen = [0];
    const valueCount = [0];
    const maxValueNameLen = [0];
    const maxValueLen = [0];
    const lastWriteTime = new Uint8Array(8);
    const status = RegQueryInfoKeyW(
      toHKEY(hkey),
      null,
      null,
      null,
      subKeyCount,
      maxSubKeyLen,
      null,
      valueCount,
      maxValueNameLen,
      maxValueLen,
      null,
      lastWriteTime,
    );
    if (status !== ERROR_SUCCESS) {
      throw new Error(`RegQueryInfoKeyW failed with error code ${status}`);
    }
    const lo = lastWriteTime[0] | (lastWriteTime[1] << 8) |
      (lastWriteTime[2] << 16) | (lastWriteTime[3] << 24);
    const hi = lastWriteTime[4] | (lastWriteTime[5] << 8) |
      (lastWriteTime[6] << 16) | (lastWriteTime[7] << 24);
    return {
      subKeyCount: subKeyCount[0],
      maxSubKeyLength: maxSubKeyLen[0],
      valueCount: valueCount[0],
      maxValueNameLength: maxValueNameLen[0],
      maxValueLength: maxValueLen[0],
      lastWriteTime: Number((BigInt(hi >>> 0) << 32n) | BigInt(lo >>> 0)),
    };
  },
  enumKeyNames(hkey, index, nameBufferSize) {
    const bufSize = nameBufferSize + 1;
    const nameBuf = new Uint16Array(bufSize);
    const sizeBuf = [bufSize];
    const status = RegEnumKeyExW(
      toHKEY(hkey),
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
    const charCount = sizeBuf[0];
    return String.fromCharCode(...nameBuf.subarray(0, charCount));
  },
  enumValueNames(hkey, index, nameBufferSize) {
    const bufSize = nameBufferSize + 1;
    const nameBuf = new Uint16Array(bufSize);
    const sizeBuf = [bufSize];
    const typeBuf = [0];
    const status = RegEnumValueW(
      toHKEY(hkey),
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
    const charCount = sizeBuf[0];
    return String.fromCharCode(...nameBuf.subarray(0, charCount));
  },
  queryValue(hkey, valueName, buffer) {
    const typeBuf = [0];
    const sizeBuf = [buffer.length];
    let status = RegQueryValueExW(
      toHKEY(hkey),
      valueName,
      null,
      typeBuf,
      buffer,
      sizeBuf,
    );
    if (status === ERROR_MORE_DATA) {
      const needed = sizeBuf[0];
      const bigBuf = new Uint8Array(needed);
      sizeBuf[0] = needed;
      status = RegQueryValueExW(
        toHKEY(hkey),
        valueName,
        null,
        typeBuf,
        bigBuf,
        sizeBuf,
      );
      if (status !== ERROR_SUCCESS) {
        return null;
      }
      buffer.set(bigBuf.subarray(0, Math.min(buffer.length, needed)));
      return {
        type: typeBuf[0],
        bytesRead: needed,
      };
    }
    if (status !== ERROR_SUCCESS) {
      return null;
    }
    return {
      type: typeBuf[0],
      bytesRead: sizeBuf[0],
    };
  },
  setValue(hkey, valueName, type, data) {
    const status = RegSetValueExW(
      toHKEY(hkey),
      valueName,
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
