# @frostyeti/secrets

## Overview

A cryptographically secure secret generation and masking library for protecting
sensitive information. The secret generator creates random passwords meeting
NIST SP 800-63B requirements, while the secret masker protects sensitive data in
logs and output.

![logo](https://raw.githubusercontent.com/frostyeti/js/refs/heads/master/eng/assets/logo.png)

[![JSR](https://jsr.io/badges/@frostyeti/secrets)](https://jsr.io/@frostyeti/secrets)
[![npm version](https://badge.fury.io/js/@frostyeti%2Fsecrets.svg)](https://badge.fury.io/js/@frostyeti%2Fsecrets)
[![GitHub version](https://badge.fury.io/gh/frostyeti%2Fjs.svg)](https://badge.fury.io/gh/frostyeti%2Fjs)

## Documentation

Documentation is available on [jsr.io](https://jsr.io/@frostyeti/secrets/doc)

## Installation

```bash
# Deno
deno add jsr:@frostyeti/secrets

# npm from jsr
npx jsr add @frostyeti/secrets

# from npmjs.org
npm install @frostyeti/secrets
```

## Quick Start

```typescript
import { generateSecret, secretMasker } from "@frostyeti/secrets";

// Generate a secure password
const password = generateSecret(16);
console.log(password); // e.g., "aB3#dE5&gH7*jK9@"

// Mask secrets in output
secretMasker.add(password);
console.log(secretMasker.mask(`Password is: ${password}`));
// Output: "Password is: *******"
```

## API Reference

### Classes

| Class                    | Description                                       |
| ------------------------ | ------------------------------------------------- |
| `DefaultSecretGenerator` | Generates cryptographically secure random secrets |
| `DefaultSecretMasker`    | Masks sensitive information in strings            |

### Secret Generation

| Function/Method                  | Description                                       |
| -------------------------------- | ------------------------------------------------- |
| `generateSecret(length, chars?)` | Generate a secret with optional custom characters |
| `secretGenerator`                | Pre-configured global generator instance          |
| `validate(data)`                 | Validate if data meets NIST password requirements |

```typescript
import {
  DefaultSecretGenerator,
  generateSecret,
  secretGenerator,
} from "@frostyeti/secrets";

// Quick generation with defaults
const secret = generateSecret(16);

// Using the global generator
const password = secretGenerator.generate(20);

// Custom generator with specific character sets
const generator = new DefaultSecretGenerator()
  .addLower()
  .addUpper()
  .addDigits()
  .addSpecialSafe();

const customSecret = generator.generate(24);
```

### Generator Methods

| Method                         | Description                                    |
| ------------------------------ | ---------------------------------------------- |
| `add(chars)`                   | Add custom characters to the pool              |
| `addDefaults()`                | Add standard alphanumeric + special characters |
| `addLower()`                   | Add lowercase letters (a-z)                    |
| `addUpper()`                   | Add uppercase letters (A-Z)                    |
| `addDigits()`                  | Add digits (0-9)                               |
| `addSpecial()`                 | Add all special characters                     |
| `addSpecialSafe()`             | Add safe special characters (`_-#@~*:{}        |
| `generate(length)`             | Generate secret as string                      |
| `generateAsUint8Array(length)` | Generate secret as bytes                       |
| `setValidator(fn)`             | Set custom validation function                 |

### Secret Masking

| Function/Method    | Description                                  |
| ------------------ | -------------------------------------------- |
| `secretMasker`     | Pre-configured global masker instance        |
| `add(value)`       | Add a secret string or regex pattern to mask |
| `addGenerator(fn)` | Add a function to generate secret variants   |
| `mask(value)`      | Replace all secrets in value with `*******`  |

```typescript
import { DefaultSecretMasker, secretMasker } from "@frostyeti/secrets";

// Using the global masker
secretMasker.add("api-key-12345");
secretMasker.addGenerator((s) => s.toUpperCase()); // Also mask uppercase variants

console.log(secretMasker.mask("Token: api-key-12345"));
// Output: "Token: *******"

// Custom masker for isolated usage
const masker = new DefaultSecretMasker()
  .add("password123")
  .add(/api[_-]?key[=:]\w+/gi) // Regex patterns
  .addGenerator((s) => s.toLowerCase());

const log = "Connecting with password123 and API_KEY=secret";
console.log(masker.mask(log));
// Output: "Connecting with ******* and *******"
```

### Validation

```typescript
import { validate } from "@frostyeti/secrets";

// Check if password meets NIST requirements
const data = new TextEncoder().encode("aB1!");
console.log(validate(data)); // true - has lower, upper, digit, special

const weak = new TextEncoder().encode("password");
console.log(validate(weak)); // false - missing digit and special
```

## Real-World Examples

### Protecting CI/CD Logs

```typescript
import { secretMasker } from "@frostyeti/secrets";

// Register all secrets at startup
secretMasker.add(process.env.API_KEY);
secretMasker.add(process.env.DATABASE_PASSWORD);
secretMasker.addGenerator((s) => s.toUpperCase());
secretMasker.addGenerator((s) => Buffer.from(s).toString("base64"));

// Wrap console output
const originalLog = console.log;
console.log = (...args) => {
  originalLog(
    ...args.map((arg) =>
      typeof arg === "string" ? secretMasker.mask(arg) : arg
    ),
  );
};
```

### Generating Database Passwords

```typescript
import { DefaultSecretGenerator } from "@frostyeti/secrets";

const generator = new DefaultSecretGenerator()
  .addLower()
  .addUpper()
  .addDigits()
  .add("_-#@"); // Limited special chars for DB compatibility

const dbPassword = generator.generate(32);
```

## License

[MIT License](./LICENSE.md)
