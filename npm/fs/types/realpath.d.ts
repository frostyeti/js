/**
 * Resolves the real path of a file or directory.
 * @param path The path to the file or directory.
 * @returns A promise that resolves with the real path as a string.
 */
export declare function realPath(path: string | URL): Promise<string>;
/**
 * Synchronously resolves the real path of a file or directory.
 * @param path The path to the file or directory.
 * @returns The real path as a string.
 */
export declare function realPathSync(path: string | URL): string;
