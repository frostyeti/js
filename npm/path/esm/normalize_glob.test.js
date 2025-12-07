// Copyright 2018-2025 the Deno authors. MIT license.
import { test } from "node:test";
import { equal, throws } from "@frostyeti/assert";
import { normalizeGlob } from "./normalize_glob.js";
import * as posix from "./posix/mod.js";
import * as windows from "./windows/mod.js";
import { SEPARATOR } from "./constants.js";
test("path::normalizeGlob() checks options.globstar", function () {
  equal(
    normalizeGlob(`**${SEPARATOR}..`, { globstar: true }),
    `**${SEPARATOR}..`,
  );
});
test("path::normalizeGlob() throws if it contains \\0 character", () => {
  throws(
    () => {
      posix.normalizeGlob("\0");
    },
    Error,
    "Glob contains invalid characters:",
  );
  throws(
    () => {
      windows.normalizeGlob("\0");
    },
    Error,
    "Glob contains invalid characters:",
  );
});
test("normalizeGlob() works as the same way as normalize if globstar option is false", () => {
  equal(posix.normalizeGlob("foo/bar/../baz"), "foo/baz");
  equal(windows.normalizeGlob("foo/bar/../baz"), "foo\\baz");
});
