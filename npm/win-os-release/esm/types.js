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
export var ProductType;
(function (ProductType) {
  /** The OS is a workstation (desktop) edition. */
  ProductType[ProductType["WORKSTATION"] = 1] = "WORKSTATION";
  /** The OS is a domain controller. */
  ProductType[ProductType["DOMAIN_CONTROLLER"] = 2] = "DOMAIN_CONTROLLER";
  /** The OS is a server (but not a domain controller). */
  ProductType[ProductType["SERVER"] = 3] = "SERVER";
})(ProductType || (ProductType = {}));
// ── Machine role (from DsRoleGetPrimaryDomainInformation) ───────────────────
/**
 * Machine role as reported by `DsRoleGetPrimaryDomainInformation`.
 * Corresponds to `DSROLE_MACHINE_ROLE` enum values.
 */
export var MachineRole;
(function (MachineRole) {
  /** Standalone workstation. */
  MachineRole[MachineRole["STANDALONE_WORKSTATION"] = 0] =
    "STANDALONE_WORKSTATION";
  /** Member workstation (joined to a domain). */
  MachineRole[MachineRole["MEMBER_WORKSTATION"] = 1] = "MEMBER_WORKSTATION";
  /** Standalone server. */
  MachineRole[MachineRole["STANDALONE_SERVER"] = 2] = "STANDALONE_SERVER";
  /** Member server (joined to a domain). */
  MachineRole[MachineRole["MEMBER_SERVER"] = 3] = "MEMBER_SERVER";
  /** Primary domain controller (backup DC). */
  MachineRole[MachineRole["BACKUP_DC"] = 4] = "BACKUP_DC";
  /** Primary domain controller. */
  MachineRole[MachineRole["PRIMARY_DC"] = 5] = "PRIMARY_DC";
})(MachineRole || (MachineRole = {}));
// ── Suite mask flags ────────────────────────────────────────────────────────
/**
 * Suite mask flags from `OSVERSIONINFOEXW.wSuiteMask`.
 */
export var SuiteMask;
(function (SuiteMask) {
  SuiteMask[SuiteMask["SMALLBUSINESS"] = 1] = "SMALLBUSINESS";
  SuiteMask[SuiteMask["ENTERPRISE"] = 2] = "ENTERPRISE";
  SuiteMask[SuiteMask["BACKOFFICE"] = 4] = "BACKOFFICE";
  SuiteMask[SuiteMask["TERMINAL"] = 16] = "TERMINAL";
  SuiteMask[SuiteMask["SMALLBUSINESS_RESTRICTED"] = 32] =
    "SMALLBUSINESS_RESTRICTED";
  SuiteMask[SuiteMask["EMBEDDEDNT"] = 64] = "EMBEDDEDNT";
  SuiteMask[SuiteMask["DATACENTER"] = 128] = "DATACENTER";
  SuiteMask[SuiteMask["SINGLEUSERTS"] = 256] = "SINGLEUSERTS";
  SuiteMask[SuiteMask["PERSONAL"] = 512] = "PERSONAL";
  SuiteMask[SuiteMask["BLADE"] = 1024] = "BLADE";
  SuiteMask[SuiteMask["STORAGE_SERVER"] = 8192] = "STORAGE_SERVER";
  SuiteMask[SuiteMask["COMPUTE_SERVER"] = 16384] = "COMPUTE_SERVER";
  SuiteMask[SuiteMask["WH_SERVER"] = 32768] = "WH_SERVER";
  SuiteMask[SuiteMask["MULTIUSERTS"] = 131072] = "MULTIUSERTS";
})(SuiteMask || (SuiteMask = {}));
// ── Common PRODUCT_* constants from GetProductInfo ──────────────────────────
/**
 * A selection of common product edition constants returned by `GetProductInfo`.
 *
 * See the full list in the Windows SDK header `winnt.h`.
 */
