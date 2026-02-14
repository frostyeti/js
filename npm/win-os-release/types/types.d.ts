/**
 * Shared types, enums, constants, and backend interface for the
 * Windows OS Release detection module.
 *
 * @module
 */
/**
 * The product type reported by the OS.
 * Corresponds to `VER_NT_*` constants from `winnt.h`.
 */
export declare enum ProductType {
  /** The OS is a workstation (desktop) edition. */
  WORKSTATION = 1,
  /** The OS is a domain controller. */
  DOMAIN_CONTROLLER = 2,
  /** The OS is a server (but not a domain controller). */
  SERVER = 3,
}
/**
 * Machine role as reported by `DsRoleGetPrimaryDomainInformation`.
 * Corresponds to `DSROLE_MACHINE_ROLE` enum values.
 */
export declare enum MachineRole {
  /** Standalone workstation. */
  STANDALONE_WORKSTATION = 0,
  /** Member workstation (joined to a domain). */
  MEMBER_WORKSTATION = 1,
  /** Standalone server. */
  STANDALONE_SERVER = 2,
  /** Member server (joined to a domain). */
  MEMBER_SERVER = 3,
  /** Primary domain controller (backup DC). */
  BACKUP_DC = 4,
  /** Primary domain controller. */
  PRIMARY_DC = 5,
}
/**
 * Suite mask flags from `OSVERSIONINFOEXW.wSuiteMask`.
 */
export declare enum SuiteMask {
  SMALLBUSINESS = 1,
  ENTERPRISE = 2,
  BACKOFFICE = 4,
  TERMINAL = 16,
  SMALLBUSINESS_RESTRICTED = 32,
  EMBEDDEDNT = 64,
  DATACENTER = 128,
  SINGLEUSERTS = 256,
  PERSONAL = 512,
  BLADE = 1024,
  STORAGE_SERVER = 8192,
  COMPUTE_SERVER = 16384,
  WH_SERVER = 32768,
  MULTIUSERTS = 131072,
}
/**
 * A selection of common product edition constants returned by `GetProductInfo`.
 *
 * See the full list in the Windows SDK header `winnt.h`.
 */
export declare enum ProductEdition {
  UNDEFINED = 0,
  ULTIMATE = 1,
  HOME_BASIC = 2,
  HOME_PREMIUM = 3,
  ENTERPRISE = 4,
  HOME_BASIC_N = 5,
  BUSINESS = 6,
  STANDARD_SERVER = 7,
  DATACENTER_SERVER = 8,
  SMALLBUSINESS_SERVER = 9,
  ENTERPRISE_SERVER = 10,
  STARTER = 11,
  DATACENTER_SERVER_CORE = 12,
  STANDARD_SERVER_CORE = 13,
  ENTERPRISE_SERVER_CORE = 14,
  WEB_SERVER = 17,
  CLUSTER_SERVER = 18,
  HOME_SERVER = 19,
  STORAGE_EXPRESS_SERVER = 20,
  STORAGE_STANDARD_SERVER = 21,
  STORAGE_WORKGROUP_SERVER = 22,
  STORAGE_ENTERPRISE_SERVER = 23,
  SERVER_FOR_SMALLBUSINESS = 24,
  PROFESSIONAL = 48,
  PROFESSIONAL_N = 49,
  SOLUTION_SERVER = 50,
  ESSENTIALS_SERVER = 59,
  CORE = 101,
  CORE_N = 98,
  CORE_SINGLELANGUAGE = 100,
  PROFESSIONAL_WMC = 103,
  EDUCATION = 121,
  EDUCATION_N = 122,
  ENTERPRISE_S = 125,
  ENTERPRISE_S_N = 126,
  PRO_WORKSTATION = 161,
  PRO_WORKSTATION_N = 162,
  PRO_FOR_EDUCATION = 164,
  DATACENTER_SERVER_AZURE = 167,
  STANDARD_SERVER_AZURE = 168,
  IOTUAP = 123,
  IOTENTERPRISE = 188,
  IOTENTERPRISE_S = 191,
}
/**
 * Version information returned by `RtlGetVersion`.
 */
export interface OsVersionInfo {
  /** Major version (e.g. 10 for Windows 10/11). */
  majorVersion: number;
  /** Minor version (e.g. 0). */
  minorVersion: number;
  /** Build number (e.g. 22631). */
  buildNumber: number;
  /** Platform ID (always 2 = VER_PLATFORM_WIN32_NT). */
  platformId: number;
  /** Service pack version string. */
  csdVersion: string;
  /** Service pack major version. */
  servicePackMajor: number;
  /** Service pack minor version. */
  servicePackMinor: number;
  /** Suite mask flags. */
  suiteMask: number;
  /** Product type: 1=Workstation, 2=DomainController, 3=Server. */
  productType: ProductType;
}
/**
 * Domain information returned by `DsRoleGetPrimaryDomainInformation`.
 */
export interface DomainInfo {
  /** Machine role. */
  machineRole: MachineRole;
  /** Flags (e.g. DS running, mixed mode, etc.). */
  flags: number;
  /** NetBIOS domain name. */
  domainNameFlat: string;
  /** DNS domain name (may be empty). */
  domainNameDns: string;
  /** Forest name (may be empty). */
  forestName: string;
}
/**
 * Complete OS release information combining all API results.
 */
export interface OsRelease {
  /** Version information from RtlGetVersion. */
  version: OsVersionInfo;
  /** Product edition code from GetProductInfo. */
  productEdition: number;
  /** Domain/role information from DsRoleGetPrimaryDomainInformation. */
  domain: DomainInfo;
  /** `true` if the OS is a server edition. */
  isServer: boolean;
  /** `true` if the machine is a domain controller. */
  isDomainController: boolean;
  /** `true` if the OS is a workstation/desktop edition. */
  isWorkstation: boolean;
  /** Human-readable display name (e.g. "Windows 11 Pro"). */
  displayName: string;
}
/**
 * Windows-flavored `/etc/os-release`-style values.
 */
export interface OsReleaseLike extends Record<string, string | undefined> {
  /** OS identifier (e.g. "windows"). */
  id: string;
  /** OS name (e.g. "Windows"). */
  name: string;
  /** Pretty name including edition (e.g. "Windows 11 Pro"). */
  prettyName: string;
  /** Variant (e.g. "Workstation", "Server", "Domain Controller"). */
  variant: string;
  /** Version codename (e.g. "win11", "server2022"). */
  codeName: string;
}
/**
 * The interface each FFI backend must implement.
 * @internal
 */
export interface OsReleaseBackend {
  /** Call RtlGetVersion and return parsed version info. */
  getVersion(): OsVersionInfo;
  /** Call GetProductInfo and return the product edition code. */
  getProductInfo(
    majorVersion: number,
    minorVersion: number,
    spMajor: number,
    spMinor: number,
  ): number;
  /** Call DsRoleGetPrimaryDomainInformation and return domain info. */
  getDomainInfo(): DomainInfo;
}
