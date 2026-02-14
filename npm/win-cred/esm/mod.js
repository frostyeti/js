/**
 * ## Overview
 *
 * Cross-runtime Windows Credential Manager module that works with
 * Deno, Bun, and Node.js. Each runtime uses its own FFI mechanism to
 * call the Win32 advapi32.dll credential functions directly -- no
 * child processes or native addons required (except `koffi` for Node.js).
 *
 * | Runtime | FFI mechanism |
 * | ------- | ----------------------------- |
 * | Deno | `Deno.dlopen` (built-in FFI) |
 * | Bun | `bun:ffi` `dlopen` |
 * | Node.js | `koffi` (npm package) |
 *
 * The correct backend is loaded automatically based on the detected
 * runtime. Only the code for the current runtime is imported.
 *
 * ![logo](https://raw.githubusercontent.com/frostyeti/js/refs/heads/master/eng/assets/logo.png)
 *
 * [![JSR](https://jsr.io/badges/@frostyeti/win-cred)](https://jsr.io/@frostyeti/win-cred)
 *
 * ## Installation
 *
 * ```bash
 * # Deno
 * deno add jsr:@frostyeti/win-cred
 *
 * # npm from jsr
 * npx jsr add @frostyeti/win-cred
 *
 * # from npmjs.org (Node.js also needs koffi)
 * npm install @frostyeti/win-cred
 * npm install koffi
 * ```
 *
 * ## Usage
 *
 * ```typescript
 * import { WinCred, decodeSecret } from "@frostyeti/win-cred";
 *
 * // Write a credential
 * WinCred.write({
 *     targetName: "myapp/api-token",
 *     secret: "my-secret-value",
 *     userName: "myuser",
 * });
 *
 * // Read it back
 * const secret = WinCred.readSecret("myapp/api-token");
 * console.log(secret); // "my-secret-value"
 *
 * // Read full credential object
 * const cred = WinCred.read("myapp/api-token");
 * if (cred) {
 *     console.log(cred.userName);
 *     console.log(decodeSecret(cred.credentialBlob));
 * }
 *
 * // Enumerate credentials
 * const all = WinCred.enumerate("myapp/*");
 * for (const c of all) {
 *     console.log(c.targetName);
 * }
 *
 * // Delete a credential
 * WinCred.delete("myapp/api-token");
 * ```
 *
 * ## Permissions
 *
 * - **Deno**: requires `--allow-ffi`.
 * - **Bun**: `bun:ffi` is used automatically.
 * - **Node.js**: requires the `koffi` npm package to be installed.
 *
 * ## License
 *
 * [MIT License](./LICENSE.md)
 *
 * @module
 */
export { decodeSecret, encodeSecret, WinCred } from "./credential.js";
export {
  CredEnumerateFlags,
  CredPersist,
  CredType,
  CredWriteFlags,
} from "./types.js";
