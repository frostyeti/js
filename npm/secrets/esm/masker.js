/**
 * The SecretMasker module provides an interface and a default implementation for masking sensitive information in strings.
 * It allows you to add secret values and generator functions that can be used to mask those secrets in any given string.
 *
 * @module
 */
/**
 * Represents a secret masker that can be used to mask sensitive information in strings.
 */
export class DefaultSecretMasker {
  #secrets;
  #generators;
  /**
   * Creates a new instance of DefaultSecretMasker.
   */
  constructor() {
    this.#secrets = [];
    this.#generators = [];
  }
  /**
   * Adds a secret value to the masker.
   * @param value - The secret value to add.
   * @returns The SecretMasker instance for method chaining.
   */
  add(value) {
    if (!this.#secrets.includes(value)) {
      this.#secrets.push(value);
    }
    this.#generators.forEach((generator) => {
      const next = generator(value);
      if (!this.#secrets.includes(next)) {
        this.#secrets.push(next);
      }
    });
    return this;
  }
  /**
   * Adds a generator function to the masker.
   * @param generator - The generator function that takes a secret value and returns a masked value.
   * @returns The SecretMasker instance for method chaining.
   */
  addGenerator(generator) {
    this.#generators.push(generator);
    return this;
  }
  /**
   * Masks a given value by replacing any occurrences of secrets with asterisks.
   * @param value - The value to mask.
   * @returns The masked value.
   */
  mask(value) {
    if (value === null) {
      return value;
    }
    let str = value;
    this.#secrets.forEach((next) => {
      const regex = new RegExp(`${next}`, "gi");
      str = str.replace(regex, "*******");
    });
    return str;
  }
}
/**
 * Represents a secret masker that can be used to mask sensitive information in strings.
 */
export const secretMasker = new DefaultSecretMasker();
