import { globals } from "@frostyeti/globals/globals";
let ep = undefined;
/**
 * Returns the path to the executable that started the process. Mainly
 * deno, node, bun, or empty string.
 *
 * @description
 * When running in Deno, this function will request read permission
 * if it is not already granted. If the permission is denied, the function
 * will return an empty string.
 *
 * @returns The path to the executable that started the process.
 * @example
 *
 * ```ts
 * import { execPath } from "@frostyeti/process";
 *
 * console.log(execPath());
 * // Output: "/usr/local/bin/deno" or "/usr/local/bin/node" or "/home/user/.deno/bin/deno"
 * ```
 */
export function execPath() {
  if (typeof ep === "string") {
    return ep ??= "";
  }
  if (globals.Deno) {
    try {
      const readPermission = globals.Deno.permissions.querySync({
        name: "read",
      });
      if (readPermission.state === "granted") {
        ep = globals.Deno.execPath();
      } else {
        // Permission denied or not granted - return empty string
        ep = "";
      }
      return ep ??= "";
    } catch {
      // Permission check failed - return empty string
      ep = "";
      return ep;
    }
  } else if (globals.process) {
    return globals.process.execPath;
  } else {
    return "";
  }
}
