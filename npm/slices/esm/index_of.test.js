import { test } from "node:test";
import { equal, throws } from "@frostyeti/assert";
import { indexOf, indexOfFold } from "./index_of.js";
import { toCharArray } from "./utils.js";
// =============================================================================
// indexOf - Case-Sensitive Tests
// =============================================================================
test("slices::indexOf finds first occurrence", () => {
  equal(indexOf("hello world", "world"), 6);
});
test("slices::indexOf finds first when multiple matches", () => {
  equal(indexOf("foo bar foo", "foo"), 0);
});
test("slices::indexOf returns -1 when not found", () => {
  equal(indexOf("hello world", "xyz"), -1);
});
test("slices::indexOf is case-sensitive", () => {
  equal(indexOf("hello world", "WORLD"), -1);
  equal(indexOf("Hello HELLO", "HELLO"), 6);
  equal(indexOf("HELLO hello", "hello"), 6);
});
test("slices::indexOf with multiple occurrences", () => {
  equal(indexOf("abcabcabc", "abc"), 0);
  equal(indexOf("aaa", "a"), 0);
});
test("slices::indexOf with start index", () => {
  equal(indexOf("foo bar foo", "foo", 1), 8);
  equal(indexOf("abcabcabc", "abc", 1), 3);
  equal(indexOf("abcabcabc", "abc", 4), 6);
});
test("slices::indexOf returns -1 for empty search", () => {
  equal(indexOf("hello", ""), -1);
});
test("slices::indexOf returns -1 for empty value", () => {
  equal(indexOf("", "test"), -1);
});
test("slices::indexOf returns -1 when test longer than value", () => {
  equal(indexOf("abc", "abcdef"), -1);
});
test("slices::indexOf finds single character", () => {
  equal(indexOf("hello", "e"), 1);
  equal(indexOf("hello", "l"), 2);
});
test("slices::indexOf with overlapping patterns", () => {
  equal(indexOf("aaaa", "aa"), 0);
  equal(indexOf("ababa", "aba"), 0);
});
// Unicode Tests for indexOf
test("slices::indexOf with accented characters", () => {
  equal(indexOf("café latte", "café"), 0);
  equal(indexOf("naïve approach", "naïve"), 0);
});
test("slices::indexOf with German umlauts", () => {
  equal(indexOf("über alles", "über"), 0);
  equal(indexOf("größe matters", "größe"), 0);
});
test("slices::indexOf with Greek letters", () => {
  equal(indexOf("αβγ delta αβγ", "αβγ"), 0);
  equal(indexOf("hello Ωmega", "Ωmega"), 6);
});
test("slices::indexOf with Cyrillic letters", () => {
  equal(indexOf("привет мир", "мир"), 7);
  equal(indexOf("мир привет", "привет"), 4);
});
test("slices::indexOf with emoji", () => {
  equal(indexOf("hello 🎉 world", "🎉"), 6);
  equal(indexOf("🚀🌟🚀", "🌟"), 1);
});
test("slices::indexOf with flag emoji", () => {
  equal(indexOf("test 🇺🇸 more", "🇺🇸"), 5);
});
test("slices::indexOf with CJK characters", () => {
  equal(indexOf("你好世界", "世界"), 2);
  equal(indexOf("日本語テスト", "テスト"), 3);
});
test("slices::indexOf with high code points", () => {
  equal(indexOf("𝄞music𝄞", "music"), 1);
  equal(indexOf("test𝕳𝖊𝖑𝖑𝖔", "𝕳𝖊𝖑𝖑𝖔"), 4);
});
// Edge Cases for indexOf
test("slices::indexOf with whitespace patterns", () => {
  equal(indexOf("a b c", " "), 1);
  equal(indexOf("  hello", " "), 0);
});
test("slices::indexOf with tabs and newlines", () => {
  equal(indexOf("a\tb\tc", "\t"), 1);
  equal(indexOf("line1\nline2", "\n"), 5);
});
test("slices::indexOf entire string match", () => {
  equal(indexOf("hello", "hello"), 0);
});
test("slices::indexOf at end of string", () => {
  equal(indexOf("hello world", "world"), 6);
});
test("slices::indexOf with Uint32Array input", () => {
  const value = toCharArray("hello world");
  const search = toCharArray("world");
  equal(indexOf(value, search), 6);
});
// =============================================================================
// indexOfFold - Case-Insensitive Tests
// =============================================================================
test("slices::indexOfFold finds first occurrence case-insensitive", () => {
  equal(indexOfFold("Hello World", "world"), 6);
});
test("slices::indexOfFold finds first when multiple matches", () => {
  equal(indexOfFold("foo FOO Foo", "FOO"), 0);
});
test("slices::indexOfFold returns -1 when not found", () => {
  equal(indexOfFold("hello world", "xyz"), -1);
});
test("slices::indexOfFold with mixed case", () => {
  equal(indexOfFold("HeLLo WoRLD", "hello"), 0);
  equal(indexOfFold("HeLLo WoRLD", "WORLD"), 6);
});
test("slices::indexOfFold with start index", () => {
  equal(indexOfFold("foo FOO foo", "foo", 1), 4);
  equal(indexOfFold("ABC abc ABC", "abc", 1), 4);
});
test("slices::indexOfFold returns -1 for empty search", () => {
  equal(indexOfFold("hello", ""), -1);
});
test("slices::indexOfFold returns -1 for empty value", () => {
  equal(indexOfFold("", "test"), -1);
});
test("slices::indexOfFold returns -1 when test longer than value", () => {
  equal(indexOfFold("abc", "abcdef"), -1);
});
test("slices::indexOfFold throws on negative index", () => {
  throws(() => indexOfFold("hello", "e", -1));
});
// Unicode Tests for indexOfFold
test("slices::indexOfFold with accented characters", () => {
  equal(indexOfFold("CAFÉ latte", "café"), 0);
  equal(indexOfFold("café CAFÉ", "CAFÉ"), 0);
});
test("slices::indexOfFold with German umlauts", () => {
  equal(indexOfFold("ÜBER alles", "über"), 0);
  equal(indexOfFold("test ÜBER", "über"), 5);
});
test("slices::indexOfFold with Greek letters", () => {
  equal(indexOfFold("ΑΒΓ test", "αβγ"), 0);
  equal(indexOfFold("test ΑΒΓ", "αβγ"), 5);
});
test("slices::indexOfFold with Cyrillic letters", () => {
  equal(indexOfFold("ПРИВЕТ мир", "привет"), 0);
  equal(indexOfFold("test ПРИВЕТ", "привет"), 5);
});
test("slices::indexOfFold with emoji (no case)", () => {
  equal(indexOfFold("h🎉world", "🎉"), 1);
});
test("slices::indexOfFold with CJK characters (no case)", () => {
  equal(indexOfFold("你好世界", "世界"), 2);
});
test("slices::indexOfFold with mixed case accents", () => {
  equal(indexOfFold("ÉLAN test", "élan"), 0);
  equal(indexOfFold("ñoño ÑOÑO", "ñoño"), 0);
});
// Edge Cases for indexOfFold
test("slices::indexOfFold entire string match", () => {
  equal(indexOfFold("HELLO", "hello"), 0);
  equal(indexOfFold("hello", "HELLO"), 0);
});
test("slices::indexOfFold with single character", () => {
  equal(indexOfFold("AbCdE", "a"), 0);
  equal(indexOfFold("abcdE", "E"), 4);
});
test("slices::indexOfFold with Uint32Array input", () => {
  const value = toCharArray("Hello World");
  const search = toCharArray("WORLD");
  equal(indexOfFold(value, search), 6);
});
