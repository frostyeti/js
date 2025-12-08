/**
 * The `walk` module provides functions to recursively walk through a directory
 * and yield information about each file and directory encountered.
 *
 * @module
 */
import type { WalkEntry } from "./types.js";
/** Error thrown in {@linkcode walk} or {@linkcode walkSync} during iteration. */
export declare class WalkError extends Error {
  /** File path of the root that's being walked. */
  root: string;
  /** Constructs a new instance. */
  constructor(cause: unknown, root: string);
}
/** Options for {@linkcode walk} and {@linkcode walkSync}. */
export interface WalkOptions {
  /**
   * The maximum depth of the file tree to be walked recursively.
   *
   * @default {Infinity}
   */
  maxDepth?: number;
  /**
   * Indicates whether file entries should be included or not.
   *
   * @default {true}
   */
  includeFiles?: boolean;
  /**
   * Indicates whether directory entries should be included or not.
   *
   * @default {true}
   */
  includeDirs?: boolean;
  /**
   * Indicates whether symlink entries should be included or not.
   * This option is meaningful only if `followSymlinks` is set to `false`.
   *
   * @default {true}
   */
  includeSymlinks?: boolean;
  /**
   * Indicates whether symlinks should be resolved or not.
   *
   * @default {false}
   */
  followSymlinks?: boolean;
  /**
   * Indicates whether the followed symlink's path should be canonicalized.
   * This option works only if `followSymlinks` is not `false`.
   *
   * @default {true}
   */
  canonicalize?: boolean;
  /**
   * List of file extensions used to filter entries.
   * If specified, entries without the file extension specified by this option
   * are excluded.
   *
   * @default {undefined}
   */
  exts?: string[];
  /**
   * List of regular expression patterns used to filter entries.
   * If specified, entries that do not match the patterns specified by this
   * option are excluded.
   *
   * @default {undefined}
   */
  match?: RegExp[];
  /**
   * List of regular expression patterns used to filter entries.
   * If specified, entries matching the patterns specified by this option are
   * excluded.
   *
   * @default {undefined}
   */
  skip?: RegExp[];
}
export type { WalkEntry };
/**
 * Recursively walks through a directory and yields information about each file
 * and directory encountered.
 *
 * @param root The root directory to start the walk from, as a string or URL.
 * @param options The options for the walk.
 * @returns An async iterable iterator that yields `WalkEntry` objects.
 *
 * @example Basic usage
 *
 * File structure:
 * ```
 * folder
 * ├── script.ts
 * └── foo.ts
 * ```
 *
 * ```ts
 * import { walk } from "@frostyeti/fs";
 *
 * const entries = [];
 * for await (const entry of walk(".")) {
 *   entries.push(entry);
 * }
 *
 * entries[0]!.path; // "folder"
 * entries[0]!.name; // "folder"
 * entries[0]!.isFile; // false
 * entries[0]!.isDirectory; // true
 * entries[0]!.isSymlink; // false
 *
 * entries[1]!.path; // "folder/script.ts"
 * entries[1]!.name; // "script.ts"
 * entries[1]!.isFile; // true
 * entries[1]!.isDirectory; // false
 * entries[1]!.isSymlink; // false
 * ```
 */
export declare function walk(
  root: string | URL,
  {
    maxDepth,
    includeFiles,
    includeDirs,
    includeSymlinks,
    followSymlinks,
    canonicalize,
    exts,
    match,
    skip,
  }?: WalkOptions,
): AsyncIterableIterator<WalkEntry>;
/** Same as {@linkcode walk} but uses synchronous ops */
export declare function walkSync(
  root: string | URL,
  {
    maxDepth,
    includeFiles,
    includeDirs,
    includeSymlinks,
    followSymlinks,
    canonicalize,
    exts,
    match,
    skip,
  }?: WalkOptions,
): IterableIterator<WalkEntry>;
