import { isNullOrSpace } from "@frostyeti/strings";
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
    if (value === null || value === undefined) {
      return this;
    }
    if (typeof value === "string") {
      if (isNullOrSpace(value)) {
        return this;
      }
      value = value.trim();
    }
    if (!this.#secrets.includes(value)) {
      this.#secrets.push(value);
    }
    if (typeof value === "string") {
      this.#generators.forEach((generator) => {
        const next = generator(value);
        if (!this.#secrets.includes(next)) {
          this.#secrets.push(next);
        }
      });
    }
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
      if (next === "") {
        return;
      }
      str = str.replaceAll(next, "*******");
    });
    return str;
  }
}
/**
 * Represents a secret masker that can be used to mask sensitive information in strings.
 */
export const secretMasker = new DefaultSecretMasker();
