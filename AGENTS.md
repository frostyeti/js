# Agent Guidelines for @frostyeti/js

This document provides guidelines for working with the @frostyeti/js codebase.

## Project Structure

```
js/
├── jsr/          # JSR packages (Deno-first, published to jsr.io)
├── npm/          # NPM packages (transpiled from jsr)
├── eng/          # Build and release tooling
└── bin/          # CLI tools
```

## Testing

### Test Framework

- Use `node:test` for all tests
- Test files are named `*.test.ts` and co-located with the module they test
- Assertions come from `@frostyeti/assert`

### Test Imports

```typescript
import { test } from "node:test";
import { equal, ok, fail } from "@frostyeti/assert";
```

### Test Naming Convention

Use the format `module::function description`:

```typescript
test("strings::capitalize capitalizes first letter", () => {
    // ...
});
```

### Skipping Tests

Use the `skip` option in the test to skip tests on certain platforms:

```typescript
// Skip on non-Windows
test("win-cred::WinCred.write creates a credential", { skip: !WINDOWS }, async () => {
    // Windows-only test code
});
```

### Platform Detection

Use constants from `@frostyeti/globals/os`:

```typescript
import { WINDOWS, LINUX, DARWIN } from "@frostyeti/globals/os";
import { globals } from "@frostyeti/globals";

// Or check manually:
const WINDOWS = (globals.Deno && globals.Deno.build.os === "windows") ||
    (globals.process && globals.process.platform === "win32");
```

### Running Tests

```bash
# Run all tests in a module
deno test --allow-ffi --allow-env --allow-sys jsr/win-cred/

# Run a specific test file
deno test path/to/module.test.ts
```

Note: Some modules require `--allow-ffi` for FFI testing, `--allow-env` for environment access, and `--allow-sys` for system calls.

### Test Organization

Group tests with comment headers:

```typescript
// =============================================================================
// Basic functionality
// =============================================================================

test("module::function does something", () => {
    // ...
});

// =============================================================================
// Edge cases
// =============================================================================

test("module::function handles empty input", () => {
    // ...
});
```

## Code Style

### General Guidelines

- Use TypeScript for all code
- Prefer JSR-style exports (`export { ... } from "./module.ts"`)
- Use explicit type annotations where helpful
- Add JSDoc comments for public APIs
- No comments unless explicitly requested

### Module Structure

Each module should have:
- `mod.ts` - Main entry point with exports and documentation
- `*.ts` - Implementation files
- `*.test.ts` - Test files (co-located)
- `types.ts` - Type definitions (if needed)
- `deno.json` - Package manifest

### Imports

```typescript
// Relative imports for same package
import { something } from "./module.ts";

// JSR imports for external packages
import { something } from "@frostyeti/assert";
import { WINDOWS } from "@frostyeti/globals/os";
```

## Documentation

### README.md

Each module should have a README.md with:
- Overview
- Installation instructions
- Usage examples
- API reference table
- License reference

### JSDoc

Use JSDoc for:
- Module-level documentation (`@module`)
- Public function documentation
- Type documentation
- Example usage in docstrings

```typescript
/**
 * Encode a string secret to a `Uint8Array` suitable for `credentialBlob`.
 * Uses UTF-16 LE encoding to match typical Windows credential conventions.
 */
export function encodeSecret(secret: string): Uint8Array {
    // ...
}
```

## Windows-Specific Code

### Platform Guards

Always guard Windows-specific code:

```typescript
import { WINDOWS } from "@frostyeti/globals/os";

if (WINDOWS) {
    // Windows-only code
}
```

### FFI Modules

For modules that use FFI (like win-cred):
- Use runtime detection to load the correct backend
- Test FFI functions with `{ skip: !WINDOWS }`
- Include non-FFI utility tests that run everywhere

#### Recommended: runtime-safe backend loader (no top-level await) 🔧

When a package must support FFI on more than one runtime, prefer a
synchronous, runtime-detection pattern that:

- does NOT use top-level `await` or dynamic `await import()` at module
  initialization time; and
- uses `require` (via `createRequire` / `process.getBuiltinModule`) so
  the same source can be compiled by `dnt` and resolve to `.js` in the
  npm package.

Why: this keeps the public API synchronous, avoids per-runtime
initialization races, and lets the transpiled npm package resolve the
correct compiled backend (`.js`) at runtime.

Example pattern (interface + static class + `require` loader):

```ts
// --- define the backend interface ------------------------------------------------
export interface FfiBackend {
  getVersion(): VersionInfo;
  getProductInfo(mj: number, mn: number, spMj: number, spMn: number): number;
  getDomainInfo(): DomainInfo;
}

// --- runtime-safe loader (no top-level await) -----------------------------------
import { globals } from "@frostyeti/globals/globals";
import process from "node:process";
const { createRequire } = process.getBuiltinModule("node:module");
const require = createRequire(import.meta.url ?? "file:///");

let _backend: FfiBackend | null = null;

if (globals.Bun !== undefined) {
    // this is done to avoid linting errors as dnt transforms .ts to .js
    const file = "./ffi_bun.js";
    const { backend } = require(file);
    _backend = backend;
} else if (globals.Deno !== undefined) {
    const { backend } = require("./ffi_deno.ts");
    _backend = backend;
} else {
    const file = "./ffi_node.js";
    const { backend } = require(file);
    _backend = backend;
}
// --- public, sync API via a static class ----------------------------------------
export class FfiFacade {
  // optional for swapping out for node.
  static setBackend(b: FfiBackend) { _backend: FfiBackend }
  static getVersion() { return _backend!.getVersion(); }
  static getProductEdition(v?: VersionInfo) {
    const ver = v ?? _backend!.getVersion();
    return _backend!.getProductInfo(ver.majorVersion, ver.minorVersion, ver.servicePackMajor, ver.servicePackMinor);
  }
}
```

