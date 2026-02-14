import { MachineRole, ProductEdition, ProductType } from "./types.js";
import { globals } from "@frostyeti/globals/globals";
import process from "node:process";
const { createRequire } = process.getBuiltinModule("node:module");
const require = createRequire(import.meta.url ?? "file:///");
let _backend = null;
export function setBackend(backend) {
  _backend = backend;
}
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
// ── Display name generation ─────────────────────────────────────────────────
/**
 * Maps well-known build numbers to Windows 10/11 version display names.
 */
function buildToDisplayVersion(build, isServer) {
  if (isServer) {
    // Windows Server versions
    if (build >= 26100) {
      return "Windows Server 2025";
    }
    if (build >= 20348) {
      return "Windows Server 2022";
    }
    if (build >= 17763) {
      return "Windows Server 2019";
    }
    if (build >= 14393) {
      return "Windows Server 2016";
    }
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
function getEditionSuffix(edition) {
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
function buildDisplayName(version, productEdition, isServer) {
  const base = buildToDisplayVersion(version.buildNumber, isServer);
  const suffix = getEditionSuffix(productEdition);
  return suffix ? `${base} ${suffix}` : base;
}
function buildVariant(productType, machineRole) {
  if (
    productType === ProductType.DOMAIN_CONTROLLER ||
    machineRole === MachineRole.PRIMARY_DC ||
    machineRole === MachineRole.BACKUP_DC
  ) {
    return "Domain Controller";
  }
  if (productType === ProductType.SERVER) {
    return "Server";
  }
  return "Workstation";
}
function buildCodeName(build, isServer) {
  if (isServer) {
    if (build >= 26100) {
      return "server2025";
    }
    if (build >= 20348) {
      return "server2022";
    }
    if (build >= 17763) {
      return "server2019";
    }
    if (build >= 14393) {
      return "server2016";
    }
    return "server";
  }
  if (build >= 22000) {
    return "win11";
  }
  if (build >= 10240) {
    return "win10";
  }
  return "windows";
}
function formatOsRelease(displayName, variant, codeName) {
  return [
    "ID=windows",
    'NAME="Windows"',
    `PRETTY_NAME=\"${displayName}\"`,
    `VARIANT=\"${variant}\"`,
    `VERSION_CODENAME=\"${codeName}\"`,
  ].join("\n");
}
function buildOsReleaseLike(displayName, variant, codeName) {
  return {
    id: "windows",
    name: "Windows",
    prettyName: displayName,
    variant,
    codeName,
  };
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
  static getVersion() {
    return _backend.getVersion();
  }
  /**
   * Get the product edition code via `GetProductInfo`.
   *
   * @param version Optional version info to use. If not provided,
   *                calls `getVersion()` automatically.
   * @returns A `ProductEdition` code.
   */
  static getProductEdition(version) {
    const v = version ?? _backend.getVersion();
    return _backend.getProductInfo(
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
  static getDomainInfo() {
    return _backend.getDomainInfo();
  }
  /**
   * Returns `true` if the OS is a server edition.
   */
  static isServer() {
    const v = _backend.getVersion();
    return v.productType === ProductType.SERVER ||
      v.productType === ProductType.DOMAIN_CONTROLLER;
  }
  /**
   * Returns `true` if the machine is a domain controller.
   */
  static isDomainController() {
    const v = _backend.getVersion();
    if (v.productType === ProductType.DOMAIN_CONTROLLER) {
      return true;
    }
    // Also check via DsRole for more precision
    const d = _backend.getDomainInfo();
    return d.machineRole === MachineRole.PRIMARY_DC ||
      d.machineRole === MachineRole.BACKUP_DC;
  }
  /**
   * Returns `true` if the OS is a workstation/desktop edition.
   */
  static isWorkstation() {
    const v = _backend.getVersion();
    return v.productType === ProductType.WORKSTATION;
  }
  /**
   * Returns `true` if the machine is joined to a domain.
   */
  static isDomainJoined() {
    const d = _backend.getDomainInfo();
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
  static getOsRelease() {
    const version = _backend.getVersion();
    const productEdition = _backend.getProductInfo(
      version.majorVersion,
      version.minorVersion,
      version.servicePackMajor,
      version.servicePackMinor,
    );
    const domain = _backend.getDomainInfo();
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
  /**
   * Get a Windows-flavored `/etc/os-release`-style string.
   *
   * @returns A newline-delimited string with ID/NAME/PRETTY_NAME/VARIANT/VERSION_CODENAME.
   */
  static getOsReleaseText() {
    const version = _backend.getVersion();
    const productEdition = _backend.getProductInfo(
      version.majorVersion,
      version.minorVersion,
      version.servicePackMajor,
      version.servicePackMinor,
    );
    const domain = _backend.getDomainInfo();
    const isServer = version.productType === ProductType.SERVER ||
      version.productType === ProductType.DOMAIN_CONTROLLER;
    const displayName = buildDisplayName(version, productEdition, isServer);
    const variant = buildVariant(version.productType, domain.machineRole);
    const codeName = buildCodeName(version.buildNumber, isServer);
    return formatOsRelease(displayName, variant, codeName);
  }
  /**
   * Get Windows-flavored `/etc/os-release` values as a JSON-friendly object.
   */
  static getOsReleaseJson() {
    const version = _backend.getVersion();
    const productEdition = _backend.getProductInfo(
      version.majorVersion,
      version.minorVersion,
      version.servicePackMajor,
      version.servicePackMinor,
    );
    const domain = _backend.getDomainInfo();
    const isServer = version.productType === ProductType.SERVER ||
      version.productType === ProductType.DOMAIN_CONTROLLER;
    const displayName = buildDisplayName(version, productEdition, isServer);
    const variant = buildVariant(version.productType, domain.machineRole);
    const codeName = buildCodeName(version.buildNumber, isServer);
    return buildOsReleaseLike(displayName, variant, codeName);
  }
}
