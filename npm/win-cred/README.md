# @frostyeti/win-cred

## Overview

Cross-runtime Windows Credential Manager module that works with Deno, Bun, and
Node.js. Each runtime uses its own FFI mechanism to call the Win32 advapi32.dll
credential functions directly -- no child processes or native addons required
(except `koffi` for Node.js).

| Runtime | FFI mechanism                |
| ------- | ---------------------------- |
| Deno    | `Deno.dlopen` (built-in FFI) |
| Bun     | `bun:ffi` `dlopen`           |
| Node.js | `koffi` (npm package)        |

![logo](https://raw.githubusercontent.com/frostyeti/js/refs/heads/master/eng/assets/logo.png)

[![JSR](https://jsr.io/badges/@frostyeti/win-cred)](https://jsr.io/@frostyeti/win-cred)
[![npm version](https://badge.fury.io/js/@frostyeti%2Fwin-cred.svg)](https://badge.fury.io/js/@frostyeti%2Fwin-cred)

## Documentation

Documentation is available on [jsr.io](https://jsr.io/@frostyeti/win-cred/doc)

A list of other modules can be found at
[github.com/frostyeti/js](https://github.com/frostyeti/js)

## Installation

```bash
# Deno
deno add jsr:@frostyeti/win-cred

# npm from jsr
npx jsr add @frostyeti/win-cred

# from npmjs.org (Node.js also needs koffi)
npm install @frostyeti/win-cred
npm install koffi
```

## Quick Start

```typescript
import { decodeSecret, WinCred } from "@frostyeti/win-cred";

// Write a credential
WinCred.write({
  targetName: "myapp/api-token",
  secret: "my-secret-value",
  userName: "myuser",
});

// Read it back
const secret = WinCred.readSecret("myapp/api-token");
console.log(secret); // "my-secret-value"

// Read full credential object
const cred = WinCred.read("myapp/api-token");
if (cred) {
  console.log(cred.userName);
  console.log(decodeSecret(cred.credentialBlob));
}

// Enumerate credentials
const all = WinCred.enumerate("myapp/*");
for (const c of all) {
  console.log(c.targetName);
}

// Delete a credential
WinCred.delete("myapp/api-token");
```

## API Reference

### Functions

| Function                        | Description                                      |
| ------------------------------- | ------------------------------------------------ |
| `write(options)`                | Write a credential to Windows Credential Manager |
| `read(targetName, type?)`       | Read a credential by target name                 |
| `readSecret(targetName, type?)` | Read and decode the secret value directly        |
| `delete(targetName, type?)`     | Delete a credential                              |
| `enumerate(filter, flags?)`     | Enumerate credentials matching a filter          |
| `encodeSecret(secret)`          | Encode a string to UTF-16 bytes for storage      |
| `decodeSecret(blob)`            | Decode UTF-16 bytes to a string                  |

### Types

| Type                 | Description                                |
| -------------------- | ------------------------------------------ |
| `WriteOptions`       | Options for writing a credential           |
| `Credential`         | Full credential object with decoded values |
| `RawCredential`      | Raw credential with byte arrays            |
| `CredType`           | Credential type enum                       |
| `CredPersist`        | Persistence level enum                     |
| `CredEnumerateFlags` | Enumeration flags                          |

## Permissions

- **Deno**: requires `--allow-ffi`.
- **Bun**: `bun:ffi` is used automatically.
- **Node.js**: requires the `koffi` npm package to be installed.

## License

[MIT License](./LICENSE.md)
