import { WINDOWS } from "@frostyeti/globals/os";
import { isSpace } from "@frostyeti/chars/is-space";
function containsWindowsSpecialChars(value) {
  const set = [];
  for (let i = 0; i < value.length; i++) {
    const c = value.codePointAt(i);
    // space or double quote
    if (c === 32 || c === 34) { // double quote, single quote, backslash
      return { found: true, codePoints: undefined };
    }
    set.push(c ?? 0);
  }
  return { found: false, codePoints: set };
}
function containsSpecialChars(value) {
  const set = [];
  for (let i = 0; i < value.length; i++) {
    const c = value.codePointAt(i) ?? 0;
    // space, double quote, single quote, backslash
    if (
      c === 36 || c === 96 || c === 34 || c === 92 || c === 39 || isSpace(c)
    ) { // dollar sign, backtick, double quote, backslash, single quote
      return { found: true, codePoints: undefined };
    }
    set.push(c ?? 0);
  }
  return { found: false, codePoints: set };
}
export function windowsJoin(args) {
  const sb = [];
  for (const arg of args) {
    if (sb.length > 0) {
      sb.push(32); // space character
    }
    const { found, codePoints } = containsWindowsSpecialChars(arg);
    if (!found) {
      sb.push(...(codePoints ?? []));
      continue;
    }
    let backslashCount = 0;
    sb.push(34); // open double quote
    for (let i = 0; i < arg.length; i++) {
      const c = arg.codePointAt(i);
      switch (c) {
        // backslash
        case 92:
          backslashCount++;
          continue;
        // double quote
        case 34: {
          const times = (2 * backslashCount) + 1;
          backslashCount = 0;
          if (times > 0) {
            sb.push(...Array(times).fill(92));
          }
          sb.push(34); // close double quote
          continue;
        }
        default:
          if (backslashCount > 0) {
            if (backslashCount === 1) {
              sb.push(92);
            } else {
              sb.push(...Array(backslashCount).fill(92));
            }
            backslashCount = 0;
          }
          sb.push(c ?? 0);
          continue;
      }
    }
    if (backslashCount > 0) {
      if (backslashCount === 1) {
        sb.push(92);
      } else {
        sb.push(...Array(backslashCount).fill(92));
      }
      backslashCount = 0;
    }
    sb.push(34); // close double quote
  }
  const ret = String.fromCodePoint(...sb);
  sb.length = 0; // clear the buffer
  return ret;
}
export function unixJoin(args) {
  const sb = [];
  for (let i = 0; i < args.length; i++) {
    if (sb.length > 0) {
      sb.push(32); // space character
    }
    const c = args[i];
    const { found, codePoints } = containsSpecialChars(c);
    if (!found) {
      sb.push(...(codePoints ?? []));
      continue;
    }
    sb.push(34); // open double quote
    for (let j = 0; j < c.length; j++) {
      const k = c.codePointAt(j);
      // dollar sign, backtick, double quote, backslash
      if (k === 36 || k === 96 || k === 34 || k === 92) {
        sb.push(92); // add backslash before special character
      }
      sb.push(k ?? 0);
    }
    sb.push(34); // close double quote
  }
  const ret = String.fromCodePoint(...sb);
  sb.length = 0; // clear the buffer
  return ret;
}
/**
 * Joins command arguments into a single string.
 * @param args The command arguments to join.
 * @returns The joined command arguments.
 */
export function join(args) {
  return WINDOWS ? windowsJoin(args) : unixJoin(args);
}
