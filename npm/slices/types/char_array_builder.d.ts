import { type CharBuffer } from "./utils.js";
/**
 * Represents a mutable string of characters that are stored
 * as code points in a Uint32Array.
 */
export declare class CharArrayBuilder {
  #private;
  /**
   * Creates a new instance of the StringBuilder class.
   * @param capacity The initial capacity of the char builder. Default is 16.
   */
  constructor(capacity?: number);
  /**
   * Gets the length of the char or string builder.
   */
  get length(): number;
  /**
   * Appends a value to the string builder.
   * @param value The value to append to the string builder.
   * @returns The updated `StringBuilder` or `CharArrayBuilder` instance.
   */
  append(value: CharBuffer | number | Date | boolean | bigint): this;
  /**
   * Appends a Unicode character to the string builder.
   * @param value The Unicode character (codepoint) to append.
   * @returns The update `StringBuilder` or `CharArrayBuilder` instance.
   */
  appendChar(value: number): this;
  /**
   * Appends a char slice to the string builder.
   * @param value The slice to append.
   * @returns The updated string builder.
   */
  appendSlice(value: CharBuffer): this;
  /**
   * Appends a string to the end of the string builder.
   * @param value The string to append.
   * @returns The updated `CharArrayBuilder` instance.
   */
  appendString(value: string): void;
  /**
   * Appends a character array to the end of the string builder.
   * @param value The character array to append.
   * @returns The updated `CharArrayBuilder` instance.
   */
  appendCharArray(value: Uint32Array): void;
  /**
   * Appends a string followed by a line break to the string builder.
   * @param value The string to append.
   * @returns The updated string builder.
   */
  appendLine(value?: CharBuffer): this;
  /**
   * Shrinks the capacity of the string builder to the specified value.
   * @param capacity The new capacity of the string builder.
   * @returns The updated StringBuilder instance.
   * @throws ArgumentRangeError if the capacity is less than 0.
   */
  shrinkTo(capacity: number): this;
  /**
   * Clears the string builder.
   * @returns The updated `CharArrayBuilder` instance.
   */
  clear(): this;
  /**
   * Trims excess capacity from the string builder.
   * @returns The updated StringBuilder instance.
   */
  trimExcess(): this;
  /**
   * Converts the string builder to an array of characters.
   * @returns The array of characters.
   */
  toArray(): Uint32Array;
  /**
   * Converts the string builder to a string.
   * @returns The string representation of the string builder.
   */
  toString(): string;
  /**
   * Increases the capacity of the string builder, if necessary, to accommodate the specified capacity.
   * @param capacity The minimum capacity to ensure.
   * @private
   */
  private grow;
}
