// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.

import { _format, assertArg } from "../_common/format.ts";
import type { ParsedPath } from "../types.ts";

/**
 * Generate a path from `ParsedPath` object.
 *
 * @example Usage
 * ```ts
 * import { format } from "@frostyeti/path/posix/format";
 * import { equal } from "@frostyeti/assert";
 *
 * const path = format({
 *   root: "/",
 *   dir: "/path/dir",
 *   base: "file.txt",
 *   ext: ".txt",
 *   name: "file"
 * });
 * equal(path, "/path/dir/file.txt");
 * ```
 *
 * @param pathObject The path object to format.
 * @returns The formatted path.
 */
export function format(pathObject: Partial<ParsedPath>): string {
    assertArg(pathObject);
    return _format("/", pathObject);
}
