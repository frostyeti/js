/**
 * The `stat` module provides functions to get information about a file or directory.
 *
 * @module
 */
import type { FileInfo } from "./types.js";
/**
 * Gets information about a file or directory.
 * @param path The path to the file or directory.
 * @returns A promise that resolves with the file information.
 * @throws {Error} If the operation fails.
 * @example
 * ```ts
 * import { stat } from "@frostyeti/fs/stat";
 * async function getFileInfo() {
 *     try {
 *          const info = await stat("example.txt");
 *          console.log("File information:", info);
 *     } catch (error) {
 *          console.error("Error getting file information:", error);
 *     }
 * }
 * await getFileInfo();
 * ```
 */
export declare function stat(path: string | URL): Promise<FileInfo>;
/**
 * Gets information about a file or directory synchronously.
 * @param path The path to the file or directory.
 * @returns The file information.
 * @throws {Error} If the operation fails.
 * @example
 * ```ts
 * import { statSync } from "@frostyeti/fs/stat";
 * function getFileInfo() {
 *     try {
 *         const info = statSync("example.txt");
 *         console.log("File information:", info);
 *     } catch (error) {
 *         console.error("Error getting file information:", error);
 *     }
 * }
 * getFileInfo();
 * ```
 */
export declare function statSync(path: string | URL): FileInfo;
