/**
 * Changes the access time and modification time of a file or directory.
 * @param path The path to the file or directory.
 * @param atime The new access time.
 * @param mtime The new modification time.
 * @returns A promise that resolves when the operation is complete.
 */
export declare function utime(
  path: string | URL,
  atime: number | Date,
  mtime: number | Date,
): Promise<void>;
/**
 * Synchronously changes the access time and modification time of a file or directory.
 * @param path The path to the file or directory.
 * @param atime The new access time.
 * @param mtime The new modification time.
 */
export declare function utimeSync(
  path: string | URL,
  atime: number | Date,
  mtime: number | Date,
): void;
