import { test } from "node:test";
import { equal } from "@frostyeti/assert";
import { pascalize } from "./pascalize.ts";

// Helper to convert result to string
function toPascal(s: string): string {
    return String.fromCodePoint(...pascalize(s));
}

// =============================================================================
// Basic Conversion Tests
// =============================================================================

test("slices::pascalize with space-separated words", () => {
    equal("HelloWorld", toPascal("hello world"));
    equal("HelloWorldToday", toPascal("hello world today"));
    equal("GetUserName", toPascal("get user name"));
});

test("slices::pascalize with snake_case", () => {
    equal("HelloWorld", toPascal("hello_world"));
    equal("HelloWorldToday", toPascal("hello_world_today"));
    equal("GetUserName", toPascal("get_user_name"));
});

test("slices::pascalize with kebab-case", () => {
    equal("HelloWorld", toPascal("hello-world"));
    equal("HelloWorldToday", toPascal("hello-world-today"));
    equal("GetUserName", toPascal("get-user-name"));
});

test("slices::pascalize with mixed separators", () => {
    equal("HelloWorldToday", toPascal("hello_world-today"));
    equal("HelloWorldToday", toPascal("hello-world_today"));
    equal("HelloWorldToday", toPascal("hello world_today"));
    equal("HelloWorldTodayNow", toPascal("hello_world today-now"));
});

test("slices::pascalize with existing PascalCase", () => {
    // Existing PascalCase doesn't preserve word boundaries
    equal("Helloworld", toPascal("HelloWorld"));
    equal("Helloworldtoday", toPascal("HelloWorldToday"));
    equal("Getusername", toPascal("GetUserName"));
});

test("slices::pascalize with existing camelCase", () => {
    // camelCase doesn't preserve word boundaries either
    equal("Helloworld", toPascal("helloWorld"));
    equal("Helloworldtoday", toPascal("helloWorldToday"));
    equal("Getusername", toPascal("getUserName"));
});

test("slices::pascalize with multiple consecutive separators", () => {
    equal("HelloWorld", toPascal("hello__world"));
    equal("HelloWorld", toPascal("hello--world"));
    equal("HelloWorld", toPascal("hello  world"));
    equal("HelloWorld", toPascal("hello___world"));
});

test("slices::pascalize with leading separators", () => {
    equal("HelloWorld", toPascal("_hello_world"));
    equal("HelloWorld", toPascal("-hello-world"));
    equal("HelloWorld", toPascal(" hello world"));
});

test("slices::pascalize with trailing separators", () => {
    equal("HelloWorld", toPascal("hello_world_"));
    equal("HelloWorld", toPascal("hello-world-"));
    equal("HelloWorld", toPascal("hello world "));
});

// =============================================================================
// Unicode Tests
// =============================================================================

test("slices::pascalize with accented characters", () => {
    equal("HelloWörld", toPascal("hello wörld"));
    equal("HelloWörld", toPascal("hello_wörld"));
    equal("CaféLatté", toPascal("café_latté"));
});

test("slices::pascalize with German umlauts", () => {
    equal("GrößeÖffnung", toPascal("größe_öffnung"));
    equal("ÜberÄnderung", toPascal("über_änderung"));
});

test("slices::pascalize with mixed case accents", () => {
    // Existing uppercase accents get lowercased
    equal("HelloWörld", toPascal("hello WÖrLD"));
    equal("Hellowörld", toPascal("helloWörld"));
});

test("slices::pascalize with Greek letters", () => {
    equal("ΑλφαΒητα", toPascal("αλφα_βητα"));
    equal("ΑλφαΒητα", toPascal("ΑΛΦΑ_ΒΗΤΑ"));
    equal("ΑλφαΒητα", toPascal("αλφα βητα"));
});

test("slices::pascalize with Cyrillic letters", () => {
    equal("ПриветМир", toPascal("привет_мир"));
    equal("ПриветМир", toPascal("ПРИВЕТ_МИР"));
    equal("ПриветМир", toPascal("привет мир"));
});

// =============================================================================
// Emoji and Special Character Tests
// =============================================================================

test("slices::pascalize preserves emoji", () => {
    // Emoji are not letters, so they're preserved but don't affect capitalization
    equal("Hello🎉World", toPascal("hello_🎉_world"));
    equal("Hello🎉world", toPascal("hello🎉world"));
});

test("slices::pascalize preserves special characters", () => {
    equal("Hello!World", toPascal("hello_!_world"));
    equal("Hello@World", toPascal("hello_@_world"));
});

test("slices::pascalize with CJK characters", () => {
    // CJK characters are not considered letters, so preserved as-is
    equal("Hello你好World", toPascal("hello_你好_world"));
});

// =============================================================================
// Digit Tests
// =============================================================================

test("slices::pascalize preserves digits", () => {
    equal("Hello123World", toPascal("hello_123_world"));
    equal("Hello123world", toPascal("hello123world"));
    equal("V2Release", toPascal("v2_release"));
});

test("slices::pascalize digits don't trigger capitalization", () => {
    // After a digit, the next letter is NOT capitalized
    equal("Hello123world", toPascal("hello123world"));
    equal("Test42value", toPascal("test42value"));
});

// =============================================================================
// Edge Cases
// =============================================================================

test("slices::pascalize with empty string", () => {
    equal("", toPascal(""));
});

test("slices::pascalize with single character", () => {
    equal("A", toPascal("a"));
    equal("A", toPascal("A"));
    equal("Z", toPascal("z"));
});

test("slices::pascalize with single word", () => {
    equal("Hello", toPascal("hello"));
    equal("Hello", toPascal("HELLO"));
    equal("Hello", toPascal("Hello"));
});

test("slices::pascalize with all uppercase", () => {
    equal("Helloworld", toPascal("HELLOWORLD"));
    equal("HelloWorld", toPascal("HELLO_WORLD"));
});

test("slices::pascalize with only separators", () => {
    equal("", toPascal("___"));
    equal("", toPascal("---"));
    equal("", toPascal("   "));
});

test("slices::pascalize with numbers only", () => {
    equal("123", toPascal("123"));
    equal("123456", toPascal("123_456"));
});

test("slices::pascalize first character handling", () => {
    // First character is always uppercased if it's a letter
    equal("Hello", toPascal("hello"));
    // If first character is not a letter, first letter is NOT uppercased
    // (only separator-triggered capitalization works)
    equal("123Hello", toPascal("123_hello"));
    equal("!hello", toPascal("!hello"));
    // But separator after special char triggers capitalization
    equal("!Hello", toPascal("!_hello"));
});
