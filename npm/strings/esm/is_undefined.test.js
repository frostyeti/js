import { test } from "node:test";
import { nope, ok } from "@frostyeti/assert";
import { isUndefined } from "./is_undefined.js";
// =============================================================================
// Basic checks
// =============================================================================
test("strings::isUndefined returns true for undefined", () => {
  const s = undefined;
  ok(isUndefined(s));
});
test("strings::isUndefined returns true for explicitly undefined", () => {
  ok(isUndefined(undefined));
});
test("strings::isUndefined returns false for empty string", () => {
  const s = "";
  nope(isUndefined(s));
});
test("strings::isUndefined returns false for non-empty string", () => {
  const s = "test";
  nope(isUndefined(s));
});
// =============================================================================
// Edge cases
// =============================================================================
test("strings::isUndefined returns false for whitespace string", () => {
  nope(isUndefined(" "));
  nope(isUndefined("\t"));
  nope(isUndefined("\n"));
});
test("strings::isUndefined returns false for string with value", () => {
  nope(isUndefined("hello world"));
});
test("strings::isUndefined works with optional parameters", () => {
  function test(s) {
    if (isUndefined(s)) {
      return "undefined";
    }
    return s;
  }
  ok(test() === "undefined");
  ok(test("hello") === "hello");
});
