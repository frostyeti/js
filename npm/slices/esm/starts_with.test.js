import { test } from "node:test";
import { ok } from "@frostyeti/assert";
import { startsWith, startsWithFold } from "./starts_with.js";
// =============================================================================
// startsWithFold Tests (case-insensitive)
// =============================================================================
test("slices::startsWithFold with ASCII", () => {
  ok(startsWithFold("hello world", "hello"));
  ok(startsWithFold("hello world", "HELLO"));
  ok(startsWithFold("hello world", "HeLLo"));
  ok(startsWithFold("HELLO WORLD", "hello"));
});
test("slices::startsWithFold with partial match", () => {
  ok(startsWithFold("hello world", "HEllo "));
  ok(startsWithFold("hello world", "HE"));
  ok(startsWithFold("hello world", "h"));
});
test("slices::startsWithFold returns false for non-prefix", () => {
  ok(!startsWithFold("hello world", " hello"));
  ok(!startsWithFold("hello world", "world"));
  ok(!startsWithFold("hello", "hello world")); // prefix longer than value
});
test("slices::startsWithFold with accented characters", () => {
  ok(startsWithFold("WÖrLD", "wörld"));
  ok(startsWithFold("wörld", "WÖRLD"));
  ok(startsWithFold("Élève", "élève"));
  ok(startsWithFold("élève", "ÉLÈVE"));
});
test("slices::startsWithFold with Greek letters", () => {
  ok(startsWithFold("ΑΒΓΔ test", "αβγδ"));
  ok(startsWithFold("αβγδ test", "ΑΒΓΔ"));
  ok(startsWithFold("Σίγμα", "σίγμα"));
});
test("slices::startsWithFold with Cyrillic letters", () => {
  ok(startsWithFold("ПРИВЕТ мир", "привет"));
  ok(startsWithFold("привет мир", "ПРИВЕТ"));
});
test("slices::startsWithFold with empty prefix", () => {
  ok(startsWithFold("hello", ""));
  ok(startsWithFold("", ""));
});
test("slices::startsWithFold with emoji", () => {
  // Emoji don't have case, so they should match exactly
  ok(startsWithFold("🎉Party", "🎉"));
  ok(startsWithFold("🎉🚀 Launch", "🎉🚀"));
  ok(!startsWithFold("Party🎉", "🎉"));
});
test("slices::startsWithFold with high code points", () => {
  // Mathematical symbols (U+1D400+)
  ok(startsWithFold("𝐀𝐁𝐂 test", "𝐀𝐁"));
  // Musical symbols
  ok(startsWithFold("𝄞𝄢 music", "𝄞"));
});
test("slices::startsWithFold with mixed scripts", () => {
  ok(startsWithFold("ABC αβγ", "abc"));
  ok(startsWithFold("abc ΑΒΓ", "ABC"));
});
// =============================================================================
// startsWith Tests (case-sensitive)
// =============================================================================
test("slices::startsWith with ASCII", () => {
  ok(startsWith("hello world", "hello"));
  ok(startsWith("hello world", "he"));
  ok(startsWith("hello world", "hello "));
});
test("slices::startsWith is case-sensitive", () => {
  ok(!startsWith("hello world", "Hello"));
  ok(!startsWith("hello world", "HELLO"));
  ok(!startsWith("Hello world", "hello"));
});
test("slices::startsWith returns false for non-prefix", () => {
  ok(!startsWith("hello world", " hello"));
  ok(!startsWith("hello world", "world"));
  ok(!startsWith("hello", "hello world")); // prefix longer than value
});
test("slices::startsWith with accented characters", () => {
  ok(startsWith("wörld", "wör"));
  ok(!startsWith("WÖrLD", "wörld")); // case-sensitive
  ok(startsWith("élève", "élè"));
});
test("slices::startsWith with Greek letters", () => {
  ok(startsWith("αβγδ test", "αβγ"));
  ok(!startsWith("αβγδ test", "ΑΒΓ")); // case-sensitive
  ok(startsWith("ΑΒΓΔ", "ΑΒ"));
});
test("slices::startsWith with Cyrillic letters", () => {
  ok(startsWith("привет мир", "привет"));
  ok(!startsWith("привет мир", "ПРИВЕТ")); // case-sensitive
});
test("slices::startsWith with empty prefix", () => {
  ok(startsWith("hello", ""));
  ok(startsWith("", ""));
});
test("slices::startsWith with single emoji", () => {
  ok(startsWith("🎉Party", "🎉"));
  ok(startsWith("🎉", "🎉"));
  ok(!startsWith("Party🎉", "🎉"));
});
test("slices::startsWith with multiple emojis", () => {
  ok(startsWith("🎉🚀💻 coding", "🎉🚀"));
  ok(startsWith("🎉🚀💻", "🎉🚀💻"));
  ok(!startsWith("🎉🚀💻", "🚀🎉"));
});
test("slices::startsWith with flag emoji", () => {
  // Flags are two regional indicator symbols
  ok(startsWith("🇺🇸 USA", "🇺🇸"));
  ok(startsWith("🇬🇧 UK", "🇬🇧"));
});
test("slices::startsWith with emoji sequences", () => {
  // Family emoji (ZWJ sequence)
  ok(startsWith("👨‍👩‍👧 Family", "👨‍👩‍👧"));
});
test("slices::startsWith with high code points (mathematical symbols)", () => {
  ok(startsWith("𝐀𝐁𝐂 test", "𝐀𝐁"));
  ok(startsWith("𝐀𝐁𝐂", "𝐀𝐁𝐂"));
  ok(!startsWith("𝐀𝐁𝐂", "𝐁𝐂"));
});
test("slices::startsWith with musical symbols", () => {
  ok(startsWith("𝄞𝄢 treble and bass", "𝄞"));
  ok(startsWith("𝄞𝄢", "𝄞𝄢"));
});
test("slices::startsWith with CJK characters", () => {
  ok(startsWith("你好世界", "你好"));
  ok(startsWith("こんにちは", "こんに"));
  ok(startsWith("안녕하세요", "안녕"));
});
test("slices::startsWith with Arabic text", () => {
  ok(startsWith("مرحبا بالعالم", "مرحبا"));
});
test("slices::startsWith with mixed content", () => {
  ok(startsWith("Hello 🌍 World", "Hello 🌍"));
  ok(startsWith("🎉Hello", "🎉Hello"));
  ok(startsWith("Test 你好 🎉", "Test 你好"));
});
