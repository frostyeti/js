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
} from "./types.js";
import { globals } from "@frostyeti/globals/globals";
import process from "node:process";
const { createRequire } = process.getBuiltinModule("node:module");
const require = createRequire(import.meta.url ?? "file:///");
let _backend;
if (typeof globals.Bun !== "undefined") {
  const file = "./ffi_bun.js";
  const { backend } = require(file);
  _backend = backend;
} else if (
  typeof globals.Deno !== "undefined" &&
  typeof globals.Deno.dlopen === "function"
) {
  const { backend } = require("./ffi_deno.ts");
  _backend = backend;
} else {
  const file = "./ffi_node.js";
  const { backend } = require(file);
  _backend = backend;
}
/**
 * Concrete implementation of the `Key` interface backed by a native HKEY handle.
 */
export class RegistryKey {
  #handle;
  #path;
  #created;
  #closed = false;
  constructor(handle, path, created = false) {
    this.#handle = handle;
    this.#path = path;
    this.#created = created;
  }
  get path() {
    return this.#path;
  }
  get created() {
    return this.#created;
  }
  isNull() {
    return this.#handle === 0n;
  }
  unwrap() {
    return this.#handle;
  }
  close() {
    if (!this.#closed && !this.#isPredefined()) {
      _backend?.closeKey(this.#handle);
      this.#closed = true;
    }
  }
  [Symbol.dispose]() {
    this.close();
  }
  #isPredefined() {
    return (this.#handle === HKEY_CLASSES_ROOT ||
      this.#handle === HKEY_CURRENT_USER ||
      this.#handle === HKEY_LOCAL_MACHINE ||
      this.#handle === HKEY_USERS ||
      this.#handle === HKEY_PERFORMANCE_DATA ||
      this.#handle === HKEY_CURRENT_CONFIG);
  }
  #ensureOpen() {
    if (this.#closed) {
      throw new Error("Registry key has been closed.");
    }
  }
  openKey(path, access = Rights.READ) {
    this.#ensureOpen();
    const handle = _backend.openKey(this.#handle, path, access);
    return new RegistryKey(
      handle,
      this.#path ? `${this.#path}\\${path}` : path,
    );
  }
  createKey(path, access = Rights.ALL_ACCESS) {
    this.#ensureOpen();
    const result = _backend.createKey(this.#handle, path, access);
    return new RegistryKey(
      result.handle,
      this.#path ? `${this.#path}\\${path}` : path,
      result.created,
    );
  }
  deleteKey(name) {
    this.#ensureOpen();
    const status = _backend.deleteKey(this.#handle, name);
    return status === 0; // ERROR_SUCCESS
  }
  deleteValue(name) {
    this.#ensureOpen();
    const status = _backend.deleteValue(this.#handle, name);
    return status === 0;
  }
  stat() {
    this.#ensureOpen();
    const info = _backend.queryInfoKey(this.#handle);
    return {
      subKeyCount: info.subKeyCount,
      maxSubKeyLength: info.maxSubKeyLength,
      valueCount: info.valueCount,
      maxValueNameLength: info.maxValueNameLength,
      maxValueLength: info.maxValueLength,
      lastWriteTime: info.lastWriteTime || undefined,
    };
  }
  getSubKeyNames(n) {
    this.#ensureOpen();
    const info = _backend.queryInfoKey(this.#handle);
    const names = [];
    const limit = n ?? info.subKeyCount;
    const bufSize = info.maxSubKeyLength;
    for (let i = 0; i < limit; i++) {
      const name = _backend.enumKeyNames(this.#handle, i, bufSize);
      if (name === null) {
        break;
      }
      names.push(name);
    }
    return names;
  }
  getValueNames(n) {
    this.#ensureOpen();
    const info = _backend.queryInfoKey(this.#handle);
    const names = [];
    const limit = n ?? info.valueCount;
    const bufSize = info.maxValueNameLength;
    for (let i = 0; i < limit; i++) {
      const name = _backend.enumValueNames(this.#handle, i, bufSize);
      if (name === null) {
        break;
      }
      names.push(name);
    }
    return names;
  }
  getValue(name, buffer) {
    this.#ensureOpen();
    const buf = buffer ?? new Uint8Array(4096);
    const result = _backend.queryValue(this.#handle, name, buf);
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
  getString(name) {
    const { data, type } = this.getValue(name);
    if (type !== Types.SZ && type !== Types.EXPAND_SZ) {
      throw new Error(
        `Expected SZ or EXPAND_SZ but got type ${type} for "${name}".`,
      );
    }
    return wideToString(data);
  }
  getMultiString(name) {
    const { data, type } = this.getValue(name);
    if (type !== Types.MULTI_SZ) {
      throw new Error(`Expected MULTI_SZ but got type ${type} for "${name}".`);
    }
    return wideToMultiString(data);
  }
  getInt32(name) {
    const { data, type } = this.getValue(name);
    if (type !== Types.DWORD && type !== Types.DWORD_BIG_ENDIAN) {
      throw new Error(`Expected DWORD but got type ${type} for "${name}".`);
    }
    if (type === Types.DWORD_BIG_ENDIAN) {
      return (data[0] << 24) | (data[1] << 16) | (data[2] << 8) |
        data[3];
    }
    return data[0] | (data[1] << 8) | (data[2] << 16) | (data[3] << 24);
  }
  getInt64(name) {
    const { data, type } = this.getValue(name);
    if (type !== Types.QWORD) {
      throw new Error(`Expected QWORD but got type ${type} for "${name}".`);
    }
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    return view.getBigInt64(0, true); // little-endian
  }
  getBinary(name) {
    const { data, type } = this.getValue(name);
    if (type !== Types.BINARY) {
      throw new Error(`Expected BINARY but got type ${type} for "${name}".`);
    }
    return data;
  }
  setValue(name, data, type) {
    this.#ensureOpen();
    _backend.setValue(this.#handle, name, type, data);
  }
  setString(name, value) {
    const wide = stringToWide(value);
    this.setValue(name, wide, Types.SZ);
  }
  setExpandString(name, value) {
    const wide = stringToWide(value);
    this.setValue(name, wide, Types.EXPAND_SZ);
  }
  setMultiString(name, value) {
    const wide = multiStringToWide(value);
    this.setValue(name, wide, Types.MULTI_SZ);
  }
  setBinary(name, data) {
    this.setValue(name, data, Types.BINARY);
  }
  setInt32(name, value) {
    const buf = new Uint8Array(4);
    buf[0] = value & 0xff;
    buf[1] = (value >> 8) & 0xff;
    buf[2] = (value >> 16) & 0xff;
    buf[3] = (value >> 24) & 0xff;
    this.setValue(name, buf, Types.DWORD);
  }
  setInt64(name, value) {
    const buf = new Uint8Array(8);
    const view = new DataView(buf.buffer);
    view.setBigInt64(0, value, true); // little-endian
    this.setValue(name, buf, Types.QWORD);
  }
}
/**
 * Creates a predefined RegistryKey wrapper for the given HKEY constant.
 */
function predefinedKey(hkey, name) {
  return new RegistryKey(hkey, name);
}
/**
 * The static Registry class which is the primary entry point for working
 * with the Windows registry.
 */
export class Registry {
  /** Returns the key for `HKEY_CLASSES_ROOT`. */
  static get HKCR() {
    return predefinedKey(HKEY_CLASSES_ROOT, "HKEY_CLASSES_ROOT");
  }
  /** Returns the key for `HKEY_CURRENT_USER`. */
  static get HKCU() {
    return predefinedKey(HKEY_CURRENT_USER, "HKEY_CURRENT_USER");
  }
  /** Returns the key for `HKEY_LOCAL_MACHINE`. */
  static get HKLM() {
    return predefinedKey(HKEY_LOCAL_MACHINE, "HKEY_LOCAL_MACHINE");
  }
  /** Returns the key for `HKEY_USERS`. */
  static get HKU() {
    return predefinedKey(HKEY_USERS, "HKEY_USERS");
  }
  /** Returns the key for `HKEY_PERFORMANCE_DATA`. */
  static get HKPD() {
    return predefinedKey(HKEY_PERFORMANCE_DATA, "HKEY_PERFORMANCE_DATA");
  }
  /** Returns the key for `HKEY_CURRENT_CONFIG`. */
  static get HKCC() {
    return predefinedKey(HKEY_CURRENT_CONFIG, "HKEY_CURRENT_CONFIG");
  }
  static openKey(arg1, arg2, arg3) {
    if (typeof arg1 === "string") {
      // openKey(path, access?)
      const { hkey, subKey } = parseRegistryPath(arg1);
      const access = arg2 ?? Rights.READ;
      const handle = _backend.openKey(hkey, subKey, access);
      return new RegistryKey(handle, arg1);
    }
    // openKey(key, path, access?)
    const parent = arg1;
    const path = arg2;
    const access = arg3 ?? Rights.READ;
    return parent.openKey(path, access);
  }
  static createKey(arg1, arg2, arg3) {
    if (typeof arg1 === "string") {
      const { hkey, subKey } = parseRegistryPath(arg1);
      const access = arg2 ?? Rights.ALL_ACCESS;
      const result = _backend.createKey(hkey, subKey, access);
      return new RegistryKey(result.handle, arg1, result.created);
    }
    const parent = arg1;
    const path = arg2;
    const access = arg3 ?? Rights.ALL_ACCESS;
    return parent.createKey(path, access);
  }
  static deleteKey(arg1, arg2) {
    if (typeof arg1 === "string") {
      const { hkey, subKey } = parseRegistryPath(arg1);
      const status = _backend.deleteKey(hkey, subKey);
      if (status !== 0) {
        throw new Error(
          `Failed to delete registry key "${arg1}" with error code ${status}`,
        );
      }
      return;
    }
    const parent = arg1;
    const path = arg2;
    if (!parent.deleteKey(path)) {
      throw new Error(`Failed to delete registry key "${path}"`);
    }
  }
}
