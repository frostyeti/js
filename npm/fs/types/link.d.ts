/**
 * The `link` module provides functions to create hard links to files.
 *
 * @module
 */
/**
 * Creates a hard link.
 * @param oldPath The path to the existing file.
 * @param newPath The path to the new link.
 * @returns A promise that resolves when the operation is complete.
 * @throws {Error} If the operation fails.
 * @example
 * ```ts
 * import { link } from "@frostyeti/fs/link";
 * async function createLink() : Promise<void> {
 *     try {
 *         await link("source.txt", "link.txt");
 *         console.log("Link created successfully.");
 *     } catch (error) {
 *         console.error("Error creating link:", error);
 *     }
 * }
 * await createLink();
 * ```
 */
export declare function link(
  oldPath: string | URL,
  newPath: string | URL,
): Promise<void>;
/**
 * Synchronously creates a hard link.
 * @param oldPath The path to the existing file.
 * @param newPath The path to the new link.
 * @throws {Error} If the operation fails.
 * @example
 * ```ts
 * import { linkSync } from "@frostyeti/fs/link";
 * function createLink() {
 *   try {
 *      linkSync("source.txt", "link.txt");
 *      console.log("Link created successfully.");
 *   } catch (error) {
 *      console.error("Error creating link:", error);
 *   }
 * }
 * createLink();
 * ```
 */
export declare function linkSync(
  oldPath: string | URL,
  newPath: string | URL,
): void;
