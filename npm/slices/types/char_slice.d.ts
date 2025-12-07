import {
  type CharBuffer,
  type CharSequence,
  type CharSliceLike,
} from "./utils.js";
/**
 * A read-only slice of a character buffer.
 * The slice is a view of the buffer and the buffer is not copied.
 *
 * This is a specialized slice type for working with string characters in their
 * uint32 codepoint format and provide string like methods such as trim, indexof, toUpper,
 * toLower, includes, and more without the need to convert them back into strings to perform
 * those operations.
 *
 * @experimental
 * API is experimental and subject to change.
 */
export declare class ReadOnlyCharSlice
  implements CharSequence, Iterable<number> {
  #private;
  /**
   * Creates a new instance of the ReadOnlyCharSlice class.
   * @param buffer The buffer to slice.
   * @param start The start index of the slice.
   * @param end The end index of the slice.
   */
  constructor(buffer: Uint32Array, start?: number, end?: number);
  /**
   * Gets the length of the slice.
   */
  get length(): number;
  /**
   * Gets a value indicating whether the slice is empty.
   */
  get isEmpty(): boolean;
  /**
   * Creates a `ReadOnlyCharSlice` from a string.
   * @param s The string to convert to a `ReadOnlyCharSlice`.
   * @returns The `ReadOnlyCharSlice` representation of the string.
   */
  static fromString(s: string): ReadOnlyCharSlice;
  /**
   * @returns An iterator that iterates over the elements of the slice.
   */
  [Symbol.iterator](): Iterator<number>;
  /**
   * Gets the element at the specified index.
   * @param index The index of the element to get.
   * @returns The element at the specified index.
   * @throws RangeError if the index is less than 0 or
   * greater than or equal to the length of the slice.
   */
  at(index: number): number;
  /**
   * Iterates over the elements of the slice.
   * @param callback The callback function to call for each element.
   * @returns The updated ReadOnlyCharSlice.
   */
  forEach(callback: (value: number, index: number) => void): this;
  /**
   * @param callback Callback function to call for each element.
   * @returns
   */
  map(callback: (value: number, index: number) => number): ReadOnlyCharSlice;
  /**
   * Creates a new ReadOnlyCharSlice that is the result of capitalizing the
   * first character of each word in this ReadOnlyCharSlice.
   * @returns A new ReadOnlyCharSlice.
   */
  captialize(): ReadOnlyCharSlice;
  /**
   * Determines if the ReadOnlyCharSlice includes the given value.
   * @param value The value to check for.
   * @param index The index to start the search at.
   * @returns `true` if the ReadOnlyCharSlice includes the given value;
   * otherwise `false`.
   */
  includes(value: CharBuffer, index?: number): boolean;
  /**
   * Determines if the ReadOnlyCharSlice includes the given value using
   * a case-insensitive comparison.
   * @param value The value to check for.
   * @param index The index to start the search at.
   * @returns `true` if the ReadOnlyCharSlice includes the given value;
   * otherwise `false`.
   */
  includesFold(value: CharBuffer, index?: number): boolean;
  /**
   * Determines the index of the first occurrence of the given value
   * in the ReadOnlyCharSlice.
   *
   * @param value The value to search for.
   * @param index The index to start the search at.
   * @returns The index of the first occurrence of the given value in the ReadOnlyCharSlice,
   * or -1 if not found.
   */
  indexOf(value: CharBuffer | number, index?: number): number;
  /**
   * Determines the index of the first occurrence of the given value
   * in the ReadOnlyCharSlice using a case-insensitive comparison.
   *
   * @param value The value to search for.
   * @param index The index to start the search at.
   * @returns The index of the first occurrence of the given value in the ReadOnlyCharSlice,
   * or -1 if not found.
   */
  indexOfFold(value: CharBuffer | number, index?: number): number;
  /**
   * Determines if the the ReadOnlyCharSlice is equal to
   * the given CharBuffer.
   * @param other The other CharBuffer to compare.
   * @returns `true` if the two CharBuffers are equal; otherwise `false`.
   */
  equals(other: CharBuffer): boolean;
  /**
   * Determines if the the ReadOnlyCharSlice is equal to
   * the given CharBuffer using a case-insensitive comparison.
   * @param other The other CharBuffer to compare.
   * @returns `true` if the two CharBuffers are equal; otherwise `false`.
   */
  equalsFold(other: CharBuffer): boolean;
  /**
   * Determines if the ReadOnlyCharSlice ends with the given suffix.
   * @param suffix The suffix to check for.
   * @returns `true` if the ReadOnlyCharSlice ends with the given
   * suffix; otherwise `false`.
   */
  endsWith(suffix: CharBuffer): boolean;
  /**
   * Determines if the ReadOnlyCharSlice ends with the given suffix
   * using a case-insensitive comparison.
   * @param suffix The suffix to check for.
   * @returns `true` if the ReadOnlyCharSlice ends with the given
   * suffix; otherwise `false`.
   */
  endsWithFold(suffix: CharBuffer): boolean;
  /**
   * Creates a new ReadOnlyCharSlice that is a slice of the current ReadOnlyCharSlice,
   * which still a view of the same buffer.
   * @param start The start index of the slice.
   * @param end The end index of the slice.
   * @returns A new ReadOnlyCharSlice that is a slice of the current ReadOnlyCharSlice.
   * @throws RangeError if the start or end is less than 0 or
   * greater than or equal to the length of the slice.
   */
  slice(start?: number, end?: number): ReadOnlyCharSlice;
  /**
   * Determines if the ReadOnlyCharSlice starts with the given prefix.
   * @param prefix The prefix to check for.
   * @returns `true` if the ReadOnlyCharSlice starts with the given
   * prefix; otherwise `false`.
   */
  startsWith(prefix: CharBuffer): boolean;
  /**
   * Determines if the ReadOnlyCharSlice starts with the given prefix
   * using a case-insensitive comparison.
   * @param prefix The prefix to check for.
   * @returns `true` if the ReadOnlyCharSlice starts with the given
   * prefix; otherwise `false`.
   */
  startsWithFold(prefix: CharBuffer): boolean;
  /**
   * Returns new `ReadOnlyCharSlice` that has lower characters.
   *
   * A new Uint32Array is allocated when using toLower because it is tranforming values
   * and needs a new container to store the results.
   *
   * @returns a new charslices with all lower characters.
   */
  get toLower(): ReadOnlyCharSlice;
  /**
   * Returns new `ReadOnlyCharSlice` that has upper characters.
   *
   * A new Uint32Array is allocated when using toUpper because it is tranforming values
   * and needs a new container to store the results.
   *
   * @returns a new charslices with all upper characters.
   */
  get toUpper(): ReadOnlyCharSlice;
  /**
   * Creates a new `ReadOnlyCharSlice` with the leading whitespace removed.
   *
   * @returns A new `ReadOnlyCharSlice` with the leading whitespace removed.
   */
  trimStartSpace(): ReadOnlyCharSlice;
  /**
   * Creates a new `ReadOnlyCharSlice` with the leading character removed.
   *
   * @param c The character to remove.
   * @returns A new `ReadOnlyCharSlice` with the leading character removed.
   */
  trimStartChar(c: number): ReadOnlyCharSlice;
  /**
   * Creates a new `ReadOnlyCharSlice` with the leading characters removed.
   * @param t The character slice to remove.
   * @returns The new `ReadOnlyCharSlice` with the leading character removed.
   */
  trimStartSlice(t: CharSliceLike): ReadOnlyCharSlice;
  /**
   * Creates a new `ReadOnlyCharSlice` with the leading characters removed.
   * @param t The character slice to remove.
   * @returns The new `ReadOnlyCharSlice` with the leading character removed.
   */
  trimStart(t?: CharSliceLike | string): ReadOnlyCharSlice;
  /**
   * Creates a new `ReadOnlyCharSlice` with the trailing whitespace removed.
   *
   * @returns A new `ReadOnlyCharSlice` with the trailing whitespace removed.
   */
  trimEndSpace(): ReadOnlyCharSlice;
  /**
   * Creates a new ReadOnlyCharSlice that is the result of trimming the
   * end of this ReadOnlyCharSlice.
   *
   * @param char A character to trim.
   * @returns A new ReadOnlyCharSlice.
   */
  trimEndChar(char: number): ReadOnlyCharSlice;
  /**
   * Creates a new ReadOnlyCharSlice that is the result of trimming the
   * end of this ReadOnlyCharSlice.
   * @param slice
   * @returns A new ReadOnlyCharSlice.
   */
  trimEndSlice(slice: CharSliceLike): ReadOnlyCharSlice;
  /**
   * Creates a new ReadOnlyCharSlice that is the result of trimming the
   * end of this ReadOnlyCharSlice by a character or a slice of characters.
   * @param slice
   * @returns A new ReadOnlyCharSlice.
   */
  trimEnd(slice?: CharSliceLike | string): ReadOnlyCharSlice;
  /**
   * Creates a new ReadOnlyCharSlice that is the result of trimming the
   * start and end of this ReadOnlyCharSlice by spaces.
   * @returns A new ReadOnlyCharSlice.
   */
  trimSpace(): ReadOnlyCharSlice;
  /**
   * Creates a new ReadOnlyCharSlice that is the result of trimming the
   * start and end of this ReadOnlyCharSlice by a character.
   * @param char The character to trim.
   * @returns A new ReadOnlyCharSlice.
   */
  trimChar(char: number): ReadOnlyCharSlice;
  /**
   * Creates a new ReadOnlyCharSlice that is the result of trimming the
   * start and end of this ReadOnlyCharSlice by a slice of characters.
   *
   * @param slice The slice of characters to trim.
   * @returns A new ReadOnlyCharSlice.
   */
  trimSlice(slice: CharSliceLike): ReadOnlyCharSlice;
  /**
   * Creates a new ReadOnlyCharSlice that is the result of trimming the
   * start and end of this ReadOnlyCharSlice by a slice of characters.
   * @param slice The slice of characters to trim.
   * @returns A new ReadOnlyCharSlice.
   */
  trim(slice?: CharSliceLike | string): ReadOnlyCharSlice;
  /**
   * Converts the ReadOnlyCharSlice to a string.
   *
   * This will create a new string every time it is called.
   *
   * @returns A string representation of the ReadOnlyCharSlice.
   */
  toString(): string;
}
/**
 * A slice of a character buffer.
 * The slice is a view of the buffer and the buffer is not copied.
 *
 * This is a specialized slice type for working with string characters in their
 * uint32 codepoint format and provide string like methods such as trim, indexof, toUpper,
 * toLower, includes, and more without the need to convert them back into strings to perform
 * those operations.
 */
