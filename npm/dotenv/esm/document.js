/**
 * The `document` module provides functionality to represent and manipulate a document
 * for environment variables, allowing for the addition of tokens such as comments,
 * newlines, and key-value pairs. It also provides methods to convert the document
 * to an array or an object representation.
 *
 * @module
 */
/**
 * Represents a document for environment variables, providing methods to manipulate and iterate over tokens.
 * Implements the Iterable interface for Token objects.
 */
export class DotEnvDocument {
  /**
   * Array to store tokens.
   */
  #tokens = [];
  /**
   * Initializes a new instance of the DotEnvDocument class.
   */
  constructor() {
    this.#tokens = [];
  }
  /**
   * Gets the number of tokens in the document.
   * @returns The number of tokens.
   */
  get length() {
    return this.#tokens.length;
  }
  /**
   * Retrieves the token at the specified index.
   * @param index - The index of the token to retrieve.
   * @returns The token at the specified index.
   */
  at(index) {
    return this.#tokens[index];
  }
  /**
   * Adds a token to the document.
   * @param token - The token to add.
   * @returns The current instance of DotEnvDocument.
   */
  token(token) {
    this.#tokens.push(token);
    return this;
  }
  /**
   * Adds a comment token to the document.
   * @param value - The comment text.
   * @returns The current instance of DotEnvDocument.
   */
  comment(value) {
    this.token({ kind: "comment", value });
    return this;
  }
  /**
   * Adds a newline token to the document.
   * @returns The current instance of DotEnvDocument.
   */
  newline() {
    this.token({ kind: "newline" });
    return this;
  }
  /**
   * Adds an item token to the document.
   * @param key - The key of the item.
   * @param value - The value of the item.
   * @returns The current instance of DotEnvDocument.
   */
  item(key, value) {
    this.token({ kind: "item", key, value });
    return this;
  }
  /**
   * Returns an iterator for the tokens in the document.
   * @returns An iterator for the tokens.
   */
  [Symbol.iterator]() {
    return this.#tokens[Symbol.iterator]();
  }
  /**
   * Converts the tokens to an array.
   * @returns An array of tokens.
   */
  toArray() {
    return this.#tokens.slice();
  }
  /**
   * Converts the tokens to an object where item tokens are represented as key-value pairs.
   * @returns An object representation of the item tokens.
   */
  toObject() {
    const obj = {};
    for (const token of this) {
      if (token.kind === "item") {
        const pair = token;
        obj[pair.key] = pair.value;
      }
    }
    return obj;
  }
}
