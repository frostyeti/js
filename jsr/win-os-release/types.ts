/**
 * Shared types, enums, constants, and backend interface for the
 * Windows OS Release detection module.
 *
 * @module
 */

// ── Product type (from OSVERSIONINFOEXW.wProductType) ───────────────────────

/**
 * The product type reported by the OS.
 * Corresponds to `VER_NT_*` constants from `winnt.h`.
 */
export enum ProductType {
    /** The OS is a workstation (desktop) edition. */
    WORKSTATION = 1,
    /** The OS is a domain controller. */
    DOMAIN_CONTROLLER = 2,
    /** The OS is a server (but not a domain controller). */
    SERVER = 3,
}

// ── Machine role (from DsRoleGetPrimaryDomainInformation) ───────────────────

/**
 * Machine role as reported by `DsRoleGetPrimaryDomainInformation`.
 * Corresponds to `DSROLE_MACHINE_ROLE` enum values.
 */
export enum MachineRole {
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

// ── Suite mask flags ────────────────────────────────────────────────────────

/**
 * Suite mask flags from `OSVERSIONINFOEXW.wSuiteMask`.
 */
export enum SuiteMask {
    SMALLBUSINESS = 0x0001,
    ENTERPRISE = 0x0002,
    BACKOFFICE = 0x0004,
    TERMINAL = 0x0010,
    SMALLBUSINESS_RESTRICTED = 0x0020,
    EMBEDDEDNT = 0x0040,
    DATACENTER = 0x0080,
    SINGLEUSERTS = 0x0100,
    PERSONAL = 0x0200,
    BLADE = 0x0400,
    STORAGE_SERVER = 0x2000,
    COMPUTE_SERVER = 0x4000,
    WH_SERVER = 0x8000,
    MULTIUSERTS = 0x00020000,
}

// ── Common PRODUCT_* constants from GetProductInfo ──────────────────────────

/**
 * A selection of common product edition constants returned by `GetProductInfo`.
 *
 * See the full list in the Windows SDK header `winnt.h`.
 */
export enum ProductEdition {
    UNDEFINED = 0x00000000,
    ULTIMATE = 0x00000001,
    HOME_BASIC = 0x00000002,
    HOME_PREMIUM = 0x00000003,
    ENTERPRISE = 0x00000004,
    HOME_BASIC_N = 0x00000005,
    BUSINESS = 0x00000006,
    STANDARD_SERVER = 0x00000007,
    DATACENTER_SERVER = 0x00000008,
    SMALLBUSINESS_SERVER = 0x00000009,
    ENTERPRISE_SERVER = 0x0000000A,
    STARTER = 0x0000000B,
    DATACENTER_SERVER_CORE = 0x0000000C,
    STANDARD_SERVER_CORE = 0x0000000D,
    ENTERPRISE_SERVER_CORE = 0x0000000E,
    WEB_SERVER = 0x00000011,
    CLUSTER_SERVER = 0x00000012,
    HOME_SERVER = 0x00000013,
    STORAGE_EXPRESS_SERVER = 0x00000014,
    STORAGE_STANDARD_SERVER = 0x00000015,
    STORAGE_WORKGROUP_SERVER = 0x00000016,
    STORAGE_ENTERPRISE_SERVER = 0x00000017,
    SERVER_FOR_SMALLBUSINESS = 0x00000018,
    PROFESSIONAL = 0x00000030,
    PROFESSIONAL_N = 0x00000031,
    SOLUTION_SERVER = 0x00000032,
    ESSENTIALS_SERVER = 0x0000003B,
    CORE = 0x00000065,
    CORE_N = 0x00000062,
    CORE_SINGLELANGUAGE = 0x00000064,
    PROFESSIONAL_WMC = 0x00000067,
    EDUCATION = 0x00000079,
    EDUCATION_N = 0x0000007A,
    ENTERPRISE_S = 0x0000007D,
    ENTERPRISE_S_N = 0x0000007E,
    PRO_WORKSTATION = 0x000000A1,
    PRO_WORKSTATION_N = 0x000000A2,
    PRO_FOR_EDUCATION = 0x000000A4,
    DATACENTER_SERVER_AZURE = 0x000000A7,
    STANDARD_SERVER_AZURE = 0x000000A8,
    IOTUAP = 0x0000007B,
    IOTENTERPRISE = 0x000000BC,
    IOTENTERPRISE_S = 0x000000BF,
}

// ── Public data types ───────────────────────────────────────────────────────

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

// ── Backend interface ───────────────────────────────────────────────────────

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
