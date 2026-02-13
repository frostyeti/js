# @frostyeti/is-process-elevated

## Overview

A cross-runtime utility to determine if the current process is running with
elevated privileges (root on Linux/macOS, Administrator on Windows).
Supports Deno, Bun, and Node.js with runtime-specific implementations.

![logo](https://raw.githubusercontent.com/frostyeti/js/refs/heads/master/eng/assets/logo.png)

[![JSR](https://jsr.io/badges/@frostyeti/is-process-elevated)](https://jsr.io/@frostyeti/is-process-elevated)
[![npm version](https://badge.fury.io/js/@frostyeti%2Fis-process-elevated.svg)](https://badge.fury.io/js/@frostyeti%2Fis-process-elevated)
[![GitHub version](https://badge.fury.io/gh/frostyeti%2Fjs.svg)](https://badge.fury.io/gh/frostyeti%2Fjs)

## Documentation

Documentation is available on [jsr.io](https://jsr.io/@frostyeti/is-process-elevated/doc)

A list of other modules can be found at [github.com/frostyeti/js](https://github.com/frostyeti/js)

## Installation

```bash
# Deno
deno add jsr:@frostyeti/is-process-elevated

# npm from jsr
npx jsr add @frostyeti/is-process-elevated

# from npmjs.org
npm install @frostyeti/is-process-elevated
```

## Quick Start

```typescript
import { isProcessElevated } from "@frostyeti/is-process-elevated";

if (!isProcessElevated()) {
    console.error("Please run this script with sudo or as Administrator");
    process.exit(1);
}

// Perform privileged operations...
```

## API Reference

### Functions

| Function | Description |
|----------|-------------|
| `isProcessElevated(cache?)` | Returns `true` if the process has elevated privileges |

### `isProcessElevated(cache?: boolean): boolean`

Determines if the current process is running with elevated privileges.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `cache` | `boolean` | `true` | Whether to use cached result. Set to `false` to force re-evaluation |

**Returns:** `boolean` - `true` if elevated, `false` otherwise

**Throws:** `Error` - On Windows with Deno/Bun, throws if it fails to query process token

## Usage Examples

### Basic Usage

```typescript
import { isProcessElevated } from "@frostyeti/is-process-elevated";

const elevated = isProcessElevated();
console.log(`Running as ${elevated ? "admin/root" : "normal user"}`);
```

### Guard Privileged Operations

```typescript
import { isProcessElevated } from "@frostyeti/is-process-elevated";

function installSystemService() {
    if (!isProcessElevated()) {
        throw new Error("Installing system services requires admin privileges");
    }

    // Install service...
}
```

### Force Re-evaluation

```typescript
import { isProcessElevated } from "@frostyeti/is-process-elevated";

// First call evaluates and caches the result
console.log(isProcessElevated()); // true or false

// Subsequent calls use the cached value
console.log(isProcessElevated()); // same result, no re-evaluation

// Force re-evaluation by passing false
console.log(isProcessElevated(false)); // re-checks elevation status
```

### Conditional Behavior

```typescript
import { isProcessElevated } from "@frostyeti/is-process-elevated";

const configPath = isProcessElevated()
    ? "/etc/myapp/config.json"      // System-wide config
    : "~/.config/myapp/config.json"; // User config

console.log(`Using config: ${configPath}`);
```

## Platform Behavior

### Linux & macOS

Checks if the process is running as root by verifying if the user ID (UID) is 0.

```typescript
// Equivalent to checking: process.getuid() === 0
```

### Windows

The implementation varies by runtime:

| Runtime | Method |
|---------|--------|
| **Deno** | Uses FFI to call Windows APIs (`Advapi32.dll`, `Kernel32.dll`) to query token elevation |
| **Bun** | Uses FFI to call Windows APIs (`Advapi32.dll`, `Kernel32.dll`) to query token elevation |
| **Node.js** | Executes `net session` command (elevated processes can run this without error) |

## Notes

- The result is cached by default for performance. Use `cache: false` to force re-evaluation.
- On unsupported runtimes (browsers, etc.), the function returns `false`.
- The Windows FFI implementation queries `TOKEN_ELEVATION` from the process token.

## License

[MIT License](./LICENSE.md)
