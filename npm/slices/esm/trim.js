/**
 * trim functions that remove whitespace or characters from the start,
 * end, or both ends of a character buffer.
 *
 * @module
 */
import { isSpace } from "@frostyeti/chars/is-space";
import { toCharSliceLike } from "./utils.js";
/**
 * Trims the trailing whitespace from the end of a character buffer.
 * @param buffer The string to trim.
 * @returns The buffer with the trailing whitespace removed.
 */
export function trimEndSpace(buffer) {
  const s = toCharSliceLike(buffer);
  let size = s.length;
  for (let i = s.length - 1; i >= 0; i--) {
    const c = s.at(i) ?? -1;
    if (isSpace(c)) {
      size--;
    } else {
      break;
    }
  }
  const buffer2 = new Uint32Array(size);
  if (s instanceof Uint32Array) {
    buffer2.set(s.subarray(0, size));
    return buffer2;
  }
  for (let i = 0; i < size; i++) {
    buffer2[i] = s.at(i) ?? 0;
  }
  return buffer2;
}
/**
 * Trims the trailing character from the end of a character buffer.
 * @param buffer The character buffer to trim.
 * @param suffix The character to remove.
 * @returns The buffer with the trailing whitespace removed.
 */
export function trimEndChar(buffer, suffix) {
  const s = toCharSliceLike(buffer);
  let size = s.length;
  for (let i = s.length - 1; i >= 0; i--) {
    if (s.at(i) === suffix) {
      size--;
    } else {
      break;
    }
  }
  if (size === s.length && s instanceof Uint32Array) {
    return s;
  }
  if (s instanceof Uint32Array) {
    return s.subarray(0, size);
  }
  const buffer2 = new Uint32Array(size);
  for (let i = 0; i < size; i++) {
    buffer2[i] = s.at(i) ?? 0;
  }
  return buffer2;
}
/**
 * Trims the trailing characters from the end of a character buffer.
 * @param buffer The character buffer to trim.
 * @param suffix The characters to remove.
 * @returns The buffer with the trailing characters removed.
 */
export function trimEndSlice(buffer, suffix) {
  const s = toCharSliceLike(buffer);
  const t = toCharSliceLike(suffix);
  let size = s.length;
  for (let i = s.length - 1; i >= 0; i--) {
    let match = false;
    for (let j = 0; j < t.length; j++) {
      if (s.at(i) === t.at(j)) {
        size--;
        match = true;
        break;
      }
    }
    if (!match) {
      break;
    }
  }
  if (size === s.length && s instanceof Uint32Array) {
    return s;
  }
  if (s instanceof Uint32Array) {
    return s.subarray(0, size);
  }
  const buffer2 = new Uint32Array(size);
  for (let i = 0; i < size; i++) {
    buffer2[i] = s.at(i) ?? 0;
  }
  return buffer2;
}
/**
 * Trims the trailing characters from the end of a character buffer.
 * @param buffer The character buffer to trim.
 * @param suffix The characters to remove. When this is undefined,
 * the trailing whitespace is removed.
 * @returns The buffer with the trailing characters removed.
 */
export function trimEnd(buffer, suffix) {
  if (suffix === undefined) {
    return trimEndSpace(buffer);
  }
  if (suffix.length === 1) {
    const t = toCharSliceLike(suffix);
    const rune = t.at(0) ?? -1;
    return trimEndChar(buffer, rune);
  }
  return trimEndSlice(buffer, suffix);
}
/**
 * Trims the leading whitespace from the start of a character buffer.
 * @param buffer The character buffer to trim.
 * @returns The buffer with the leading whitespace removed.
 */
export function trimStartSpace(buffer) {
  const s = toCharSliceLike(buffer);
  let size = s.length;
  for (let i = 0; i < s.length; i++) {
    if (isSpace(s.at(i) ?? -1)) {
      size--;
    } else {
      break;
    }
  }
  if (size === s.length && s instanceof Uint32Array) {
    return s;
  }
  const offset = s.length - size;
  if (s instanceof Uint32Array) {
    return s.subarray(offset);
  }
  const buffer2 = new Uint32Array(size);
  for (let i = 0; i < size; i++) {
    buffer2[i] = s.at(offset + i) ?? 0;
  }
  return buffer2;
}
/**
 * Trims the leading character from the start of a character buffer.
 * @param buffer The character buffer to trim.
 * @param prefix The character to remove.
 * @returns The buffer with the leading character removed.
 */
export function trimStartChar(buffer, prefix) {
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 0x10FFFF) {
    throw new RangeError("Invalid code point");
  }
  const s = toCharSliceLike(buffer);
  let size = s.length;
  let start = 0;
  for (let i = 0; i < s.length; i++) {
    if (s.at(i) === prefix) {
      size--;
      start++;
    } else {
      break;
    }
  }
  if (size === s.length && s instanceof Uint32Array) {
    return s;
  }
  if (s instanceof Uint32Array) {
    return s.subarray(start);
  }
  const buffer2 = new Uint32Array(size);
  for (let j = start, i = 0; j < s.length; j++, i++) {
    buffer2[i] = s.at(j) ?? 0;
  }
  return buffer2;
}
/**
 * Trims the leading characters from the start of a character buffer.
 * @param buffer The character buffer to trim.
 * @param prefix The characters to remove.
 * @returns The buffer with the leading characters removed.
 */
