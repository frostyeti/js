/**
 * The SecretGenerator module provides functionality for generating
 * cryptographically secure random secrets. It includes a default
 * secret generator and a validation function to ensure that
 * generated secrets meet specific criteria which defaults to
 * NIST SP 800-63B password requirements.
 *
 * @module
 */
/**
 * Validates whether the given data meets the password requirements.
 * The password must contain at least one digit, one uppercase letter,
 * one lowercase letter, and one special character.
 *
 * @description This function is used to validate the generated secrets
 * and defaults to the NIST SP 800-63B password requirements. The password
 * must contain at least one digit, one uppercase letter, one lowercase
 * letter, and one special character.
 *
 * @param data - The data to be validated as a Uint8Array.
 * @returns A boolean indicating whether the data meets the password requirements.
 */
export declare function validate(data: Uint8Array): boolean;
/**
 * Represents a secret generator.
 */
export interface SecretGenerator {
  /**
   * Sets a validator function for generated secrets.
   * @param validator - The validator function that takes a Uint8Array value and returns a boolean indicating whether the value is valid.
   */
  setValidator(validator: (value: Uint8Array) => boolean): void;
  /**
   * Adds a value to the secret generator.
   * @param value - The value to add.
   * @returns The updated SecretGenerator instance.
   */
  add(value: string): SecretGenerator;
  /**
   * Generates a secret of the specified length.
   * @param length - The length of the generated secret.
   * @returns The generated secret as a string.
   */
  generate(length: number): string;
  /**
   * Generates a secret as a Uint8Array of the specified length.
   * @param length - The length of the generated secret.
   * @returns The generated secret as a Uint8Array.
   */
  generateAsUint8Array(length: number): Uint8Array;
}
/**
 * Represents a default secret generator.
 */
export declare class DefaultSecretGenerator {
  #private;
  /**
   * Creates an instance of DefaultSecretGenerator.
   */
  constructor();
  /**
   * Sets a custom validator function for generated secrets.
   * @param validator - The validator function that takes a Uint8Array value and returns a boolean.
   * @returns The current instance of DefaultSecretGenerator.
   */
  setValidator(validator: (value: Uint8Array) => boolean): this;
  /**
   * Adds default characters to the secret generator.
   * @returns The current instance of DefaultSecretGenerator.
   */
  addDefaults(): this;
  /**
   * Adds digits (0-9) to the secret generator.
   * @returns The current instance of DefaultSecretGenerator.
   */
  addDigits(): this;
  /**
   * Adds lowercase letters (a-z) to the secret generator.
   * @returns The current instance of DefaultSecretGenerator.
   */
  addLower(): this;
  /**
   * Adds uppercase letters (A-Z) to the secret generator.
   * @returns The current instance of DefaultSecretGenerator.
   */
  addUpper(): this;
  /**
   * Adds special characters to the secret generator.
   * @description This includes characters like !@#$%^&*()_+-=[]{}|;':",.<>?/ and others.
   * @returns The current instance of DefaultSecretGenerator.
   */
  addSpecial(): this;
  /**
   * Adds a set of special characters to the secret generator.
   * @description This includes characters like _-#@~*:;|/ and others.
   * @returns The current instance of DefaultSecretGenerator.
   */
  addSpecialSafe(): this;
  /**
   * Adds characters to the secret generator.
   * @param value - The characters to be added.
   * @returns The current instance of DefaultSecretGenerator.
   */
  add(value: string): this;
  /**
   * Generates a secret as a Uint8Array.
   * @param length - The length of the secret to be generated.
   * @returns A Uint8Array representing the generated secret.
   * @throws InvalidOperationError if the secret generation fails.
   */
  generateAsUint8Array(length: number): Uint8Array;
  /**
   * Generates a secret as a string.
   * @param length - The length of the secret to be generated.
   * @returns A string representing the generated secret.
   * @throws InvalidOperationError if the secret generation fails.
   */
  generate(length: number): string;
}
/**
 * Generates a secret string of the specified length using the given characters.
 * If no characters are provided, the default character set will be used.
 *
 * @param length - The length of the secret string to generate.
 * @param characters - Optional. The characters to use for generating the secret string.
 * @returns The generated secret string.
 */
export declare function generateSecret(
  length: number,
  characters?: string,
): string;
/**
 * The default global secret generator used to create cryptographically
 * random secrets.
 */
export declare const secretGenerator: DefaultSecretGenerator;
