import { test } from "node:test";
import { equal } from "@frostyeti/assert";
import { camelize } from "./camelize.js";
/** Helper to convert result to string */
function toCamel(input, options) {
  return String.fromCodePoint(...camelize(input, options));
}
// =============================================================================
// camelize - Basic Tests
// =============================================================================
test("slices::camelize with snake_case", () => {
  equal(toCamel("hello_world"), "helloWorld");
  equal(toCamel("one_two_three"), "oneTwoThree");
});
test("slices::camelize with kebab-case", () => {
  equal(toCamel("hello-world"), "helloWorld");
  equal(toCamel("one-two-three"), "oneTwoThree");
});
test("slices::camelize with space-separated", () => {
  equal(toCamel("hello world"), "helloWorld");
  equal(toCamel("one two three"), "oneTwoThree");
});
test("slices::camelize with existing camelCase", () => {
  equal(toCamel("helloWorld"), "helloWorld");
  equal(toCamel("oneTwoThree"), "oneTwoThree");
});
test("slices::camelize with PascalCase", () => {
  equal(toCamel("HelloWorld"), "helloWorld");
  equal(toCamel("OneTwoThree"), "oneTwoThree");
});
test("slices::camelize with single word", () => {
  equal(toCamel("hello"), "hello");
  equal(toCamel("HELLO"), "hELLO");
});
test("slices::camelize with mixed separators", () => {
  equal(toCamel("hello_world-test"), "helloWorldTest");
  equal(toCamel("one-two_three four"), "oneTwoThreeFour");
});
test("slices::camelize with numbers", () => {
  equal(toCamel("hello_world_123"), "helloWorld123");
  equal(toCamel("version_2_0"), "version20");
  equal(toCamel("hello123World"), "hello123World");
});
// =============================================================================
// camelize - Multiple Separators
// =============================================================================
test("slices::camelize with multiple consecutive underscores", () => {
  equal(toCamel("hello__world"), "helloWorld");
  equal(toCamel("one___two"), "oneTwo");
});
test("slices::camelize with multiple consecutive hyphens", () => {
  equal(toCamel("hello--world"), "helloWorld");
  equal(toCamel("one---two"), "oneTwo");
});
test("slices::camelize with multiple consecutive spaces", () => {
  equal(toCamel("hello  world"), "helloWorld");
  equal(toCamel("one   two"), "oneTwo");
});
test("slices::camelize with leading separators", () => {
  equal(toCamel("_hello"), "Hello");
  equal(toCamel("-hello"), "Hello");
  equal(toCamel(" hello"), "Hello");
});
test("slices::camelize with trailing separators", () => {
  equal(toCamel("hello_"), "hello");
  equal(toCamel("hello-"), "hello");
  equal(toCamel("hello "), "hello");
});
// =============================================================================
// camelize - Unicode Tests
// =============================================================================
test("slices::camelize with accented characters", () => {
  equal(toCamel("café_latte"), "caféLatte");
  equal(toCamel("naïve_approach"), "naïveApproach");
});
test("slices::camelize with German umlauts", () => {
  equal(toCamel("über_mensch"), "überMensch");
  equal(toCamel("größe_test"), "größeTest");
});
test("slices::camelize with Greek letters", () => {
  equal(toCamel("αβγ_test"), "αβγTest");
  equal(toCamel("hello_ωmega"), "helloΩmega");
});
test("slices::camelize with Cyrillic letters", () => {
  equal(toCamel("привет_мир"), "приветМир");
});
test("slices::camelize with emoji", () => {
  equal(toCamel("hello_🎉_world"), "hello🎉World");
});
test("slices::camelize with CJK characters", () => {
  equal(toCamel("hello_你好"), "hello你好");
  equal(toCamel("你好_world"), "你好World");
});
// =============================================================================
// camelize - Edge Cases
// =============================================================================
test("slices::camelize with empty string", () => {
  equal(toCamel(""), "");
});
test("slices::camelize with single character", () => {
  equal(toCamel("a"), "a");
  equal(toCamel("A"), "a");
});
test("slices::camelize with all uppercase", () => {
  equal(toCamel("HELLO_WORLD"), "hELLOWORLD");
});
test("slices::camelize with only separators", () => {
  equal(toCamel("___"), "");
  equal(toCamel("---"), "");
  equal(toCamel("   "), "");
});
test("slices::camelize with special characters", () => {
  equal(toCamel("hello!world"), "hello!world");
  equal(toCamel("test.case"), "test.case");
});
test("slices::camelize preserveCase option", () => {
  equal(toCamel("hello_world", { preserveCase: true }), "helloWorld");
  equal(toCamel("HELLO_WORLD", { preserveCase: true }), "hELLOWORLD");
});