export declare class CharSlice implements CharSequence, Iterable<number> {
  #private;
  /**
   * Creates a new instance of the CharSlice class.
   * @param buffer The buffer to slice.
   * @param start The start index of the slice.
   * @param end The end index of the slice.
   */
  constructor(buffer: Uint32Array, start?: number, end?: number);
  /**
   * Gets the length of the slice.
   */
  get length(): number;
  /**
   * Gets a value indicating whether the slice is empty.
   */
  get isEmpty(): boolean;
  [Symbol.iterator](): Iterator<number>;
  /**
   * Creates a `CharSlice` from a string which allocates a new buffer
   * using a new `Uint32Array`.
   * @param s The string to convert to a `CharSlice`.
   * @returns The `CharSlice` representation of the string.
   */
  static fromString(s: string): CharSlice;
  /**
   * Gets the element at the specified index.
   * @param index The index of the element to get.
   * @returns The element at the specified index.
   * @throws RangeError if the index is less than 0 or
   * greater than or equal to the length of the slice.
   */
  at(index: number): number;
  /**
   * Sets the element at the specified index.
   * @param index The index of the element to set.
   * @param value The value to set.
   * @throws RangeError if the index is less than 0 or
   * greater than or equal to the length of the slice.
   */
  set(index: number, value: number): void;
  /**
   * Iterates over the elements of the slice.
   * @param callback Callback function to call for each element.
   * @returns The updated ReadOnlyCharSlice.
   */
  forEach(callback: (value: number, index: number) => void): this;
  /**
   * Map will iterate over the elements of the slice and call the callback function
   * for each element. The element at the index will be replaced with the result
   * of the callback.
   * @param callback Callback function to call for each element.
   * @returns
   */
  map(callback: (value: number, index: number) => number): this;
  /**
   * Replace will replace the element at the specified index with the given value.
   * @param index The index of the element to replace.
   * @param value The value to replace the element with.
   * @returns The updated ReadOnlyCharSlice.
   * @throws RangeError if the index is less than 0 or
   * greater than or equal to the length of the slice.
   */
  replace(index: number, value: string | CharSliceLike): this;
  /**
   * Capitalize will capitalize the first character of the slice. All
   * other characters will be converted to lower case.
   * @returns the current CharSlice.
   */
  captialize(): this;
  /**
   * FindIndex will iterate over the elements of the slice and call the predicate function
   * for each element. The index of the first element for which the predicate returns true
   * will be returned. If no element is found, -1 will be returned.
   * @param predicate The predicate function to call for each element.
   * @returns The index of the first element for which the predicate returns true,
   * or -1 if no element is found.
   */
  findIndex(
    predicate: (value: number, index: number, set: Uint32Array) => boolean,
  ): number;
  /**
   * Determines if the ReadOnlyCharSlice includes the given value.
   * @param value The value to check for.
   * @param index The index to start the search at.
   * @returns The index of the first occurrence of the given value in
   * the ReadOnlyCharSlice, or -1 if not found.
   */
  includes(value: CharBuffer, index?: number): boolean;
  /**
   * Determines if the ReadOnlyCharSlice includes the given value
   * using a case-insensitive comparison.
   * @param value The value to check for.
   * @param index The index to start the search at.
   * @returns The index of the first occurrence of the given value in
   * the ReadOnlyCharSlice, or -1 if not found.
   */
  includesFold(value: CharBuffer, index?: number): boolean;
  indexOf(value: CharBuffer, index?: number): number;
  indexOfFold(value: CharBuffer, index?: number): number;
  lastIndexOf(value: CharBuffer, index?: number): number;
  lastIndexOfFold(value: CharBuffer, index?: number): number;
  equals(other: CharBuffer): boolean;
  equalsFold(other: CharBuffer): boolean;
  endsWith(suffix: CharBuffer): boolean;
  endsWithFold(suffix: CharBuffer): boolean;
  slice(start?: number, end?: number): CharSlice;
  sliceSequence(start: number, end?: number): CharSlice;
  startsWith(prefix: CharBuffer): boolean;
  startsWithFold(prefix: CharBuffer): boolean;
  toArray(): Uint32Array;
  /**
   * Returns new `CharSlice` that has lower characters
   * @returns a new charslices with all lower characters.
   */
  toLower(): this;
  toUpper(): this;
  trimStartSpace(): CharSlice;
  trimStartChar(c: number): CharSlice;
  trimStartSlice(t: CharSliceLike | string): CharSlice;
  trimStart(t?: CharSliceLike | string): CharSlice;
  trimEndSpace(): CharSlice;
  trimEndChar(c: number): CharSlice;
  trimEndSlice(t: CharSliceLike | string): CharSlice;
  trimEnd(t?: CharSliceLike | string): CharSlice;
  trimSpace(): CharSlice;
  trimChar(c: number): CharSlice;
  trimSlice(t: CharSliceLike | string): CharSlice;
  trim(t?: CharSliceLike | string): CharSlice;
  /**
   * Converts the CharSlice to a string.
   *
   * This will create a new string every time it is called.
   *
   * @returns The string representation of the CharSlice.
   */
  toString(): string;
}
