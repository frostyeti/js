/**
 * The `lstat` module provides functions to get information about a file or directory.
 *
 * @module
 */
import { basename } from "@frostyeti/path";
import { globals, loadFs, loadFsAsync } from "./globals.js";
let ls;
let lsAsync;
/**
 * Gets information about a file or directory.
 * @param path The path to the file or directory.
 * @returns A promise that resolves with the file information.
 */
export function lstat(path) {
  if (globals.Deno) {
    // deno-lint-ignore no-explicit-any
    return globals.Deno.lstat(path).then((stat) => {
      const p = path instanceof URL ? path.toString() : path;
      return {
        isFile: stat.isFile,
        isDirectory: stat.isDirectory,
        isSymlink: stat.isSymlink,
        name: basename(p),
        path: p,
        size: stat.size,
        birthtime: stat.birthtime,
        mtime: stat.mtime,
        atime: stat.atime,
        mode: stat.mode,
        uid: stat.uid,
        gid: stat.gid,
        dev: stat.dev,
        blksize: stat.blksize,
        ino: stat.ino,
        nlink: stat.nlink,
        rdev: stat.rdev,
        blocks: stat.blocks,
        isBlockDevice: stat.isBlockDevice,
        isCharDevice: stat.isCharDevice,
        isSocket: stat.isSocket,
        isFifo: stat.isFifo,
      };
    });
  }
  if (!lsAsync) {
    lsAsync = loadFsAsync()?.lstat;
    if (!lsAsync) {
      throw new Error("No suitable file system module found.");
    }
  }
  return lsAsync(path).then((stat) => {
    const p = path instanceof URL ? path.toString() : path;
    return {
      isFile: stat.isFile(),
      isDirectory: stat.isDirectory(),
      isSymlink: stat.isSymbolicLink(),
      name: basename(p),
      path: p,
      size: stat.size,
      birthtime: stat.birthtime,
      mtime: stat.mtime,
      atime: stat.atime,
      mode: stat.mode,
      uid: stat.uid,
      gid: stat.gid,
      dev: stat.dev,
      blksize: stat.blksize,
      ino: stat.ino,
      nlink: stat.nlink,
      rdev: stat.rdev,
      blocks: stat.blocks,
      isBlockDevice: stat.isBlockDevice(),
      isCharDevice: stat.isCharacterDevice(),
      isSocket: stat.isSocket(),
      isFifo: stat.isFIFO(),
    };
  });
}
/**
 * Gets information about a file or directory synchronously.
 * @param path The path to the file or directory.
 * @returns The file information.
 */
export function lstatSync(path) {
  if (globals.Deno) {
    const stat = globals.Deno.lstatSync(path);
    const p = path instanceof URL ? path.toString() : path;
    return {
      isFile: stat.isFile,
      isDirectory: stat.isDirectory,
      isSymlink: stat.isSymlink,
      name: basename(p),
      path: p,
      size: stat.size,
      birthtime: stat.birthtime,
      mtime: stat.mtime,
      atime: stat.atime,
      mode: stat.mode,
      uid: stat.uid,
      gid: stat.gid,
      dev: stat.dev,
      blksize: stat.blksize,
      ino: stat.ino,
      nlink: stat.nlink,
      rdev: stat.rdev,
      blocks: stat.blocks,
      isBlockDevice: stat.isBlockDevice,
      isCharDevice: stat.isCharDevice,
      isSocket: stat.isSocket,
      isFifo: stat.isFifo,
    };
  }
  if (!ls) {
    ls = loadFs()?.lstatSync;
    if (!ls) {
      throw new Error("No suitable file system module found.");
    }
  }
  const stat = ls(path);
  const p = path instanceof URL ? path.toString() : path;
  return {
    isFile: stat.isFile(),
    isDirectory: stat.isDirectory(),
    isSymlink: stat.isSymbolicLink(),
    name: basename(p),
    path: p,
    size: stat.size,
    birthtime: stat.birthtime,
    mtime: stat.mtime,
    atime: stat.atime,
    mode: stat.mode,
    uid: stat.uid,
    gid: stat.gid,
    dev: stat.dev,
    blksize: stat.blksize,
    ino: stat.ino,
    nlink: stat.nlink,
    rdev: stat.rdev,
    blocks: stat.blocks,
    isBlockDevice: stat.isBlockDevice(),
    isCharDevice: stat.isCharacterDevice(),
    isSocket: stat.isSocket(),
    isFifo: stat.isFIFO(),
  };
}
