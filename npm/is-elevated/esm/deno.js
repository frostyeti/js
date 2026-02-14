import { globals, WINDOWS } from "@frostyeti/globals";
let elevated;
let evalIsProcessElevated = function (cache = true) {
  if (!cache || elevated === undefined) {
    elevated = globals.Deno.uid() === 0;
  }
  return elevated;
};
if (WINDOWS) {
  const advapi32 = globals.Deno.dlopen("Advapi32.dll", {
    OpenProcessToken: {
      parameters: ["pointer", "u32", "pointer"],
      result: "bool",
    },
    GetTokenInformation: {
      parameters: ["u64", "u32", "pointer", "u32", "pointer"],
      result: "bool",
    },
  });
  const kernel32 = globals.Deno.dlopen("Kernel32.dll", {
    GetCurrentProcess: {
      parameters: [],
      result: "pointer",
    },
    CloseHandle: {
      parameters: ["pointer"],
      result: "bool",
    },
    GetLastError: { parameters: [], result: "i32" },
  });
  evalIsProcessElevated = function (cache = true) {
    if (cache && elevated !== undefined) {
      return elevated;
    }
    // TOKEN_QUERY = 0x0008
    const TOKEN_QUERY = 0x0008;
    // Get the current process handle
    const processHandle = kernel32.symbols.GetCurrentProcess();
    // Create a buffer for the token handle
    const tokenHandle = new BigUint64Array(1);
    const tokenHandlePtr = globals.Deno.UnsafePointer.of(tokenHandle);
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
        globals.Deno.UnsafePointer.of(tokenInfo),
        4,
        globals.Deno.UnsafePointer.of(returnLength),
      );
      if (!result) {
        const error = kernel32.symbols.GetLastError();
        throw new Error(`Failed to get token information ${error}`);
      }
      // First 4 bytes contain the elevation status
      elevated = tokenInfo[0] !== 0;
      return elevated;
    } finally {
      // Clean up the handle
      kernel32.symbols.CloseHandle(tokenHandlePtr);
    }
  };
}
export { evalIsProcessElevated };
