/**
 * The copy-file module provides functions to copy files synchronously and asynchronously.
 *
 * @module
 */
/**
 * Copies a file asynchronously.
 * @param from The path to the source file.
 * @param to The path to the destination file.
 * @returns A promise that resolves when the operation is complete.
 * @throws {Error} If the operation fails.
 * @example
 * ```ts
 * import { copyFile } from "@frostyeti/fs/copy-file";
 * async function copy() {
 *    try {
 *       await copyFile("source.txt", "destination.txt");
 *       console.log("File copied successfully.");
 *   } catch (error) {
 *       console.error("Error copying file:", error);
 *   }
 * }
 * await copy();
 * ```
 */
export declare function copyFile(
  from: string | URL,
  to: string | URL,
): Promise<void>;
/**
 * Synchronously copies a file.
 * @param from The path to the source file.
 * @param to The path to the destination file.
 * @throws {Error} If the operation fails.
 * @example
 * ```ts
 * import { copyFileSync } from "@frostyeti/fs/copy-file";
 * function copy() {
 *   try {
 *      copyFileSync("source.txt", "destination.txt");
 *      console.log("File copied successfully.");
 *   } catch (error) {
 *      console.error("Error copying file:", error);
 *   }
 * }
 * copy();
 * ```
 */
export declare function copyFileSync(
  from: string | URL,
  to: string | URL,
): void;
