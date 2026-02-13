/**
 * Node.js FFI backend for Windows OS release detection using Koffi.
 *
 * Uses `koffi` (npm package) to bind to ntdll.dll, kernel32.dll, and netapi32.dll.
 * @module
 * @internal
 */
import type { DomainInfo, OsReleaseBackend, OsVersionInfo } from "./types.ts";
import { MachineRole, ProductType } from "./types.ts";

// deno-lint-ignore no-explicit-any
let koffi: any;
try {
    // deno-lint-ignore no-explicit-any
    const g = globalThis as any;
    const req = g.require ?? (g.process?.mainModule?.require);

    if (req) {
        koffi = req("koffi");
    } else {
        // deno-lint-ignore no-explicit-any
        const nodeModule = await (Function('return import("node:module")')() as Promise<any>);
        const createRequire = nodeModule.createRequire ?? nodeModule.default?.createRequire;
        if (createRequire) {
            const require = createRequire(import.meta.url ?? "file:///");
            koffi = require("koffi");
        } else {
            // deno-lint-ignore no-explicit-any
            const mod = await (Function('return import("koffi")')() as Promise<any>);
            koffi = mod.default ?? mod;
        }
    }
} catch {
    throw new Error(
        "The 'koffi' package is required for Node.js OS release support. " +
            "Install it with: npm install koffi",
    );
}

// ── Struct definitions ──────────────────────────────────────────────────────

const OSVERSIONINFOEXW = koffi.struct("OSVERSIONINFOEXW", {
    dwOSVersionInfoSize: "uint32",
    dwMajorVersion: "uint32",
    dwMinorVersion: "uint32",
    dwBuildNumber: "uint32",
    dwPlatformId: "uint32",
    szCSDVersion: koffi.array("char16_t", 128),
    wServicePackMajor: "uint16",
    wServicePackMinor: "uint16",
    wSuiteMask: "uint16",
    wProductType: "uint8",
    wReserved: "uint8",
});

const DSROLE_PRIMARY_DOMAIN_INFO_BASIC = koffi.struct("DSROLE_PRIMARY_DOMAIN_INFO_BASIC", {
    MachineRole: "uint32",
    Flags: "uint32",
    DomainNameFlat: "char16_t *",
    DomainNameDns: "char16_t *",
    DomainForestName: "char16_t *",
    DomainGuidData1: "uint32",
    DomainGuidData2: "uint16",
    DomainGuidData3: "uint16",
    DomainGuidData4: koffi.array("uint8", 8),
});

const PDSROLE_INFO = koffi.pointer(DSROLE_PRIMARY_DOMAIN_INFO_BASIC);

// ── Load DLLs ───────────────────────────────────────────────────────────────

const ntdll = koffi.load("ntdll.dll");
const k32 = koffi.load("kernel32.dll");
const netapi32 = koffi.load("netapi32.dll");

const RtlGetVersion = ntdll.func(
    "int32 __stdcall RtlGetVersion(_Inout_ OSVERSIONINFOEXW *lpVersionInformation)",
);

const GetProductInfo = k32.func(
    "int __stdcall GetProductInfo(uint32 dwOSMajorVersion, uint32 dwOSMinorVersion, uint32 dwSpMajorVersion, uint32 dwSpMinorVersion, _Out_ uint32 *pdwReturnedProductType)",
);

const DsRoleGetPrimaryDomainInformation = netapi32.func(
    "uint32 __stdcall DsRoleGetPrimaryDomainInformation(void *lpServer, uint32 InfoLevel, _Out_ void **Buffer)",
);

const DsRoleFreeMemory = netapi32.func(
    "void __stdcall DsRoleFreeMemory(void *Buffer)",
);

export const backend: OsReleaseBackend = {
    getVersion(): OsVersionInfo {
        const info = {
            dwOSVersionInfoSize: koffi.sizeof(OSVERSIONINFOEXW),
            dwMajorVersion: 0,
            dwMinorVersion: 0,
            dwBuildNumber: 0,
            dwPlatformId: 0,
            szCSDVersion: new Array(128).fill("\0"),
            wServicePackMajor: 0,
            wServicePackMinor: 0,
            wSuiteMask: 0,
            wProductType: 0,
            wReserved: 0,
        };

        const status = RtlGetVersion(info);
        if (status !== 0) {
            throw new Error(`RtlGetVersion failed with NTSTATUS ${status}`);
        }

        // Convert szCSDVersion array to string
        let csdVersion = "";
        if (Array.isArray(info.szCSDVersion)) {
            csdVersion = info.szCSDVersion.join("").replace(/\0+$/, "");
        } else if (typeof info.szCSDVersion === "string") {
            csdVersion = info.szCSDVersion.replace(/\0+$/, "");
        }

        return {
            majorVersion: info.dwMajorVersion,
            minorVersion: info.dwMinorVersion,
            buildNumber: info.dwBuildNumber,
            platformId: info.dwPlatformId,
            csdVersion,
            servicePackMajor: info.wServicePackMajor,
            servicePackMinor: info.wServicePackMinor,
            suiteMask: info.wSuiteMask,
            productType: info.wProductType as ProductType,
        };
    },

    getProductInfo(
        majorVersion: number,
        minorVersion: number,
        spMajor: number,
        spMinor: number,
    ): number {
        const outArr = [0];
        GetProductInfo(majorVersion, minorVersion, spMajor, spMinor, outArr);
        return outArr[0];
    },

    getDomainInfo(): DomainInfo {
        const outArr = [null];

        const err = DsRoleGetPrimaryDomainInformation(null, 1, outArr);
        if (err !== 0) {
            return {
                machineRole: MachineRole.STANDALONE_WORKSTATION,
                flags: 0,
                domainNameFlat: "",
                domainNameDns: "",
                forestName: "",
            };
        }

        try {
            const info = koffi.decode(outArr[0], DSROLE_PRIMARY_DOMAIN_INFO_BASIC);
            return {
                machineRole: info.MachineRole as MachineRole,
                flags: info.Flags,
                domainNameFlat: info.DomainNameFlat ?? "",
                domainNameDns: info.DomainNameDns ?? "",
                forestName: info.DomainForestName ?? "",
            };
        } finally {
            if (outArr[0]) {
                DsRoleFreeMemory(outArr[0]);
            }
        }
    },
};
