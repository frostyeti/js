// @deno-types="npm:@types/bun@^1.3.8"
import { dlopen, FFIType, ptr } from "bun:ffi";
import { WINDOWS } from "@frostyeti/globals";
import process from "node:process";
let elevated;
let evalIsProcessElevated = function (cache = true) {
  if (cache && elevated !== undefined) {
    return elevated;
  }
  elevated = process.getuid && process.getuid() === 0;
  return elevated === true;
};
if (WINDOWS) {
  const advapi32 = dlopen("Advapi32.dll", {
    OpenProcessToken: {
      args: [FFIType.ptr, FFIType.u32, FFIType.ptr],
      returns: FFIType.bool,
    },
    GetTokenInformation: {
      args: [FFIType.u64, FFIType.u32, FFIType.ptr, FFIType.u32, FFIType.ptr],
      returns: FFIType.bool,
    },
  });
  const kernel32 = dlopen("Kernel32.dll", {
    GetCurrentProcess: {
      args: [],
      returns: FFIType.ptr,
    },
    CloseHandle: {
      args: [FFIType.ptr],
      returns: FFIType.bool,
    },
    GetLastError: {
      args: [],
      returns: FFIType.i32,
    },
  });
  evalIsProcessElevated = function (cache = true) {
    if (cache && elevated !== undefined) {
      return elevated;
    }
    // TOKEN_QUERY = 0x0008
    const TOKEN_QUERY = 0x0008;
    // Get the current process handle
    const processHandle = kernel32.symbols.GetCurrentProcess();
    // Create a buffer for the token handle (8 bytes for 64-bit pointer)
    const tokenHandle = new BigUint64Array(1);
    const tokenHandlePtr = ptr(tokenHandle);
    // Try to open the process token
    const success = advapi32.symbols.OpenProcessToken(
      processHandle,
      TOKEN_QUERY,
      tokenHandlePtr,
    );
    if (!success) {
      throw new Error("Failed to open process token");
    }
    try {
      // Get token elevation information
      const TOKEN_ELEVATION = 20;
      const tokenInfo = new Uint8Array(4);
      const returnLength = new Uint32Array(1);
      const result = advapi32.symbols.GetTokenInformation(
        tokenHandle[0],
        TOKEN_ELEVATION,
        ptr(tokenInfo),
        4,
        ptr(returnLength),
      );
      if (!result) {
        const error = kernel32.symbols.GetLastError();
        throw new Error(`Failed to get token information ${error}`);
      }
      // First byte contains the elevation status
      elevated = tokenInfo[0] !== 0;
      return elevated;
    } finally {
      // Clean up the handle
      kernel32.symbols.CloseHandle(tokenHandlePtr);
    }
  };
}
export { evalIsProcessElevated };
