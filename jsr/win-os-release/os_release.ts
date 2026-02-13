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
    OsVersionInfo,
} from "./types.ts";
import {
    MachineRole,
    ProductEdition,
    ProductType,
} from "./types.ts";

let _backend: OsReleaseBackend | null = null;

/**
 * Set the FFI backend used by `WinOsRelease`.
 * Called automatically by `mod.ts` after runtime detection.
 * @internal
 */
export function setBackend(b: OsReleaseBackend): void {
    _backend = b;
}

function getBackend(): OsReleaseBackend {
    if (!_backend) {
        throw new Error(
            "WinOsRelease backend not initialised. Import from " +
                "'@frostyeti/win-os-release' (mod.ts) which auto-detects the runtime, " +
                "or call setBackend() manually.",
        );
    }
    return _backend;
}

// ── Display name generation ─────────────────────────────────────────────────

/**
 * Maps well-known build numbers to Windows 10/11 version display names.
 */
function buildToDisplayVersion(build: number, isServer: boolean): string {
    if (isServer) {
        // Windows Server versions
        if (build >= 26100) return "Windows Server 2025";
        if (build >= 20348) return "Windows Server 2022";
        if (build >= 17763) return "Windows Server 2019";
        if (build >= 14393) return "Windows Server 2016";
        return "Windows Server";
    }

    // Windows 11 starts at build 22000
    if (build >= 22000) {
        return "Windows 11";
    }
    if (build >= 10240) {
        return "Windows 10";
    }
    return "Windows";
}

function getEditionSuffix(edition: number): string {
    switch (edition) {
        case ProductEdition.CORE:
        case ProductEdition.CORE_N:
        case ProductEdition.CORE_SINGLELANGUAGE:
            return "Home";
        case ProductEdition.PROFESSIONAL:
        case ProductEdition.PROFESSIONAL_N:
            return "Pro";
        case ProductEdition.PRO_WORKSTATION:
        case ProductEdition.PRO_WORKSTATION_N:
            return "Pro for Workstations";
        case ProductEdition.PRO_FOR_EDUCATION:
            return "Pro Education";
        case ProductEdition.EDUCATION:
        case ProductEdition.EDUCATION_N:
            return "Education";
        case ProductEdition.ENTERPRISE:
            return "Enterprise";
        case ProductEdition.ENTERPRISE_S:
        case ProductEdition.ENTERPRISE_S_N:
            return "Enterprise LTSC";
        case ProductEdition.STARTER:
            return "Starter";
        case ProductEdition.STANDARD_SERVER:
        case ProductEdition.STANDARD_SERVER_CORE:
        case ProductEdition.STANDARD_SERVER_AZURE:
            return "Standard";
        case ProductEdition.DATACENTER_SERVER:
        case ProductEdition.DATACENTER_SERVER_CORE:
        case ProductEdition.DATACENTER_SERVER_AZURE:
            return "Datacenter";
        case ProductEdition.ENTERPRISE_SERVER:
        case ProductEdition.ENTERPRISE_SERVER_CORE:
            return "Enterprise";
        case ProductEdition.WEB_SERVER:
            return "Web Server";
        case ProductEdition.ESSENTIALS_SERVER:
            return "Essentials";
        case ProductEdition.CLUSTER_SERVER:
            return "HPC Edition";
        case ProductEdition.IOTUAP:
        case ProductEdition.IOTENTERPRISE:
        case ProductEdition.IOTENTERPRISE_S:
            return "IoT Enterprise";
        case ProductEdition.HOME_BASIC:
        case ProductEdition.HOME_BASIC_N:
            return "Home Basic";
        case ProductEdition.HOME_PREMIUM:
            return "Home Premium";
        case ProductEdition.ULTIMATE:
            return "Ultimate";
        case ProductEdition.BUSINESS:
            return "Business";
        default:
            return "";
    }
}

function buildDisplayName(
    version: OsVersionInfo,
    productEdition: number,
    isServer: boolean,
): string {
    const base = buildToDisplayVersion(version.buildNumber, isServer);
    const suffix = getEditionSuffix(productEdition);
    return suffix ? `${base} ${suffix}` : base;
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Static class providing Windows OS release detection.
 */
export class WinOsRelease {
    /**
     * Get the OS version information via `RtlGetVersion`.
     *
     * @returns Version info including major, minor, build, product type.
     */
    static getVersion(): OsVersionInfo {
        return getBackend().getVersion();
    }

    /**
     * Get the product edition code via `GetProductInfo`.
     *
     * @param version Optional version info to use. If not provided,
     *                calls `getVersion()` automatically.
     * @returns A `ProductEdition` code.
     */
    static getProductEdition(version?: OsVersionInfo): number {
        const v = version ?? getBackend().getVersion();
        return getBackend().getProductInfo(
            v.majorVersion,
            v.minorVersion,
            v.servicePackMajor,
            v.servicePackMinor,
        );
    }

    /**
     * Get domain/role information via `DsRoleGetPrimaryDomainInformation`.
     *
     * @returns Domain info including machine role, domain names.
     */
    static getDomainInfo(): DomainInfo {
        return getBackend().getDomainInfo();
    }

    /**
     * Returns `true` if the OS is a server edition.
     */
    static isServer(): boolean {
        const v = getBackend().getVersion();
        return v.productType === ProductType.SERVER ||
            v.productType === ProductType.DOMAIN_CONTROLLER;
    }

    /**
     * Returns `true` if the machine is a domain controller.
     */
    static isDomainController(): boolean {
        const v = getBackend().getVersion();
        if (v.productType === ProductType.DOMAIN_CONTROLLER) return true;
        // Also check via DsRole for more precision
        const d = getBackend().getDomainInfo();
        return d.machineRole === MachineRole.PRIMARY_DC ||
            d.machineRole === MachineRole.BACKUP_DC;
    }

    /**
     * Returns `true` if the OS is a workstation/desktop edition.
     */
    static isWorkstation(): boolean {
        const v = getBackend().getVersion();
        return v.productType === ProductType.WORKSTATION;
    }

    /**
     * Returns `true` if the machine is joined to a domain.
     */
    static isDomainJoined(): boolean {
        const d = getBackend().getDomainInfo();
        return d.machineRole === MachineRole.MEMBER_WORKSTATION ||
            d.machineRole === MachineRole.MEMBER_SERVER ||
            d.machineRole === MachineRole.PRIMARY_DC ||
            d.machineRole === MachineRole.BACKUP_DC;
    }

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
    static getOsRelease(): OsRelease {
        const version = getBackend().getVersion();
        const productEdition = getBackend().getProductInfo(
            version.majorVersion,
            version.minorVersion,
            version.servicePackMajor,
            version.servicePackMinor,
        );
        const domain = getBackend().getDomainInfo();

        const isServer = version.productType === ProductType.SERVER ||
            version.productType === ProductType.DOMAIN_CONTROLLER;
        const isDomainController =
            version.productType === ProductType.DOMAIN_CONTROLLER ||
            domain.machineRole === MachineRole.PRIMARY_DC ||
            domain.machineRole === MachineRole.BACKUP_DC;

        return {
            version,
            productEdition,
            domain,
            isServer,
            isDomainController,
            isWorkstation: version.productType === ProductType.WORKSTATION,
            displayName: buildDisplayName(version, productEdition, isServer),
        };
    }
}