Notes / best practices:
- Use js extension for bun and node `const file = './ffi_bun.js'; const { backend} = require(file);` in
  source as dnt does not transform .ts to .js for require functions.
- Do not use the ready/setBackend pattern.  

## Common Patterns

### Cross-Runtime Support

The codebase supports Deno, Bun, and Node.js. Use `@frostyeti/globals` for runtime detection:

```typescript
import { DENO, BUN, NODE } from "@frostyeti/globals/globals";

if (typeof globals.Bun !== 'undefined') {
    // Deno-specific code
} else if (typeof globals.Deno !== 'undefined') {
    // Bun-specific code
} else {
    // Node.js-specific code
}
```

### Environment Variables

Use `@frostyeti/env` for environment variable handling.

## Deno Workspaces

The project uses Deno workspaces (monorepos) to manage multiple related packages.

### Workspace Root

The Deno workspace root is `./jsr` (not the git repo root). This is where the root `deno.json` lives with the `workspace` property:

```json
{
  "workspace": ["./package-a", "./package-b"]
}
```

### Import Resolution

**You do NOT need to add imports to deno.json for child modules.** Deno automatically resolves bare specifiers for workspace members by matching the import to a package `name` defined in a workspace member's `deno.json`. For example:

```typescript
import { something } from "@frostyeti/my-package";
```

This works automatically if `@frostyeti/my-package` is defined in a workspace member's `deno.json` and that member is listed in the root workspace array.

**You also do NOT need to add an "imports" section to a child module's deno.json.** The workspace automatically resolves bare specifiers. For example:

```json
// DO NOT add this to child module deno.json - it will not work
{
  "imports": {
    "@frostyeti/globals": "npm:@frostyeti/globals"
  }
}
```

**Always use bare specifiers for workspace imports, never relative paths.** For example:

```typescript
// Correct - use bare specifier
import { globals } from "@frostyeti/globals";

// Incorrect - do NOT use relative paths
import { globals } from "../globals/globals.ts";
```

This ensures proper type checking and import resolution across the workspace.

### Running Commands

Run Deno commands from the **workspace root** (`./jsr`) or from a **child folder** of the workspace:

```bash
# Run from the jsr workspace root - runs tests in a specific member
cd jsr
deno test -A ./my-module/

# Or run from a child folder
cd jsr/my-module
deno test -A

# or
deno test --cwd ./jsr -A
```

Other commands work the same way:
- `deno check ./my-module/` - Type check a workspace member
- `deno fmt ./my-module/` - Format a workspace member
- `deno lint ./my-module/` - Lint a workspace member

### Tasks

Define tasks in `deno.json` at the workspace root or in individual members:

```bash
cd jsr
deno task build

# or 
deno task --cwd ./jsr build
```

## Testing Tips

1. **Test pure functions everywhere** - Functions like `encodeSecret`/`decodeSecret` can be tested on all platforms
2. **Skip platform-specific tests** - Use `{ skip: !WINDOWS }` for tests that call Windows APIs
3. **Clean up after tests** - Delete test credentials/files in `finally` blocks
4. **Use descriptive test names** - Clearly describe what is being tested
5. **Group related tests** - Use comment headers to organize test sections

## Development Workflow

### Standard Workflow for Making Changes

1. **Make changes in `jsr/<module>`** - This is the source of truth
2. **Run lint, fmt, and tests** on the jsr module:
   ```bash
   deno task lint <module>
   deno task fmt
   deno test --allow-ffi --allow-env --allow-sys jsr/<module>/
   ```
3. **Transform to npm** using dnt:
   ```bash
   deno task dnt <module>
   ```
   This runs deno's dnt tool which transforms the Deno module into a Node.js module and saves it under `npm/<module>`.

4. **Run Node.js and Bun tests** on the npm module:
   ```bash
   cd npm/<module>
   node --test
   bun test
   ```

### Mise and Tool Management

The project uses [mise](https://mise.jdx.dev/) for tool version management. The `mise.toml` file specifies required tools:

```toml
[tools]
node = '22'
bun = "latest"
deno = 'latest'
```

To find tool paths:
```bash
mise where bun   # e.g., C:\Users\dev\AppData\Local\mise\installs\bun\1.3.9
mise where node  # e.g., C:\Users\dev\AppData\Local\mise\installs\node\22.22.0
mise where deno
```

To install tools:
```bash
mise install
```

The dnt task may require bun to be installed for the npm package manager integration. The build system (eng/tasks/lib/tsc.ts) expects bun at:
- `C:\Users\dev\AppData\Local\mise\installs\bun\1.3.9\bin`
