/**
 * ## Overview
 *
 * The secrets module provides a secret generator and a secret masker.
 *
 * The secret generator uses a cryptographic random number generator (csrng)
 * defaults to NIST requirements e.g length > 8, 1 upper, 1 lower, 1 digit, and
 * 1 special character.
 *
 * The secret masker works by adding secrets and variants to the masker and then it
 * will replace the secret with '*********' which is useful to protect secrets
 * from logs or CI/CD standard output.
 *
 * ![logo](https://raw.githubusercontent.com/frostyeti/js/refs/heads/main/.eng/assets/logo.png)
 *
 * [![JSR](https://jsr.io/badges/@frostyeti/secrets)](https://jsr.io/@frostyeti/secrets)
 * [![npm version](https://badge.fury.io/js/@frostyeti%2Fsecrets.svg)](https://badge.fury.io/js/@frostyeti%2Fsecrets)
 * [![GitHub version](https://badge.fury.io/gh/frostyeti%2Fjs-frostyeti.svg)](https://badge.fury.io/gh/frostyeti%2Fjs-frostyeti)
 *
 * ## Documentation
 *
 * Documentation is available on [jsr.io](https://jsr.io/@frostyeti/secrets/doc)
 *
 * A list of other modules can be found at [github.com/frostyeti/js](https://github.com/frostyeti/js)
 *
 * ## Usage
 *
 * ```typescript
 * import { DefaultSecretGenerator, secretMasker } from "@frostyeti/secrets";
 * import { equal } from "@frostyeti/assert"
 *
 * // secret generator / password generator
 * const generator = new DefaultSecretGenerator();
 * generator.addDefaults();
 *
 * console.log(generator.generate()); // csrng generated secret 16 chars
 * console.log(generator.generate(30)); // csrng generated secret 30 chars
 *
 * // secret masker
 * const masker = secretMasker;
 * masker.addGenerator((secret: string) => {
 *     return secret.toUpperCase();
 * });
 *
 * masker.add("super secret");
 * masker.add("another secret");
 * equal(masker.mask("super secret"), "*******");
 * equal(masker.mask("SUPER SECRET"), "*******");
 * equal(masker.mask("another secret"), "*******");
 * equal(masker.mask("ANOTHER SECRET"), "*******");
 * ```
 *
 * ## License
 *
 * [MIT License](./LICENSE.md)
 *
 * @module
 */
export * from "./generator.js";
export * from "./masker.js";