export var ProductEdition;
(function (ProductEdition) {
  ProductEdition[ProductEdition["UNDEFINED"] = 0] = "UNDEFINED";
  ProductEdition[ProductEdition["ULTIMATE"] = 1] = "ULTIMATE";
  ProductEdition[ProductEdition["HOME_BASIC"] = 2] = "HOME_BASIC";
  ProductEdition[ProductEdition["HOME_PREMIUM"] = 3] = "HOME_PREMIUM";
  ProductEdition[ProductEdition["ENTERPRISE"] = 4] = "ENTERPRISE";
  ProductEdition[ProductEdition["HOME_BASIC_N"] = 5] = "HOME_BASIC_N";
  ProductEdition[ProductEdition["BUSINESS"] = 6] = "BUSINESS";
  ProductEdition[ProductEdition["STANDARD_SERVER"] = 7] = "STANDARD_SERVER";
  ProductEdition[ProductEdition["DATACENTER_SERVER"] = 8] = "DATACENTER_SERVER";
  ProductEdition[ProductEdition["SMALLBUSINESS_SERVER"] = 9] =
    "SMALLBUSINESS_SERVER";
  ProductEdition[ProductEdition["ENTERPRISE_SERVER"] = 10] =
    "ENTERPRISE_SERVER";
  ProductEdition[ProductEdition["STARTER"] = 11] = "STARTER";
  ProductEdition[ProductEdition["DATACENTER_SERVER_CORE"] = 12] =
    "DATACENTER_SERVER_CORE";
  ProductEdition[ProductEdition["STANDARD_SERVER_CORE"] = 13] =
    "STANDARD_SERVER_CORE";
  ProductEdition[ProductEdition["ENTERPRISE_SERVER_CORE"] = 14] =
    "ENTERPRISE_SERVER_CORE";
  ProductEdition[ProductEdition["WEB_SERVER"] = 17] = "WEB_SERVER";
  ProductEdition[ProductEdition["CLUSTER_SERVER"] = 18] = "CLUSTER_SERVER";
  ProductEdition[ProductEdition["HOME_SERVER"] = 19] = "HOME_SERVER";
  ProductEdition[ProductEdition["STORAGE_EXPRESS_SERVER"] = 20] =
    "STORAGE_EXPRESS_SERVER";
  ProductEdition[ProductEdition["STORAGE_STANDARD_SERVER"] = 21] =
    "STORAGE_STANDARD_SERVER";
  ProductEdition[ProductEdition["STORAGE_WORKGROUP_SERVER"] = 22] =
    "STORAGE_WORKGROUP_SERVER";
  ProductEdition[ProductEdition["STORAGE_ENTERPRISE_SERVER"] = 23] =
    "STORAGE_ENTERPRISE_SERVER";
  ProductEdition[ProductEdition["SERVER_FOR_SMALLBUSINESS"] = 24] =
    "SERVER_FOR_SMALLBUSINESS";
  ProductEdition[ProductEdition["PROFESSIONAL"] = 48] = "PROFESSIONAL";
  ProductEdition[ProductEdition["PROFESSIONAL_N"] = 49] = "PROFESSIONAL_N";
  ProductEdition[ProductEdition["SOLUTION_SERVER"] = 50] = "SOLUTION_SERVER";
  ProductEdition[ProductEdition["ESSENTIALS_SERVER"] = 59] =
    "ESSENTIALS_SERVER";
  ProductEdition[ProductEdition["CORE"] = 101] = "CORE";
  ProductEdition[ProductEdition["CORE_N"] = 98] = "CORE_N";
  ProductEdition[ProductEdition["CORE_SINGLELANGUAGE"] = 100] =
    "CORE_SINGLELANGUAGE";
  ProductEdition[ProductEdition["PROFESSIONAL_WMC"] = 103] = "PROFESSIONAL_WMC";
  ProductEdition[ProductEdition["EDUCATION"] = 121] = "EDUCATION";
  ProductEdition[ProductEdition["EDUCATION_N"] = 122] = "EDUCATION_N";
  ProductEdition[ProductEdition["ENTERPRISE_S"] = 125] = "ENTERPRISE_S";
  ProductEdition[ProductEdition["ENTERPRISE_S_N"] = 126] = "ENTERPRISE_S_N";
  ProductEdition[ProductEdition["PRO_WORKSTATION"] = 161] = "PRO_WORKSTATION";
  ProductEdition[ProductEdition["PRO_WORKSTATION_N"] = 162] =
    "PRO_WORKSTATION_N";
  ProductEdition[ProductEdition["PRO_FOR_EDUCATION"] = 164] =
    "PRO_FOR_EDUCATION";
  ProductEdition[ProductEdition["DATACENTER_SERVER_AZURE"] = 167] =
    "DATACENTER_SERVER_AZURE";
  ProductEdition[ProductEdition["STANDARD_SERVER_AZURE"] = 168] =
    "STANDARD_SERVER_AZURE";
  ProductEdition[ProductEdition["IOTUAP"] = 123] = "IOTUAP";
  ProductEdition[ProductEdition["IOTENTERPRISE"] = 188] = "IOTENTERPRISE";
  ProductEdition[ProductEdition["IOTENTERPRISE_S"] = 191] = "IOTENTERPRISE_S";
})(ProductEdition || (ProductEdition = {}));
