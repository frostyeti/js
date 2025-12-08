/**
 * The `walk` module provides functions to recursively walk through a directory
 * and yield information about each file and directory encountered.
 *
 * @module
 */
import { join, normalize } from "@frostyeti/path";
import { createWalkEntry, createWalkEntrySync, toPathString } from "./utils.js";
import { lstat, lstatSync } from "./lstat.js";
import { readDir, readDirSync } from "./read_dir.js";
import { realPath, realPathSync } from "./realpath.js";
/** Error thrown in {@linkcode walk} or {@linkcode walkSync} during iteration. */
export class WalkError extends Error {
  /** File path of the root that's being walked. */
  root;
  /** Constructs a new instance. */
  constructor(cause, root) {
    super(
      `${cause instanceof Error ? cause.message : cause} for path "${root}"`,
    );
    this.cause = cause;
    this.name = this.constructor.name;
    this.root = root;
  }
}
function include(path, exts, match, skip) {
  if (exts && !exts.some((ext) => path.endsWith(ext))) {
    return false;
  }
  if (match && !match.some((pattern) => !!path.match(pattern))) {
    return false;
  }
  if (skip && skip.some((pattern) => !!path.match(pattern))) {
    return false;
  }
  return true;
}
function wrapErrorWithPath(err, root) {
  if (err instanceof WalkError) {
    return err;
  }
  return new WalkError(err, root);
}
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
export async function* walk(root, {
  maxDepth = Infinity,
  includeFiles = true,
  includeDirs = true,
  includeSymlinks = true,
  followSymlinks = false,
  canonicalize = true,
  exts = undefined,
  match = undefined,
  skip = undefined,
} = {}) {
  if (maxDepth < 0) {
    return;
  }
  root = toPathString(root);
  if (includeDirs && include(root, exts, match, skip)) {
    yield await createWalkEntry(root);
  }
  if (maxDepth < 1 || !include(root, undefined, undefined, skip)) {
    return;
  }
  try {
    for await (const entry of readDir(root)) {
      let path = join(root, entry.name);
      let { isSymlink, isDirectory } = entry;
      if (isSymlink) {
        if (!followSymlinks) {
          if (includeSymlinks && include(path, exts, match, skip)) {
            yield { path, ...entry };
          }
          continue;
        }
        const rp = await realPath(path);
        if (canonicalize) {
          path = rp;
        }
        // Caveat emptor: don't assume |path| is not a symlink. realpath()
        // resolves symlinks but another process can replace the file system
        // entity with a different type of entity before we call lstat().
        ({ isSymlink, isDirectory } = await lstat(rp));
      }
      if (isSymlink || isDirectory) {
        yield* walk(path, {
          maxDepth: maxDepth - 1,
          includeFiles,
          includeDirs,
          includeSymlinks,
          followSymlinks,
          exts,
          match,
          skip,
        });
      } else if (includeFiles && include(path, exts, match, skip)) {
        yield { path, ...entry };
      }
    }
  } catch (err) {
    throw wrapErrorWithPath(err, normalize(root));
  }
}
/** Same as {@linkcode walk} but uses synchronous ops */
export function* walkSync(root, {
  maxDepth = Infinity,
  includeFiles = true,
  includeDirs = true,
  includeSymlinks = true,
  followSymlinks = false,
  canonicalize = true,
  exts = undefined,
  match = undefined,
  skip = undefined,
} = {}) {
  root = toPathString(root);
  if (maxDepth < 0) {
    return;
  }
  if (includeDirs && include(root, exts, match, skip)) {
    yield createWalkEntrySync(root);
  }
  if (maxDepth < 1 || !include(root, undefined, undefined, skip)) {
    return;
  }
  let entries;
  try {
    entries = readDirSync(root);
  } catch (err) {
    throw wrapErrorWithPath(err, normalize(root));
  }
  for (const entry of entries) {
    let path = join(root, entry.name);
    let { isSymlink, isDirectory } = entry;
    if (isSymlink) {
      if (!followSymlinks) {
        if (includeSymlinks && include(path, exts, match, skip)) {
          yield { path, ...entry };
        }
        continue;
      }
      const realPath = realPathSync(path);
      if (canonicalize) {
        path = realPath;
      }
      // Caveat emptor: don't assume |path| is not a symlink. realpath()
      // resolves symlinks but another process can replace the file system
      // entity with a different type of entity before we call lstat().
      ({ isSymlink, isDirectory } = lstatSync(realPath));
    }
    if (isSymlink || isDirectory) {
      yield* walkSync(path, {
        maxDepth: maxDepth - 1,
        includeFiles,
        includeDirs,
        includeSymlinks,
        followSymlinks,
        exts,
        match,
        skip,
      });
    } else if (includeFiles && include(path, exts, match, skip)) {
      yield { path, ...entry };
    }
  }
}
