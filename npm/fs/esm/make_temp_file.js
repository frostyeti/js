/**
 * The `make-temp-file` module provides functions to create temporary files.
 *
 * @module
 */
import { globals, loadFs, loadFsAsync, WIN } from "./globals.js";
import { isAbsolute, join } from "@frostyeti/path";
import { exists, existsSync } from "./exists.js";
import { NotFoundError } from "./errors.js";
let fn = undefined;
let fnAsync = undefined;
function randomName(prefix, suffix) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const rng = crypto.getRandomValues(new Uint8Array(12));
  const name = Array.from(rng)
    .map((x) => chars[x % chars.length])
    .join("");
  if (prefix && suffix) {
    return `${prefix}${name}${suffix}`;
  }
  if (prefix) {
    return `${prefix}${name}`;
  }
  if (suffix) {
    return `${name}${suffix}`;
  }
  return name;
}
/**
 * Creates a temporary file.
 * @param options The options for creating the temporary file (optional).
 * @returns A promise that resolves with the path to the created temporary file.
 */
export async function makeTempFile(options) {
  if (globals.Deno) {
    return globals.Deno.makeTempFile(options);
  }
  if (!fnAsync) {
    fnAsync = loadFsAsync()?.writeFile;
    if (!fnAsync) {
      throw new Error("fs.promises.writeFile is not available");
    }
  }
  options ??= {};
  options.prefix ??= "tmp";
  let dir;
  if (!options.dir) {
    dir = WIN
      ? (globals.process.env.TEMP ?? "c:\\Temp")
      : (globals.process.env.TMPDIR ?? "/tmp");
  } else if (options.dir && !isAbsolute(options.dir)) {
    dir = WIN
      ? (globals.process.env.TEMP ?? "c:\\Temp")
      : (globals.process.env.TMPDIR ?? "/tmp");
    dir = join(dir, options.dir);
  } else {
    dir = options.dir;
  }
  const r = randomName(options.prefix, options.suffix);
  const file = join(dir, r);
  if (!await exists(dir)) {
    throw new NotFoundError(`Directory not found: ${dir}`);
  }
  await fnAsync(file, new Uint8Array(0), { mode: 0o644 });
  return file;
}
/**
 * Creates a temporary file synchronously.
 * @param options The options for creating the temporary file (optional).
 * @returns The path to the created temporary file.
 */
export function makeTempFileSync(options) {
  if (globals.Deno) {
    return globals.Deno.makeTempFileSync(options);
  }
  if (!fn) {
    fn = loadFs()?.writeFileSync;
    if (!fn) {
      throw new Error("fs.writeFileSync is not available");
    }
  }
  options ??= {};
  options.prefix ??= "tmp";
  let dir;
  if (!options.dir) {
    dir = WIN
      ? (globals.process.env.TEMP ?? "c:\\Temp")
      : (globals.process.env.TMPDIR ?? "/tmp");
  } else if (options.dir && !isAbsolute(options.dir)) {
    dir = WIN
      ? (globals.process.env.TEMP ?? "c:\\Temp")
      : (globals.process.env.TMPDIR ?? "/tmp");
    dir = join(dir, options.dir);
  } else {
    dir = options.dir;
  }
  const r = randomName(options.prefix, options.suffix);
  const file = join(dir, r);
  if (!existsSync(dir)) {
    throw new NotFoundError(`Directory not found: ${dir}`);
  }
  fn(file, new Uint8Array(0), { mode: 0o644 });
  return file;
}
