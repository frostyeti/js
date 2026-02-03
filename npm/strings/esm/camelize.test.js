import { test } from "node:test";
import { equal } from "@frostyeti/assert";
import { camelize } from "./camelize.js";
// =============================================================================
// Basic camelization
// =============================================================================
test("strings::camelize converts space-separated words", () => {
  equal(camelize("hello world"), "helloWorld");
});
test("strings::camelize converts PascalCase", () => {
  equal(camelize("HelloWorld"), "helloWorld");
});
test("strings::camelize converts underscore case", () => {
  equal(camelize("hello_world"), "helloWorld");
});
test("strings::camelize converts kebab case", () => {
  equal(camelize("hello-world"), "helloWorld");
});
test("strings::camelize handles unicode characters", () => {
  equal(camelize("hello wörld"), "helloWörld");
  equal(camelize("HelloWörld"), "helloWörld");
});
// =============================================================================
// preserveCase option
// =============================================================================
test("strings::camelize with preserveCase keeps original casing", () => {
  equal(camelize("hello wöRLd", { preserveCase: true }), "helloWöRLd");
});
test("strings::camelize with preserveCase on uppercase", () => {
  equal(camelize("hello WORLD", { preserveCase: true }), "helloWORLD");
});
// =============================================================================
// Edge cases
// =============================================================================
test("strings::camelize handles empty string", () => {
  equal(camelize(""), "");
});
test("strings::camelize handles single word", () => {
  equal(camelize("hello"), "hello");
  equal(camelize("Hello"), "hello");
});
test("strings::camelize handles multiple spaces", () => {
  equal(camelize("hello   world"), "helloWorld");
});
test("strings::camelize handles mixed separators", () => {
  equal(camelize("hello_world-test"), "helloWorldTest");
});
