/**
 * The `uid` module provides a function to get the current user id on POSIX platforms.
 *
 * @module
 */
import { globals } from "./globals.js";
/**
 * Gets the current user id on POSIX platforms.
 * Returns `null` on Windows.
 */
export function uid() {
  if (globals.Deno) {
    return globals.Deno.uid();
  }
  if (globals.process && globals.process.getuid) {
    const uid = globals.process.getuid();
    if (uid === -1 || uid === undefined) {
      return null;
    }
    return uid;
  }
  return null;
}
