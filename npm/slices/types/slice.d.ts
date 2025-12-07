/**
 * The Slice module includes the Slice class which provides
 * a mutable view of an array.  The Slice class allows you to
 * create a slice of an array, modify the elements in the slice,
 * and iterate over the elements in the slice without copying the array.
 *
 * The readonly slice class provides a read-only view of the array.
 * where you can view the elements in the slice but not modify them.
 * @module
 */
/**
 * A slice of an array.  The slice is a view of the array
 * and the array is not copied.
 *
 * @experimental
 * API is experimental and subject to change.
 */
export declare class Slice<T> implements Iterable<T> {
  #private;
  /**
   * Creates a new instance of the Slice class.
   * @param set The array to slice.
   * @param offset The offset of the slice.
   * @param length The length of the slice.
   */
  constructor(set: Array<T>, offset?: number, length?: number);
  /**
   * Gets the length of the slice.
   */
  get length(): number;
  /**
   * Gets a value indicating whether the slice is empty.
   */
  get isEmpty(): boolean;
  /**
   * Gets the element at the specified index.
   * @param index The index of the element to get.
   * @returns The element at the specified index.
   * @throws RangeError if the index is less than 0 or greater than or equal to the length of the slice.
   */
  at(index: number): T;
  /**
   * Sets the element at the specified index.
   * @param index The index of the element to set.
   * @param value The value to set.
   * @returns The updated slice.
   * @throws RangeError if the index is less than 0 or greater than or equal to the length of the slice.
   */
  set(index: number, value: T): this;
  /**
   * Updates the elements at the specified index with the specified values.
   * @param index The index of the first element to update.
   * @param value The values to update.
   * @returns The updated slice.
   * @throws RangeError if the index is less than 0 or greater than or equal to the length of the slice.
   */
  update(index: number, value: T[]): this;
  /**
   * Maps the elements of the slice to a new array.
   *
   * @description
   * A new array is allocated when using map because it is tranforming values
   * and needs a new container to store the results.
   *
   * @param callbackfn The callback function to apply to each element in the slice.
   * @returns A new slice with the results of the callback function.
   */
  map<U>(callbackfn: (value: T, index: number, set: Array<T>) => U): Slice<U>;
  /**
   * Gets the index of the first occurrence of a specified value in the slice.
   * @param value The value to search for.
   * @returns The index of the first occurrence of the value in the slice, or -1 if the value is not found.
   */
  indexOf(value: T): number;
  /**
   * Creates a new slice that contains a subset of the elements of the current slice.
   * @description
   * The new slice starts at the specified start index and ends at the specified end index.
   * If start is greater than or equal to end, the new slice is empty.
   * @param start The start index of the new slice.
   * @param end The end index of the new slice.
   * @returns A new slice that contains a subset of the elements of the current slice.
   * @throws RangeError if the start index is less than 0 or greater than or equal to
   * the length of the slice.
   */
  slice(start: number, end?: number): Slice<T>;
  /**
   * Finds the first element in the slice that satisfies the specified callback function.
   * @description
   * The callback function is called for each element in the slice until the callback
   * function returns true, indicating that the element satisfies the condition.
   * If no element satisfies the condition, the function returns undefined.
   * @param predicate The callback function to test each element of the slice.
   * @returns The first element in the slice that passes the test in the specified
   * callback function, or undefined if no element passes the test.
   */
  find(
    predicate: (value: T, index: number, set: Array<T>) => boolean,
  ): T | undefined;
  /**
   * Finds the index of the first element in the slice that satisfies the specified callback function.
   * @description
   * The callback function is called for each element in the slice until the callback
   * function returns true, indicating that the element satisfies the condition.
   * If no element satisfies the condition, the function returns -1.
   * @param predicate The callback function to test each element of the slice.
   * @returns The index of the first element in the slice that passes the test in the specified
   * callback function, or -1 if no element passes the test.
   */
  findIndex(
    predicate: (value: T, index: number, set: Array<T>) => boolean,
  ): number;
  /**
   * Gets a value indicating whether the slice includes a specified value.
   * @param value The value to search for.
   * @returns `true` if the slice includes the specified value, otherwise, `false`.
   */
  includes(value: T): boolean;
  /**
   * Reverses the order of the elements in the slice.
   *
   * @description
   * The elements are reversed in place, so the original slice is modified.
   *
   * @example
   * ```ts
   * import { Slice } from "@frostyeti/slices";
   * const slice = new Slice([1, 2, 3]);
   * slice.reverse();
   * console.log(slice); // Slice [3, 2, 1]
   */
  reverse(): void;
  /**
   * Creates an iterator that allows you to iterate over the elements of the slice.
   * @returns An iterator that allows you to iterate over the elements of the slice.
   */
  [Symbol.iterator](): Iterator<T>;
}
/**
 * A read-only slice of an array.  The slice is a view of the array
 * and the array is not copied.
 */
export declare class ReadOnlySlice<T> implements Iterable<T> {
  #private;
  /**
   * Creates a new instance of the ReadOnlySlice class.
   * @param set The array to slice.
   * @param offset The offset of the slice.
   * @param length The length of the slice.
   */
  constructor(set: Array<T>, offset?: number, length?: number);
  /**
   * Gets the length of the slice.
   */
  get length(): number;
  /**
   * Gets a value indicating whether the slice is empty.
   */
  get isEmpty(): boolean;
  /**
   * @returns An iterator that allows you to iterate over the elements of the slice.
   */
  [Symbol.iterator](): Iterator<T>;
  /**
   * Gets the element at the specified index.
   * @param index The index of the element to get.
   * @returns The element at the specified index.
   * @throws RangeError if the index is less than 0 or greater than or equal
   * to the length of the slice.
   */
  at(index: number): T;
  /**
   * Gets the index of the first occurrence of a specified value in the slice.
   * @param value The value to search for.
   * @returns The index of the first occurrence of the value in the slice,
   * or -1 if the value is not found.
   */
  indexOf(value: T): number;
  /**
   * Creates a new slice that contains a subset of the elements of the current slice.
   * @description
   * The new slice starts at the specified start index and ends at the specified end index.
   * If start is greater than or equal to end, the new slice is empty.
   * @param start The start index of the new slice.
   * @param end The end index of the new slice.
   * @returns The new slice.
   * @throws RangeError if the start index is less than 0 or greater than or equal to
   * the length of the slice.
   */
  slice(start: number, end?: number): ReadOnlySlice<T>;
}
