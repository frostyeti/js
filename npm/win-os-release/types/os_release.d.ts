/**
 * High-level, runtime-agnostic Windows OS release detection facade.
 *
 * The `WinOsRelease` class provides static methods to query
 * version, edition, server/workstation/domain-controller status,
 * and domain membership of the running Windows installation.
 *
 * @module
 */
import type {
  DomainInfo,
  OsRelease,
  OsReleaseBackend,
  OsReleaseLike,
  OsVersionInfo,
} from "./types.js";
export declare function setBackend(backend: OsReleaseBackend): void;
/**
 * Static class providing Windows OS release detection.
 */
export declare class WinOsRelease {
  /**
   * Get the OS version information via `RtlGetVersion`.
   *
   * @returns Version info including major, minor, build, product type.
   */
  static getVersion(): OsVersionInfo;
  /**
   * Get the product edition code via `GetProductInfo`.
   *
   * @param version Optional version info to use. If not provided,
   *                calls `getVersion()` automatically.
   * @returns A `ProductEdition` code.
   */
  static getProductEdition(version?: OsVersionInfo): number;
  /**
   * Get domain/role information via `DsRoleGetPrimaryDomainInformation`.
   *
   * @returns Domain info including machine role, domain names.
   */
  static getDomainInfo(): DomainInfo;
  /**
   * Returns `true` if the OS is a server edition.
   */
  static isServer(): boolean;
  /**
   * Returns `true` if the machine is a domain controller.
   */
  static isDomainController(): boolean;
  /**
   * Returns `true` if the OS is a workstation/desktop edition.
   */
  static isWorkstation(): boolean;
  /**
   * Returns `true` if the machine is joined to a domain.
   */
  static isDomainJoined(): boolean;
  /**
   * Get the complete OS release information combining all API results.
   *
   * @returns A comprehensive `OsRelease` object.
   *
   * @example
   * ```typescript
   * const info = WinOsRelease.getOsRelease();
   * console.log(info.displayName);        // "Windows 11 Pro"
   * console.log(info.isServer);           // false
   * console.log(info.isDomainController); // false
   * console.log(info.version.buildNumber); // 22631
   * console.log(info.domain.machineRole); // 0 (STANDALONE_WORKSTATION)
   * ```
   */
  static getOsRelease(): OsRelease;
  /**
   * Get a Windows-flavored `/etc/os-release`-style string.
   *
   * @returns A newline-delimited string with ID/NAME/PRETTY_NAME/VARIANT/VERSION_CODENAME.
   */
  static getOsReleaseText(): string;
  /**
   * Get Windows-flavored `/etc/os-release` values as a JSON-friendly object.
   */
  static getOsReleaseJson(): OsReleaseLike;
}
