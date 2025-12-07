/**
 * provides the pascalize function that converts a string to PascalCase.
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
 * @param str
 * @returns
 */
export function pascalize(str) {
  const v = toCharSliceLike(str);
  const sb = new CharArrayBuilder();
  let last = 0;
  for (let i = 0; i < v.length; i++) {
    const c = v.at(i) ?? -1;
    if (c === -1) {
      continue;
    }
    if (i === 0 && isLetter(c)) {
      sb.appendChar(toUpper(c));
      last = c;
      continue;
    }
    if (isLetter(c)) {
      if (last === CHAR_UNDERSCORE) {
        sb.appendChar(toUpper(c));
        last = c;
        continue;
      }
      sb.appendChar(toLower(c));
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
