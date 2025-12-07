/**
 * Utiltity functions for working with character buffers.
 *
 * @module
 */
/**
 * Converts a string to a Uint32Array of characters.
 * @param s The string to convert.
 * @returns The Uint32Array of characters
 */
export function toCharArray(s) {
  const set = new Uint32Array(s.length);
  for (let i = 0; i < s.length; i++) {
    set[i] = s.codePointAt(i) ?? 0;
  }
  return set;
}
/**
 * Converts a CharBuffer to a string.
 * @param buffer The character buffer to convert.
 * @returns The string.
 */
export function toString(buffer) {
  if (typeof buffer === "string") {
    return buffer;
  }
  if (buffer instanceof Uint32Array) {
    return String.fromCodePoint(...buffer);
  }
  if (buffer instanceof Uint16Array) {
    const codePoints = new Uint32Array(buffer.buffer);
    return String.fromCodePoint(...codePoints);
  }
  if (buffer instanceof Uint8Array) {
    const codePoints = new Uint32Array(buffer.buffer);
    return String.fromCodePoint(...codePoints);
  }
  const codePoints = new Uint32Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    codePoints[i] = buffer.at(i) ?? 0;
  }
  return String.fromCodePoint(...codePoints);
}
/**
 * Converts a CharBuffer to a CharSliceLike interface.
 * @param buffer The character buffer to convert.
 * @returns The slice.
 */
export function toCharSliceLike(buffer) {
  if (typeof buffer === "string") {
    return {
      at(i) {
        return buffer.codePointAt(i);
      },
      length: buffer.length,
    };
  }
  if (buffer instanceof Uint32Array) {
    return buffer;
  }
  if (buffer instanceof Uint16Array) {
    return new Uint32Array(buffer.buffer);
  }
  if (buffer instanceof Uint8Array) {
    return new Uint32Array(buffer.buffer);
  }
  return buffer;
}
