import { toCharArray } from "./utils.js";
import { equalFold } from "./equal.js";
/**
 * A collection of tokens.
 * @remarks
 * This class is used to store a set of tokens, which are represented as
 * `Uint32Array` objects. It provides methods to add tokens, check for their
 * existence, and iterate over them.
 * @example
 * ```ts
 * const tokens = new Tokens();
 * tokens.addString("hello");
 * tokens.addString("world");
 * console.log(tokens.length); // 2
 */
export class Tokens {
  #set;
  /**
   * Creates a new instance of the `Tokens` class.
   */
  constructor() {
    this.#set = new Array();
  }
  /**
   * Gets the tokens in the collection.
   * @returns An iterator that iterates over the tokens in the collection.
   */
  [Symbol.iterator]() {
    return this.#set[Symbol.iterator]();
  }
  /**
   * Gets the number of tokens in the collection.
   */
  get length() {
    return this.#set.length;
  }
  /**
   * Adds a token to the collection.
   * @param word The word to add to the collection.
   * @returns The updated `Tokens` instance.
   */
  addString(word) {
    this.add(toCharArray(word));
    return this;
  }
  /**
   * Gets the index of a token in the collection.
   * @param word The word to add to the collection.
   * @returns The updated `Tokens` instance.
   */
  indexOf(word) {
    for (let i = 0; i < this.#set.length; i++) {
      if (equalFold(word, this.#set[i])) {
        return i;
      }
    }
    return -1;
  }
  /**
   * Adds a token to the collection.
   * @param word The word to add to the collection.
   * @returns The updated `Tokens` instance.
   */
  add(word) {
    if (this.indexOf(word) === -1) {
      this.#set.push(word);
    }
    return this;
  }
}
