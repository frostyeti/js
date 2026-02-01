import { describe, test } from "node:test";
import { equal } from "./equal.js";
import { stringIncludes } from "./string-includes.js";
describe("assert::stringIncludes", () => {
  describe("basic matching", () => {
    test("passes when string includes substring", () => {
      stringIncludes("hello world", "world");
      stringIncludes("hello world", "hello");
      stringIncludes("hello world", " ");
    });
    test("passes when string equals substring", () => {
      stringIncludes("hello", "hello");
    });
    test("passes with empty substring", () => {
      stringIncludes("hello", "");
    });
    test("throws when string does not include substring", () => {
      let threw = false;
      try {
        stringIncludes("hello", "world");
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
  });
  describe("case sensitivity", () => {
    test("is case sensitive", () => {
      let threw = false;
      try {
        stringIncludes("Hello World", "hello");
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
    test("passes with correct case", () => {
      stringIncludes("Hello World", "Hello");
      stringIncludes("Hello World", "World");
    });
  });
  describe("special characters", () => {
    test("works with newlines", () => {
      stringIncludes("hello\nworld", "\n");
      stringIncludes("line1\nline2", "line1");
    });
    test("works with tabs", () => {
      stringIncludes("hello\tworld", "\t");
    });
    test("works with backslashes", () => {
      stringIncludes("hello\\world", "\\");
    });
    test("works with quotes", () => {
      stringIncludes('hello "world"', '"world"');
      stringIncludes("hello 'world'", "'world'");
    });
    test("works with regex special chars", () => {
      stringIncludes("price: $100", "$100");
      stringIncludes("hello.*world", ".*");
      stringIncludes("a+b=c", "+");
    });
  });
  describe("Unicode", () => {
    test("works with Unicode characters", () => {
      stringIncludes("こんにちは世界", "世界");
      stringIncludes("Hello 世界", "世界");
      stringIncludes("Привет мир", "мир");
    });
    test("works with emoji", () => {
      stringIncludes("Hello 👋 World", "👋");
      stringIncludes("🎉 party 🎉", "party");
      stringIncludes("🚀🌟💫", "🌟");
    });
    test("works with combined emoji", () => {
      stringIncludes("Family: 👨‍👩‍👧‍👦", "👨‍👩‍👧‍👦");
    });
    test("works with accented characters", () => {
      stringIncludes("café résumé", "café");
      stringIncludes("naïve", "ï");
    });
  });
  describe("partial matches", () => {
    test("passes with partial word match", () => {
      stringIncludes("testing", "test");
      stringIncludes("testing", "ting");
      stringIncludes("testing", "est");
    });
    test("passes with substring at start", () => {
      stringIncludes("hello world", "hello");
    });
    test("passes with substring at end", () => {
      stringIncludes("hello world", "world");
    });
    test("passes with substring in middle", () => {
      stringIncludes("hello world", "o w");
    });
  });
  describe("custom message", () => {
    test("includes custom message in error", () => {
      let message = "";
      try {
        stringIncludes("hello", "xyz", "should contain xyz");
      } catch (e) {
        message = e.message;
      }
      equal(message.includes("should contain xyz"), true);
    });
  });
  describe("edge cases", () => {
    test("empty string includes empty string", () => {
      stringIncludes("", "");
    });
    test("throws when empty string doesn't include non-empty", () => {
      let threw = false;
      try {
        stringIncludes("", "a");
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
    test("works with whitespace-only strings", () => {
      stringIncludes("   ", " ");
      stringIncludes("\t\n", "\t");
    });
    test("works with numeric strings", () => {
      stringIncludes("abc123def", "123");
      stringIncludes("test 42 test", "42");
    });
    test("works with very long strings", () => {
      const longString = "a".repeat(10000) + "needle" + "b".repeat(10000);
      stringIncludes(longString, "needle");
    });
    test("handles repeated substrings", () => {
      stringIncludes("abcabcabc", "abc");
      stringIncludes("aaaa", "aa");
    });
  });
});
