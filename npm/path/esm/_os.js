// deno-lint-ignore-file no-explicit-any
// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.
import { globals } from "./globals.js";
// Check Deno, then the remaining runtimes (e.g. Node, Bun and the browser)
export const isWindows = globals.Deno?.build.os === "windows" ||
  globals.navigator?.platform?.startsWith("Win") ||
  globals.process?.platform?.startsWith("win") ||
  false;
