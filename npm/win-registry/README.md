# @frostyeti/win-registry

## Overview

Windows Registry helpers and a small I/O facade for reading/writing registry
keys and values from JavaScript. Provides a `Registry` class and `RegistryKey`
wrapper that call into native Win32 APIs via FFI on supported runtimes (Deno,
Bun, Node.js).

![logo](https://raw.githubusercontent.com/frostyeti/js/refs/heads/master/eng/assets/logo.png)

[![JSR](https://jsr.io/badges/@frostyeti/win-registry)](https://jsr.io/@frostyeti/win-registry)

## Features

- Read/write `SZ`, `EXPAND_SZ`, `MULTI_SZ`, `BINARY`, `DWORD`, `QWORD`
- Enumerate subkeys and values
- Open/create/delete keys
- Cross-runtime FFI backends: Deno (`Deno.dlopen`), Bun (`bun:ffi`), Node
  (`koffi`)

## Installation

```bash
# Deno
deno add jsr:@frostyeti/win-registry

# npm from jsr
npx jsr add @frostyeti/win-registry

# from npmjs.org (Node.js also needs koffi)
npm install @frostyeti/win-registry
npm install koffi
```

## Quick start

```ts
import { Registry } from "@frostyeti/win-registry";

const key = Registry.HKCU.openKey("Console" /* Rights.READ */);
console.log(key.getSubKeyNames());

// create, set and read back
const k = Registry.createKey("HKCU\\Software\\my-app");
k.setString("Greeting", "hello");
console.log(k.getString("Greeting"));
Registry.deleteKey("HKCU\\Software\\my-app");
```

## Examples

### Set & get different value types

```ts
// create a temporary key under HKCU
const k = Registry.createKey("HKCU\\Software\\my-app-examples");
try {
  // String (REG_SZ)
  k.setString("Greeting", "Hello, world");
  console.log(k.getString("Greeting")); // "Hello, world"

  // Expandable string (REG_EXPAND_SZ)
  k.setExpandString("PathWithEnv", "%USERPROFILE%\\bin");
  console.log(k.getString("PathWithEnv"));

  // Multi-string (REG_MULTI_SZ)
  k.setMultiString("SearchPaths", ["C:\\Windows", "C:\\Program Files"]);
  console.log(k.getMultiString("SearchPaths"));

  // Binary
  k.setBinary("Blob", new Uint8Array([1, 2, 3]));
  console.log(k.getBinary("Blob"));

  // 32-bit integer (REG_DWORD)
  k.setInt32("Flags", 0x11223344);
  console.log(k.getInt32("Flags"));

  // 64-bit integer (REG_QWORD)
  k.setInt64("Timeout", 1234567890123n);
  console.log(k.getInt64("Timeout"));
} finally {
  // cleanup
  Registry.deleteKey("HKCU\\Software\\my-app-examples");
}
```

### Resource management — `using` vs `try/finally`

`RegistryKey` implements the disposal protocol (`[Symbol.dispose]()`). If your
runtime/transpiler supports the `using` statement you can rely on it for
automatic cleanup — otherwise prefer an explicit `try`/`finally`.

```ts
// Preferred (portable): explicit finally ensures handle is closed everywhere
const k = Registry.createKey("HKCU\\Software\\my-app");
try {
  k.setString("Demo", "value");
  console.log(k.getString("Demo"));
} finally {
  k.close();
}

// If your environment supports `using` / Symbol.dispose (experimental):
// @ts-ignore - using is an optional/experimental feature in some runtimes
if (typeof Symbol !== "undefined" && Symbol.dispose) {
  // @ts-ignore - `using` may be unsupported in your TS/JS toolchain
  using (const k2 = Registry.createKey("HKCU\\Software\\my-app")) {
    k2.setString("Demo", "value");
    console.log(k2.getString("Demo"));
  }
}
```

### Enumerating subkeys and values

```ts
const root = Registry.HKLM.openKey("SOFTWARE\\SomeVendor");
for (const name of root.getSubKeyNames()) {
  console.log("subkey:", name);
}
for (const v of root.getValueNames()) {
  console.log("value:", v);
}
```

### Error handling & permissions

- Many registry operations require appropriate rights (use `Rights` flags).
- Deno requires `--allow-ffi`. Node.js FFI backends may require native
  dependencies (e.g. `koffi`).

---

## API (high level)

- `Registry.HKCU`, `Registry.HKLM`, `Registry.HKCR`, ... — predefined hives
- `Registry.openKey(path)` / `Registry.openKey(parentKey, subPath)`
- `Registry.createKey(...)`, `Registry.deleteKey(...)`
- `RegistryKey.getString`, `getInt32`, `getMultiString`, `setString`, etc.

See inline documentation in the source for full details and examples.

## Permissions

- **Deno**: requires `--allow-ffi` to use the FFI backend
- **Bun**: `bun:ffi` is used automatically
- **Node.js**: requires `koffi` installed as a peer dependency

## License

[MIT](./LICENSE.md)
