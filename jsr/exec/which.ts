/**
 * The `which` module provides a way to find the full path of an executable file
 * given its name.
 *
 * @module
 */

import { expand, get, getPath, splitPath } from "@frostyeti/env";
import { basename, extname, isAbsolute, join, resolve } from "@frostyeti/path";
import { isdir, isdirSync, isfile, isfileSync, readdir, readdirSync } from "@frostyeti/fs";
import { WIN } from "./globals.ts";
import { isNullOrSpace } from "@frostyeti/strings/is-space";
import { isNullOrEmpty } from "@frostyeti/strings/is-empty";
import { endsWithFold } from "@frostyeti/strings/ends-with";

const executableCache: { [key: string]: string | undefined } = {};

/**
 * which - Returns the full path of the executable file of the given program;
 * otherwise, returns undefined.
 *
 * @remarks The returned path is the full path of the executable file of the given program
 * if the program can be found in the system PATH environment variable or
 * using any of the paths from `prependedPaths` if specified.
 *
 * By default, `which` will cache the first lookup and then use the cache
 * for subsequent lookups unless `useCache` is set to false.
 *
 * @param {string} fileName The program file name.
 * @param {(string[] | undefined)} prependPath The paths to prepend to the PATH environment variable.
 * @param {IEnvironment} env The environment class to use to lookup environment variables. Defaults to `envDefault`.
 * @param {boolean} useCache
 * @returns {string | undefined}
 * @example
 * ```ts
 * import { whichSync } from "@frostyeti/exec";
 *
 * // Find an executable on the PATH
 * const gitPath = whichSync("git");
 * console.log(gitPath); // "/usr/bin/git" or undefined
 *
 * // Search with additional paths
 * const customPath = whichSync("my-tool", ["/opt/tools/bin"]);
 *
 * // Disable caching for fresh lookup
 * const freshPath = whichSync("node", undefined, false);
 * ```
 */
export function whichSync(
    fileName: string,
    prependPath?: string[],
    useCache = true,
    debug = false,
): string | undefined {
    if (isNullOrSpace(fileName)) {
        throw new Error("Argument 'fileName' cannot be null or empty.");
    }

    const rootName = basename(fileName, extname(fileName));
    let location = executableCache[rootName];
    if (useCache && location !== undefined) {
        return location;
    }

    if (isAbsolute(fileName) && isfileSync(fileName)) {
        location = fileName;
        if (useCache) {
            executableCache[rootName] = location;
            executableCache[fileName] = location;
        }

        return location;
    }

    prependPath = prependPath?.map<string>((o) => {
        if (isAbsolute(o)) {
            return o;
        }

        return resolve(o);
    });

    const baseName = basename(fileName);
    const baseNameLowered = baseName.toLowerCase();

    const systemPaths = splitPath(getPath())
        .filter((segment) => segment.length > 0)
        .map((segment) => expand(segment));

    const pathSegments = prependPath !== undefined ? prependPath.concat(systemPaths) : systemPaths;
    let pathExtSegments: string[] = [];

    if (WIN) {
        const pe = get("PATHEXT") || "";
        const pathExtensions = !isNullOrSpace(pe)
            ? pe?.toLowerCase()
            : ".com;.exe;.bat;.cmd;.vbs;.vbe;.js;.jse;.wsf;.wsh";

        pathExtSegments = pathExtensions.split(";")
            .filter((segment) => !isNullOrSpace(segment));
    }

    for (const pathSegment of pathSegments) {
        if (isNullOrEmpty(pathSegment) || !isdirSync(pathSegment)) {
            continue;
        }

        if (WIN) {
            const hasPathExt = pathExtSegments.find((segment) =>
                endsWithFold(fileName, segment)
            ) !== undefined;

            if (!hasPathExt) {
                try {
                    let first: { name: string | undefined } | undefined;

                    for (const entry of readdirSync(pathSegment)) {
                        if (entry.isFile) {
                            for (const ext of pathExtSegments) {
                                if (entry.name?.toLowerCase() === baseNameLowered + ext) {
                                    first = entry;
                                    break;
                                }
                            }

                            if (first) {
                                break;
                            }
                        }
                    }

                    if (first?.name) {
                        location = join(pathSegment, first.name);
                        executableCache[rootName] = location;
                        executableCache[fileName] = location;

                        return location;
                    }
                } catch (e) {
                    if (debug) {
                        console.debug(e);
                    }
                }
            } else {
                try {
                    let first: { name: string | undefined } | undefined;
                    for (const entry of readdirSync(pathSegment)) {
                        if (entry.isFile && entry.name?.toLowerCase() === baseNameLowered) {
                            first = entry;
                            break;
                        }
                    }

                    if (first?.name) {
                        location = join(pathSegment, first.name);
                        executableCache[rootName] = location;
                        executableCache[fileName] = location;

                        return location;
                    }
                } catch (e) {
                    if (debug) {
                        console.debug(e);
                    }
                }
            }
        } else {
            try {
                let first: { name: string | undefined } | undefined;
                for (const entry of readdirSync(pathSegment)) {
                    if (entry.isFile && entry.name?.toLowerCase() === baseNameLowered) {
                        first = entry;
                        break;
                    }
                }

                if (first?.name) {
                    location = join(pathSegment, first.name);
                    executableCache[rootName] = location;
                    executableCache[fileName] = location;

                    return location;
                }
            } catch (e) {
                if (debug) {
                    console.debug(e);
                }
            }
        }
    }

    return undefined;
}

