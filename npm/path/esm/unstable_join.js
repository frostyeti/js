// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.
import { isWindows } from "./_os.js";
import { join as posixUnstableJoin } from "./posix/unstable_join.js";
import { join as windowsUnstableJoin } from "./windows/unstable_join.js";
/**
 * Join all given a sequence of `paths`, then normalizes the resulting path.
 *
 * @experimental **UNSTABLE**: New API, yet to be vetted.
 *
 * @example Usage
 * ```ts
 * import { join } from "@frostyeti/path/unstable-join";
 * import { equal } from "@frostyeti/assert";
 *
 * if (Deno.build.os === "windows") {
 *   const path = join(new URL("file:///C:/foo"), "bar", "baz/asdf", "quux", "..");
 *   equal(path, "C:\\foo\\bar\\baz\\asdf");
 * } else {
 *   const path = join(new URL("file:///foo"), "bar", "baz/asdf", "quux", "..");
 *   equal(path, "/foo/bar/baz/asdf");
 * }
 * ```
 *
 * @param path The path to join. This can be string or file URL.
 * @param paths The paths to join.
 * @returns The joined path.
 */
export function join(path, ...paths) {
  return isWindows
    ? windowsUnstableJoin(path, ...paths)
    : posixUnstableJoin(path, ...paths);
}
