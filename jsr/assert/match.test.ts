import { describe, test } from "node:test";
import { equal } from "./equal.ts";
import { match } from "./match.ts";
import { notMatch } from "./not-match.ts";
import { AssertionError } from "./assertion-error.ts";

describe("assert::match", () => {
    test("passes when string matches pattern", () => {
        match("hello world", /world/);
        match("foobar", /foo/);
        match("12345", /\d+/);
    });

    test("passes with case-insensitive flag", () => {
        match("Hello World", /hello/i);
        match("FOOBAR", /foobar/i);
    });

    test("passes with global flag", () => {
        match("hello hello", /hello/g);
    });

    test("passes with multiline flag", () => {
        match("line1\nline2", /^line2/m);
    });

    test("passes with complex patterns", () => {
        match("user@example.com", /[a-zA-Z]+@[a-zA-Z]+\.[a-zA-Z]+/);
        match("2025-01-15", /\d{4}-\d{2}-\d{2}/);
        match("(555) 123-4567", /\(\d{3}\)\s\d{3}-\d{4}/);
    });

    test("throws when string does not match pattern", () => {
        let threw = false;
        try {
            match("hello", /world/);
        } catch (e) {
            threw = true;
            equal(e instanceof AssertionError, true);
        }
        equal(threw, true);
    });

    test("throws with custom message", () => {
        let message = "";
        try {
            match("hello", /world/, "should contain world");
        } catch (e) {
            message = (e as Error).message;
        }
        equal(message.includes("should contain world"), true);
    });

    test("works with Unicode characters", () => {
        match("こんにちは", /にち/);
        match("Hello 世界", /世界/);
        match("🎉 party 🎉", /🎉/);
    });

    test("works with emoji", () => {
        match("I ❤️ TypeScript", /❤️/);
        match("🚀🔥✨", /🔥/);
    });

    test("works with anchors", () => {
        match("hello world", /^hello/);
        match("hello world", /world$/);
        match("hello", /^hello$/);
    });

    test("works with word boundaries", () => {
        match("hello world", /\bhello\b/);
        match("hello world", /\bworld\b/);
    });

    test("works with character classes", () => {
        match("abc123", /[a-z]+[0-9]+/);
        match("ABC", /[A-Z]+/);
        match("a1b2c3", /([a-z]\d)+/);
    });

    test("works with quantifiers", () => {
        match("aaa", /a{3}/);
        match("abbb", /ab+/);
        match("ac", /ab*/);
        match("ab", /ab?/);
    });
});

describe("assert::notMatch", () => {
    test("passes when string does not match pattern", () => {
        notMatch("hello", /world/);
        notMatch("12345", /[a-z]+/);
        notMatch("foo", /bar/);
    });

    test("passes with case-sensitive mismatch", () => {
        notMatch("hello", /HELLO/);
        notMatch("world", /WORLD/);
    });

    test("throws when string matches pattern", () => {
        let threw = false;
        try {
            notMatch("hello world", /world/);
        } catch (e) {
            threw = true;
            equal(e instanceof AssertionError, true);
        }
        equal(threw, true);
    });

    test("throws with custom message", () => {
        let message = "";
        try {
            notMatch("hello", /hello/, "should not match");
        } catch (e) {
            message = (e as Error).message;
        }
        equal(message.includes("should not match"), true);
    });

    test("works with Unicode characters", () => {
        notMatch("hello", /世界/);
        notMatch("English text", /日本語/);
    });

    test("works with emoji", () => {
        notMatch("plain text", /🎉/);
        notMatch("no emoji here", /🚀/);
    });

    test("works with anchors", () => {
        notMatch("hello world", /^world/);
        notMatch("hello world", /hello$/);
    });
});
