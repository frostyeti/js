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
import type { Key, KeyInfo } from "./types.js";
import { Types } from "./types.js";
/**
 * Concrete implementation of the `Key` interface backed by a native HKEY handle.
 */
export declare class RegistryKey implements Key {
  #private;
  constructor(handle: bigint, path: string, created?: boolean);
  get path(): string;
  get created(): boolean;
  isNull(): boolean;
  unwrap(): bigint;
  close(): void;
  [Symbol.dispose](): void;
  openKey(path: string, access?: number): Key;
  createKey(path: string, access?: number): Key;
  deleteKey(name: string): boolean;
  deleteValue(name: string): boolean;
  stat(): KeyInfo;
  getSubKeyNames(n?: number): string[];
  getValueNames(n?: number): string[];
  getValue(name: string, buffer?: Uint8Array): {
    data: Uint8Array;
    type: number;
  };
  getString(name: string): string;
  getMultiString(name: string): string[];
  getInt32(name: string): number;
  getInt64(name: string): bigint;
  getBinary(name: string): Uint8Array;
  setValue(name: string, data: Uint8Array, type: Types): void;
  setString(name: string, value: string): void;
  setExpandString(name: string, value: string): void;
  setMultiString(name: string, value: string[]): void;
  setBinary(name: string, data: Uint8Array): void;
  setInt32(name: string, value: number): void;
  setInt64(name: string, value: bigint): void;
}
/**
 * The static Registry class which is the primary entry point for working
 * with the Windows registry.
 */
export declare class Registry {
  /** Returns the key for `HKEY_CLASSES_ROOT`. */
  static get HKCR(): Key;
  /** Returns the key for `HKEY_CURRENT_USER`. */
  static get HKCU(): Key;
  /** Returns the key for `HKEY_LOCAL_MACHINE`. */
  static get HKLM(): Key;
  /** Returns the key for `HKEY_USERS`. */
  static get HKU(): Key;
  /** Returns the key for `HKEY_PERFORMANCE_DATA`. */
  static get HKPD(): Key;
  /** Returns the key for `HKEY_CURRENT_CONFIG`. */
  static get HKCC(): Key;
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
}
