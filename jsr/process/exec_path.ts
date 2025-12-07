import { globals } from "@frostyeti/globals/globals";

let ep: string | undefined = undefined;

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
export function execPath(): string {
    if (typeof ep === "string") {
        return ep ??= "";
    }

    if (globals.Deno) {
        try {
            let readPermission = globals.Deno.permissions.requestSync({ name: "read" });
            if (readPermission.state === "prompt") {
                console.log("Read permission is requred for Deno.execPath()");
                readPermission = globals.Deno.permissions.requestSync({ name: "read" });
            }

            if (readPermission.state === "granted") {
                ep = globals.Deno.execPath();
            } else {
                console.warn("Deno.execPath() permission denied. setting to empty string");
                ep = "";
            }
            return ep ??= "";
        } catch {
            console.warn("Deno.execPath() permission denied. setting to empty string");
            ep = "";
            return ep;
        }
    } else if (globals.process) {
        return globals.process.execPath;
    } else {
        return "";
    }
}