/**
 * which - Returns the full path of the executable file of the given program;
 * otherwise, returns undefined.
 *
 * @remarks The returned path is the full path of the executable file of the given program
 * if the program can be found in the system PATH environment variable or
 * using any of the paths from `prependedPaths` if specified.
 *
 * By default, `which` will cache the first lookup and then use the cache
 * for subsequent lookups unless `useCache` is set to false.
 *
 * @param {string} fileName The program file name.
 * @param {(string[] | undefined)} prependPath The paths to prepend to the PATH environment variable.
 * @param {IEnvironment} env The environment class to use to lookup environment variables. Defaults to `envDefault`.
 * @param {boolean} useCache
 * @returns {string | undefined}
 * @example
 * ```ts
 * import { which } from "@frostyeti/exec";
 *
 * // Find an executable on the PATH
 * const gitPath = await which("git");
 * console.log(gitPath); // "/usr/bin/git" or undefined
 *
 * // Check if an executable exists
 * const hasDocker = await which("docker") !== undefined;
 * console.log("Docker installed:", hasDocker);
 *
 * // Search with additional paths
 * const toolPath = await which("my-tool", ["/opt/custom/bin"]);
 * ```
 */
export async function which(
    fileName: string,
    prependPath?: string[],
    useCache = true,
    debug = false,
): Promise<string | undefined> {
    if (isNullOrSpace(fileName)) {
        throw new Error("Argument 'fileName' cannot be null or empty.");
    }

    const rootName = basename(fileName, extname(fileName));
    let location = executableCache[rootName];
    if (useCache && location !== undefined) {
        return location;
    }

    if (isAbsolute(fileName) && await isfile(fileName)) {
        location = fileName;
        if (useCache) {
            executableCache[rootName] = location;
            executableCache[fileName] = location;
        }

        return location;
    }

    prependPath = prependPath?.map<string>((o) => {
        if (isAbsolute(o)) {
            return o;
        }

        return resolve(o);
    });

    const baseName = basename(fileName);
    const baseNameLowered = baseName.toLowerCase();

    const systemPaths = splitPath()
        .filter((segment) => segment.length)
        .map((segment) => expand(segment));

    const pathSegments = prependPath !== undefined ? prependPath.concat(systemPaths) : systemPaths;
    let pathExtSegments: string[] = [];

    if (WIN) {
        const pe = get("PATHEXT") || "";
        const pathExtensions = !isNullOrSpace(pe)
            ? pe?.toLowerCase()
            : ".com;.exe;.bat;.cmd;.vbs;.vbe;.js;.jse;.wsf;.wsh";

        pathExtSegments = pathExtensions.split(";")
            .filter((segment) => !isNullOrSpace(segment));
    }

    for (const pathSegment of pathSegments) {
        if (isNullOrEmpty(pathSegment)) {
            continue;
        }

        const isDirectory = await isdir(pathSegment);
        if (!isDirectory) {
            continue;
        }

        if (WIN) {
            const hasPathExt = pathExtSegments.find((segment) =>
                endsWithFold(fileName, segment)
            ) !== undefined;

            if (!hasPathExt) {
                try {
                    let first: { name: undefined | string } | undefined;
                    for await (const entry of readdir(pathSegment)) {
                        if (!entry.isDirectory) {
                            for (const ext of pathExtSegments) {
                                if (entry.name?.toLowerCase() === baseNameLowered + ext) {
                                    first = entry;
                                    break;
                                }
                            }

                            if (first) {
                                break;
                            }
                        }
                    }

                    if (first?.name) {
                        location = join(pathSegment, first.name);
                        executableCache[rootName] = location;
                        executableCache[fileName] = location;

                        return location;
                    }
                } catch (e) {
                    if (debug) {
                        console.debug(e);
                    }
                }
            } else {
                try {
                    let first: { name: undefined | string } | undefined;
                    for await (const entry of readdir(pathSegment)) {
                        if (
                            !entry.isDirectory &&
                            entry.name?.toLowerCase() === baseNameLowered
                        ) {
                            first = entry;
                            break;
                        }
                    }

                    if (first?.name) {
                        location = join(pathSegment, first.name);
                        executableCache[rootName] = location;
                        executableCache[fileName] = location;

                        return location;
                    }
                } catch (e) {
                    if (debug) {
                        console.debug(e);
                    }
                }
            }
        } else {
            try {
                let first: { name: undefined | string } | undefined;
                for await (const entry of readdir(pathSegment)) {
                    if (
                        !entry.isDirectory && entry.name?.toLowerCase() === baseNameLowered
                    ) {
                        first = entry;
                        break;
                    }
                }

                if (first?.name) {
                    location = join(pathSegment, first.name);
                    executableCache[rootName] = location;
                    executableCache[fileName] = location;

                    return location;
                }
            } catch (e) {
                if (debug) {
                    console.debug(e);
                }
            }
        }
    }

    return undefined;
}
