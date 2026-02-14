/**
 * Deno FFI backend for Windows OS release detection.
 *
 * Uses `Deno.dlopen` to bind to ntdll.dll, kernel32.dll, and netapi32.dll.
 * @module
 * @internal
 */
import { globals } from "@frostyeti/globals/globals";
import { MachineRole } from "./types.js";
if (
  typeof globals.Deno === "undefined" ||
  typeof globals.Deno.dlopen !== "function"
) {
  throw new Error(
    "Deno.dlopen is not available. This module requires Deno with FFI support.",
  );
}
const Deno = globals.Deno;
const ntdll = Deno.dlopen("ntdll.dll", {
  RtlGetVersion: {
    parameters: ["buffer"],
    result: "i32",
  },
});
const kernel32 = Deno.dlopen("kernel32.dll", {
  GetProductInfo: {
    parameters: ["u32", "u32", "u32", "u32", "buffer"],
    result: "i32",
  },
});
const netapi32 = Deno.dlopen("netapi32.dll", {
  DsRoleGetPrimaryDomainInformation: {
    parameters: ["pointer", "u32", "buffer"],
    result: "u32",
  },
  DsRoleFreeMemory: {
    parameters: ["pointer"],
    result: "void",
  },
});
// ── OSVERSIONINFOEXW struct layout ──────────────────────────────────────────
const SIZEOF_OSVERSIONINFOEXW = 284;
const OFF_MAJOR = 4;
const OFF_MINOR = 8;
const OFF_BUILD = 12;
const OFF_PLATFORM = 16;
const OFF_CSD = 20; // 128 WCHARs = 256 bytes
const OFF_SP_MAJOR = 276;
const OFF_SP_MINOR = 278;
const OFF_SUITE = 280;
const OFF_PRODUCT_TYPE = 282;
// ── DSROLE_PRIMARY_DOMAIN_INFO_BASIC struct layout (x64) ────────────────────
const DS_OFF_MACHINE_ROLE = 0;
const DS_OFF_FLAGS = 4;
const DS_OFF_DOMAIN_FLAT = 8;
const DS_OFF_DOMAIN_DNS = 16;
const DS_OFF_FOREST = 24;
/** Read a null-terminated UTF-16 LE string from a raw pointer. */
function readWideString(ptr) {
  if (ptr === 0n) {
    return "";
  }
  const unsafePtr = Deno.UnsafePointer.create(ptr);
  if (unsafePtr === null) {
    return "";
  }
  const view = new Deno.UnsafePointerView(unsafePtr);
  const chars = [];
  for (let i = 0;; i += 2) {
    const lo = view.getUint8(i);
    const hi = view.getUint8(i + 1);
    if (lo === 0 && hi === 0) {
      break;
    }
    chars.push(lo | (hi << 8));
  }
  return String.fromCharCode(...chars);
}
/** Read raw bytes from a pointer. */
function readBytes(ptr, length) {
  if (ptr === 0n || length === 0) {
    return new Uint8Array(0);
  }
  const unsafePtr = Deno.UnsafePointer.create(ptr);
  if (unsafePtr === null) {
    return new Uint8Array(0);
  }
  const view = new Deno.UnsafePointerView(unsafePtr);
  const buf = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    buf[i] = view.getUint8(i);
  }
  return buf;
}
export const backend = {
  getVersion() {
    const buf = new Uint8Array(SIZEOF_OSVERSIONINFOEXW);
    const view = new DataView(buf.buffer);
    view.setUint32(0, SIZEOF_OSVERSIONINFOEXW, true); // dwOSVersionInfoSize
    const status = ntdll.symbols.RtlGetVersion(buf);
    if (status !== 0) {
      throw new Error(`RtlGetVersion failed with NTSTATUS ${status}`);
    }
    // Read CSD version string (128 WCHARs at offset 20)
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
      outBuf,
    );
    return new DataView(outBuf.buffer).getUint32(0, true);
  },
  getDomainInfo() {
    const outPtrBuf = new Uint8Array(8); // pointer to buffer
    const err = netapi32.symbols.DsRoleGetPrimaryDomainInformation(
      null, // local computer
      1, // DsRolePrimaryDomainInfoBasic
      outPtrBuf,
    );
    if (err !== 0) {
      // If the call fails, return a default standalone workstation
      return {
        machineRole: MachineRole.STANDALONE_WORKSTATION,
        flags: 0,
        domainNameFlat: "",
        domainNameDns: "",
        forestName: "",
      };
    }
    const ptrView = new DataView(outPtrBuf.buffer);
    const infoPtr = ptrView.getBigUint64(0, true);
    try {
      const infoBuf = readBytes(infoPtr, 48);
      const infoView = new DataView(
        infoBuf.buffer,
        infoBuf.byteOffset,
        infoBuf.byteLength,
      );
      return {
        machineRole: infoView.getUint32(DS_OFF_MACHINE_ROLE, true),
        flags: infoView.getUint32(DS_OFF_FLAGS, true),
        domainNameFlat: readWideString(
          infoView.getBigUint64(DS_OFF_DOMAIN_FLAT, true),
        ),
        domainNameDns: readWideString(
          infoView.getBigUint64(DS_OFF_DOMAIN_DNS, true),
        ),
        forestName: readWideString(infoView.getBigUint64(DS_OFF_FOREST, true)),
      };
    } finally {
      netapi32.symbols.DsRoleFreeMemory(Deno.UnsafePointer.create(infoPtr));
    }
  },
};
