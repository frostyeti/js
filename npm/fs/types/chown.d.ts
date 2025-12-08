/**
 * Changes the owner and group of a file or directory asynchronously.
 * @param path The path to the file or directory.
 * @param uid The new owner user ID.
 * @param gid The new owner group ID.
 * @returns A promise that resolves when the operation is complete.
 * @throws {Error} If the operation fails.
 * @example
 * ```ts
 * import { chown } from "@frostyeti/fs/chown";
 * async function changeOwner() {
 *     try {
 *         await chown("example.txt", 1000, 1000);
 *         console.log("Owner changed successfully.");
 *     } catch (error) {
 *         console.error("Error changing owner:", error);
 *     }
 * }
 * await changeOwner();
 * ```
 */
export declare function chown(
  path: string | URL,
  uid: number,
  gid: number,
): Promise<void>;
/**
 * Changes the owner and group of a file or directory synchronously.
 * @param path The path to the file or directory.
 * @param uid The new owner user ID.
 * @param gid The new owner group ID.
 * @throws {Error} If the operation fails.
 * @example
 * ```ts
 * import { chownSync } from "@frostyeti/fs/chown";
 * function changeOwner() {
 *      try {
 *          chownSync("example.txt", 1000, 1000);
 *          console.log("Owner changed successfully.");
 *      } catch (error) {
 *          console.error("Error changing owner:", error);
 *      }
 * }
 * changeOwner();
 * ```
 */
export declare function chownSync(
  path: string | URL,
  uid: number,
  gid: number,
): void;
