/**
 * trim functions that remove whitespace or characters from the start,
 * end, or both ends of a character buffer.
 *
 * @module
 */
import { type CharBuffer } from "./utils.js";
/**
 * Trims the trailing whitespace from the end of a character buffer.
 * @param buffer The string to trim.
 * @returns The buffer with the trailing whitespace removed.
 */
export declare function trimEndSpace(buffer: CharBuffer): Uint32Array;
/**
 * Trims the trailing character from the end of a character buffer.
 * @param buffer The character buffer to trim.
 * @param suffix The character to remove.
 * @returns The buffer with the trailing whitespace removed.
 */
export declare function trimEndChar(
  buffer: CharBuffer,
  suffix: number,
): Uint32Array;
/**
 * Trims the trailing characters from the end of a character buffer.
 * @param buffer The character buffer to trim.
 * @param suffix The characters to remove.
 * @returns The buffer with the trailing characters removed.
 */
export declare function trimEndSlice(
  buffer: CharBuffer,
  suffix: CharBuffer,
): Uint32Array;
/**
 * Trims the trailing characters from the end of a character buffer.
 * @param buffer The character buffer to trim.
 * @param suffix The characters to remove. When this is undefined,
 * the trailing whitespace is removed.
 * @returns The buffer with the trailing characters removed.
 */
export declare function trimEnd(
  buffer: CharBuffer,
  suffix?: CharBuffer,
): Uint32Array;
/**
 * Trims the leading whitespace from the start of a character buffer.
 * @param buffer The character buffer to trim.
 * @returns The buffer with the leading whitespace removed.
 */
export declare function trimStartSpace(buffer: CharBuffer): Uint32Array;
/**
 * Trims the leading character from the start of a character buffer.
 * @param buffer The character buffer to trim.
 * @param prefix The character to remove.
 * @returns The buffer with the leading character removed.
 */
export declare function trimStartChar(
  buffer: CharBuffer,
  prefix: number,
): Uint32Array;
/**
 * Trims the leading characters from the start of a character buffer.
 * @param buffer The character buffer to trim.
 * @param prefix The characters to remove.
 * @returns The buffer with the leading characters removed.
 */
export declare function trimStartSlice(
  buffer: CharBuffer,
  prefix: CharBuffer,
): Uint32Array;
/**
 * Trims the leading characters from the start of a character buffer.
 * @param buffer The character buffer to trim.
 * @param prefix  The characters to remove. When this is undefined,
 * the leading whitespace is removed.
 * @returns The buffer with the leading characters removed.
 */
export declare function trimStart(
  buffer: CharBuffer,
  prefix?: CharBuffer,
): Uint32Array;
/**
 * Trims the leading and trailing whitespace from a character buffer.
 * @param buffer The character buffer to trim.
 * @returns The buffer with the leading and trailing whitespace removed.
 */
export declare function trimSpace(buffer: CharBuffer): Uint32Array;
/**
 * Trims the leading and trailing character from a character buffer.
 * @param buffer The character buffer to trim.
 * @param prefix The character to remove.
 * @returns The buffer with the leading character removed.
 */
export declare function trimChar(
  buffer: CharBuffer,
  prefix: number,
): Uint32Array;
/**
 * The leading and trailing characters from a character buffer.
 * @param buffer The character buffer to trim.
 * @param chars The characters to remove.
 * @returns The buffer with the leading and trailing characters removed.
 */
export declare function trimSlice(
  buffer: CharBuffer,
  chars: CharBuffer,
): Uint32Array;
/**
 * Trims the leading and trailing characters from a character buffer.
 * @param buffer The character buffer to trim.
 * @param chars The characters to remove. When this is undefined,
 * the leading and trailing whitespace is removed.
 * @returns The buffer with the leading and trailing characters removed.
 */
export declare function trim(
  buffer: CharBuffer,
  chars?: CharBuffer,
): Uint32Array;
