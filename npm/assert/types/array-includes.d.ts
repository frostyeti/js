/** An array-like object (`Array`, `Uint8Array`, `NodeList`, etc.) that is not a string */
export type ArrayLikeArg<T> = ArrayLike<T> & object;
/**
 * Make an assertion that `actual` includes the `expected` values. If not then
 * an error will be thrown.
 *
 * Type parameter can be specified to ensure values under comparison have the
 * same type.
 *
 * @example Usage
 * ```ts ignore
 * import { arrayIncludes } from "@frostyetiassert";
 *
 * arrayIncludes([1, 2], [2]); // Doesn't throw
 * arrayIncludes([1, 2], [3]); // Throws
 * ```
 *
 * @typeParam T The type of the elements in the array to compare.
 * @param actual The array-like object to check for.
 * @param expected The array-like object to check for.
 * @param msg The optional message to display if the assertion fails.
 */
export declare function arrayIncludes<T>(
  actual: ArrayLikeArg<T>,
  expected: ArrayLikeArg<T>,
  msg?: string,
): void;
