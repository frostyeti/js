import { MachineRole } from "./types.js";
// @deno-types="npm:@types/bun@^1.3.8"
import { dlopen, ptr, read } from "bun:ffi";
const ntdll = dlopen("ntdll.dll", {
  RtlGetVersion: {
    args: ["ptr"],
    returns: "i32",
  },
});
const kernel32 = dlopen("kernel32.dll", {
  GetProductInfo: {
    args: ["u32", "u32", "u32", "u32", "ptr"],
    returns: "i32",
  },
});
const netapi32 = dlopen("netapi32.dll", {
  DsRoleGetPrimaryDomainInformation: {
    args: ["ptr", "u32", "ptr"],
    returns: "u32",
  },
  DsRoleFreeMemory: {
    args: ["ptr"],
    returns: "void",
  },
});
// ── OSVERSIONINFOEXW struct layout ──────────────────────────────────────────
const SIZEOF_OSVERSIONINFOEXW = 284;
const OFF_MAJOR = 4;
const OFF_MINOR = 8;
const OFF_BUILD = 12;
const OFF_PLATFORM = 16;
const OFF_CSD = 20;
const OFF_SP_MAJOR = 276;
const OFF_SP_MINOR = 278;
const OFF_SUITE = 280;
const OFF_PRODUCT_TYPE = 282;
// ── DSROLE struct offsets (x64) ─────────────────────────────────────────────
const DS_OFF_MACHINE_ROLE = 0;
const DS_OFF_FLAGS = 4;
const DS_OFF_DOMAIN_FLAT = 8;
const DS_OFF_DOMAIN_DNS = 16;
const DS_OFF_FOREST = 24;
/** Read a null-terminated UTF-16LE string from a native pointer. */
function readWideString(intPtr) {
  if (intPtr === 0) {
    return "";
  }
  const chars = [];
  for (let i = 0;; i += 2) {
    const lo = read.u8(intPtr, i);
    const hi = read.u8(intPtr, i + 1);
    if (lo === 0 && hi === 0) {
      break;
    }
    chars.push(lo | (hi << 8));
  }
  return String.fromCharCode(...chars);
}
export const backend = {
  getVersion() {
    const buf = new Uint8Array(SIZEOF_OSVERSIONINFOEXW);
    const view = new DataView(buf.buffer);
    view.setUint32(0, SIZEOF_OSVERSIONINFOEXW, true);
    const status = ntdll.symbols.RtlGetVersion(ptr(buf));
    if (status !== 0) {
      throw new Error(`RtlGetVersion failed with NTSTATUS ${status}`);
    }
    // deno-lint-ignore no-explicit-any
    const csdDecoder = new TextDecoder("utf-16le");
    let csdEnd = OFF_CSD + 256;
    for (let i = OFF_CSD; i < OFF_CSD + 256 - 1; i += 2) {
      if (buf[i] === 0 && buf[i + 1] === 0) {
        csdEnd = i;
        break;
      }
    }
    const csdVersion = csdDecoder.decode(buf.subarray(OFF_CSD, csdEnd));
    return {
      majorVersion: view.getUint32(OFF_MAJOR, true),
      minorVersion: view.getUint32(OFF_MINOR, true),
      buildNumber: view.getUint32(OFF_BUILD, true),
      platformId: view.getUint32(OFF_PLATFORM, true),
      csdVersion,
      servicePackMajor: view.getUint16(OFF_SP_MAJOR, true),
      servicePackMinor: view.getUint16(OFF_SP_MINOR, true),
      suiteMask: view.getUint16(OFF_SUITE, true),
      productType: buf[OFF_PRODUCT_TYPE],
    };
  },
  getProductInfo(majorVersion, minorVersion, spMajor, spMinor) {
    const outBuf = new Uint8Array(4);
    kernel32.symbols.GetProductInfo(
      majorVersion,
      minorVersion,
      spMajor,
      spMinor,
      ptr(outBuf),
    );
    return new DataView(outBuf.buffer).getUint32(0, true);
  },
  getDomainInfo() {
    const outPtrBuf = new Uint8Array(8);
    const err = netapi32.symbols.DsRoleGetPrimaryDomainInformation(
      null, // local computer
      1, // DsRolePrimaryDomainInfoBasic
      ptr(outPtrBuf),
    );
    if (err !== 0) {
      return {
        machineRole: MachineRole.STANDALONE_WORKSTATION,
        flags: 0,
        domainNameFlat: "",
        domainNameDns: "",
        forestName: "",
      };
    }
    const infoPtr = Number(
      new DataView(outPtrBuf.buffer).getBigUint64(0, true),
    );
    try {
      return {
        machineRole: read.u32(infoPtr, DS_OFF_MACHINE_ROLE),
        flags: read.u32(infoPtr, DS_OFF_FLAGS),
        domainNameFlat: readWideString(infoPtr + DS_OFF_DOMAIN_FLAT),
        domainNameDns: readWideString(infoPtr + DS_OFF_DOMAIN_DNS),
        forestName: readWideString(infoPtr + DS_OFF_FOREST),
      };
    } finally {
      netapi32.symbols.DsRoleFreeMemory(infoPtr);
    }
  },
};
