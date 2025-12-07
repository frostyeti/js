/**
 * The `lastIndexOf` module provides functions to find the last index of a
 * substring in a string or character buffer, with support for case-insensitive
 * searching.
 * @module
 */
import { simpleFold } from "@frostyeti/chars/simple-fold";
import { toCharSliceLike } from "./utils.js";
/**
 * Gets the index of the last occurrence of the test array in the value array
 * using a case-insensitive comparison.
 * @param value The array of characters to search in.
 * @param test The aray of characters to search for.
 * @param index The index to start the search at.
 * @returns The index of the first occurrence of the test array in
 * the value array, or -1 if not found.
 */
export function lastIndexOfFold(value, test, index = 0) {
  const s = toCharSliceLike(value);
  const t = toCharSliceLike(test);
  if (t.length === 0 || s.length === 0 || t.length > s.length) {
    return -1;
  }
  let f = 0;
  const l = Math.min(s.length, index === Infinity ? s.length : (index + 1));
  if (l - 1 < 0) {
    return -1;
  }
  for (let i = l - 1; i > -1; i--) {
    for (let j = t.length - 1; j > -1; j--) {
      let sr = s.at(i - f) ?? -1;
      let tr = t.at(j) ?? -1;
      if (sr === -1 || tr === -1) {
        break;
      }
      if (tr === sr) {
        f++;
        if (f === t.length) {
          return i - t.length + 1;
        }
        continue;
      }
      if (tr < sr) {
        const tmp = tr;
        tr = sr;
        sr = tmp;
      }
      // short circuit if tr is ASCII
      if (tr < 0x80) {
        if (65 <= sr && sr <= 90 && tr === sr + 32) {
          f++;
          if (f === t.length) {
            return i - t.length + 1;
          }
          continue;
        }
        f = 0;
        break;
      }
      let r = simpleFold(sr);
      while (r !== sr && r < tr) {
        r = simpleFold(r);
      }
      if (r === tr) {
        f++;
        if (f === t.length) {
          return i - t.length + 1;
        }
        continue;
      }
      f = 0;
      break;
    }
    if (f === t.length) {
      return i - t.length + 1;
    }
  }
  return -1;
}
/**
 * Gets the index of the last occurrence of the test array in the value array
 * @param value The array of characters to search in.
 * @param test The aray of characters to search for.
 * @param index The index to start the search at.
 * @returns The index of the first occurrence of the test array in
 * the value array, or -1 if not found.
 */
export function lastIndexOf(value, test, index = Infinity) {
  const s = toCharSliceLike(value);
  const t = toCharSliceLike(test);
  if (t.length === 0 || s.length === 0 || t.length > s.length) {
    return -1;
  }
  const l = Math.min(s.length, index === Infinity ? s.length : (index + 1));
  if (l - 1 < 0) {
    return -1;
  }
  let f = 0;
  for (let i = l - 1; i > -1; i--) {
    for (let j = t.length - 1; j > -1; j--) {
      const sr = s.at(i - f) ?? -1;
      const tr = t.at(j) ?? -1;
      if (sr === -1 || tr === -1) {
        break;
      }
      if (tr === sr) {
        f++;
        if (f === t.length) {
          return i - t.length + 1;
        }
        continue;
      }
      f = 0;
    }
    if (f === t.length) {
      return i - t.length + 1;
    }
  }
  return -1;
}
