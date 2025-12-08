/**
 * The `write-texto-file` module provides functions to write text data to a file.
 *
 * @module
 */
import { globals, loadFs, loadFsAsync } from "./globals.js";
let fn = undefined;
let fnAsync = undefined;
/**
 * Writes text data to a file.
 * @param path The path to the file.
 * @param data The text data to write.
 * @param options The options for writing the file (optional).
 * @returns A promise that resolves when the operation is complete.
 */
export function writeTextFile(path, data, options) {
  if (globals.Deno) {
    return globals.Deno.writeTextFile(path, data, options);
  }
  if (options?.signal && options?.signal.aborted) {
    const e = new Error("The operation was aborted.");
    e.name = "AbortError";
    return Promise.reject(e);
  }
  if (!fnAsync) {
    fnAsync = loadFsAsync()?.writeFile;
    if (!fnAsync) {
      throw new Error("No suitable file system module found.");
    }
  }
  const o = {};
  o.mode = options?.mode;
  o.flag = options?.append ? "a" : "w";
  if (options?.create) {
    o.flag += "+";
  }
  o.encoding = "utf8";
  if (options?.signal) {
    if (options?.signal && options?.signal.aborted) {
      const e = new Error("The operation was aborted.");
      e.name = "AbortError";
      return Promise.reject(e);
    }
    o.signal = options.signal;
  }
  return fnAsync(path, data, o);
}
/**
 * Synchronously writes text data to a file.
 * @param path The path to the file.
 * @param data The text data to write.
 * @param options The options for writing the file (optional).
 */
export function writeTextFileSync(path, data, options) {
  if (globals.Deno) {
    return globals.Deno.writeTextFileSync(path, data, options);
  }
  if (!fn) {
    fn = loadFs()?.writeFileSync;
    if (!fn) {
      throw new Error("No suitable file system module found.");
    }
  }
  const o = {};
  o.mode = options?.mode;
  o.flag = options?.append ? "a" : "w";
  if (options?.create) {
    o.flag += "+";
  }
  o.encoding = "utf8";
  if (options?.signal) {
    options.signal.throwIfAborted();
    o.signal = options.signal;
  }
  return fn(path, data, o);
}
