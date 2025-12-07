/**
 * This module provides functions for manipulating strings and
 * character buffers, including converting strings to camel case.
 *
 * @module
 */
import { CharArrayBuilder } from "./char_array_builder.js";
import { CHAR_HYPHEN_MINUS, CHAR_UNDERSCORE } from "@frostyeti/chars/constants";
import { isDigit } from "@frostyeti/chars/is-digit";
import { isLetter } from "@frostyeti/chars/is-letter";
import { isSpace } from "@frostyeti/chars/is-space";
import { toLower } from "@frostyeti/chars/to-lower";
import { toUpper } from "@frostyeti/chars/to-upper";
import { toCharSliceLike } from "./utils.js";
/**
 * Camelize converts a string to camel case, removing any `_`, `-`, or ` ` characters
 * and capitalizing the first letter of each word.
 *
 * @description
 * This function is
 * primary for converting snake_case, kebab-case, or space separated
 * symbols to camel case.
 *
 * To avoid allocations, the function returns a Uint32Array that represents
 * the camel case string.  To convert the Uint32Array to a string, use
 * `String.fromCharCode(...camel)`.
 *
 * @param value  The string to convert to camel case.
 * @param options The options for the function.
 * @returns The camel case string as a Uint32Array.
 *
 * @example
 * ```typescript
 * import { camelize } from '@frostyeti/slices/camelize';
 *
 * const camel = camelize("hello_world");
 * console.log(String.fromCharCode(...camel)); // Output: "HelloWorld"
 * ```
 */
export function camelize(value, options) {
  options ??= {};
  const v = toCharSliceLike(value);
  const sb = new CharArrayBuilder();
  let last = 0;
  for (let i = 0; i < value.length; i++) {
    const c = v.at(i) ?? -1;
    if (c === -1) {
      continue;
    }
    if (i === 0 && isLetter(c)) {
      sb.appendChar(toLower(c));
      last = c;
      continue;
    }
    if (isLetter(c)) {
      if (last === CHAR_UNDERSCORE) {
        sb.appendChar(toUpper(c));
        last = c;
        continue;
      }
      sb.appendChar(c);
      last = c;
      continue;
    }
    if (c === CHAR_HYPHEN_MINUS || c === CHAR_UNDERSCORE || isSpace(c)) {
      last = CHAR_UNDERSCORE;
      continue;
    }
    if (isDigit(c)) {
      last = c;
      sb.appendChar(c);
      continue;
    }
    sb.appendChar(c);
    last = c;
  }
  const r = sb.toArray();
  sb.clear();
  return r;
}