export function trimStartSlice(buffer, prefix) {
  const s = toCharSliceLike(buffer);
  const t = toCharSliceLike(prefix);
  let size = s.length;
  let j = 0;
  for (j = 0; j < s.length; j++) {
    let match = false;
    const c = s.at(j) ?? -1;
    for (let i = 0; i < t.length; i++) {
      if (c === t.at(i)) {
        size--;
        match = true;
        break;
      }
    }
    if (!match) {
      break;
    }
  }
  if (size === s.length && s instanceof Uint32Array) {
    return s;
  }
  if (s instanceof Uint32Array) {
    return s.subarray(j);
  }
  const buffer2 = new Uint32Array(size);
  for (let i = 0; i < size; i++) {
    buffer2[i] = s.at(i + j) ?? 0;
  }
  return buffer2;
}
/**
 * Trims the leading characters from the start of a character buffer.
 * @param buffer The character buffer to trim.
 * @param prefix  The characters to remove. When this is undefined,
 * the leading whitespace is removed.
 * @returns The buffer with the leading characters removed.
 */
export function trimStart(buffer, prefix) {
  if (prefix === undefined) {
    return trimStartSpace(buffer);
  }
  if (prefix.length === 1) {
    const t = toCharSliceLike(prefix);
    const rune = t.at(0) ?? -1;
    trimStartChar(buffer, rune);
  }
  return trimStartSlice(buffer, prefix);
}
/**
 * Trims the leading and trailing whitespace from a character buffer.
 * @param buffer The character buffer to trim.
 * @returns The buffer with the leading and trailing whitespace removed.
 */
export function trimSpace(buffer) {
  const s = toCharSliceLike(buffer);
  let start = 0;
  let end = s.length;
  for (let i = 0; i < s.length; i++) {
    if (isSpace(s.at(i) ?? -1)) {
      start++;
    } else {
      break;
    }
  }
  if (start === s.length) {
    return new Uint32Array(0);
  }
  for (let i = s.length - 1; i >= 0; i--) {
    if (isSpace(s.at(i) ?? -1)) {
      end--;
    } else {
      break;
    }
  }
  if (start === 0 && end === s.length && s instanceof Uint32Array) {
    return s;
  }
  if (s instanceof Uint32Array) {
    return s.subarray(start, end);
  }
  const buffer2 = new Uint32Array(end - start);
  for (let i = start; i < end; i++) {
    buffer2[i - start] = s.at(i) ?? 0;
  }
  return buffer2;
}
/**
 * Trims the leading and trailing character from a character buffer.
 * @param buffer The character buffer to trim.
 * @param prefix The character to remove.
 * @returns The buffer with the leading character removed.
 */
export function trimChar(buffer, prefix) {
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 0x10FFFF) {
    throw new RangeError("Invalid code point");
  }
  const s = toCharSliceLike(buffer);
  let start = 0;
  let end = s.length;
  for (let i = 0; i < s.length; i++) {
    if (s.at(i) === prefix) {
      start++;
    } else {
      break;
    }
  }
  if (start === s.length) {
    return new Uint32Array(0);
  }
  for (let i = s.length - 1; i >= 0; i--) {
    if (s.at(i) === prefix) {
      end--;
    } else {
      break;
    }
  }
  if (start === 0 && end === s.length && s instanceof Uint32Array) {
    return s;
  }
  if (s instanceof Uint32Array) {
    return s.subarray(start, end);
  }
  const buffer2 = new Uint32Array(end - start);
  for (let i = start; i < end; i++) {
    buffer2[i - start] = s.at(i) ?? 0;
  }
  return buffer2;
}
/**
 * The leading and trailing characters from a character buffer.
 * @param buffer The character buffer to trim.
 * @param chars The characters to remove.
 * @returns The buffer with the leading and trailing characters removed.
 */
export function trimSlice(buffer, chars) {
  const s = toCharSliceLike(buffer);
  const t = toCharSliceLike(chars);
  let start = 0;
  let end = s.length;
  for (let i = 0; i < s.length; i++) {
    let match = false;
    for (let j = 0; j < t.length; j++) {
      if (s.at(i) === t.at(j)) {
        start++;
        match = true;
        break;
      }
    }
    if (!match) {
      break;
    }
  }
  if (start === s.length) {
    return new Uint32Array(0);
  }
  for (let i = s.length - 1; i >= 0; i--) {
    let match = false;
    for (let j = 0; j < t.length; j++) {
      if (s.at(i) === t.at(j)) {
        end--;
        match = true;
        break;
      }
    }
    if (!match) {
      break;
    }
  }
  if (start === 0 && end === s.length && s instanceof Uint32Array) {
    return s;
  }
  if (s instanceof Uint32Array) {
    return s.subarray(start, end);
  }
  const buffer2 = new Uint32Array(end - start);
  for (let i = start; i < end; i++) {
    buffer2[i - start] = s.at(i) ?? 0;
  }
  return buffer2;
}
/**
 * Trims the leading and trailing characters from a character buffer.
 * @param buffer The character buffer to trim.
 * @param chars The characters to remove. When this is undefined,
 * the leading and trailing whitespace is removed.
 * @returns The buffer with the leading and trailing characters removed.
 */
export function trim(buffer, chars) {
  if (chars === undefined) {
    return trimSpace(buffer);
  }
  if (chars.length === 1) {
    const t = toCharSliceLike(chars);
    const rune = t.at(0) ?? -1;
    return trimChar(buffer, rune);
  }
  return trimSlice(buffer, chars);
}
