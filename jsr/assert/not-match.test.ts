import { describe, test } from "node:test";
import { equal } from "./equal.ts";
import { notMatch } from "./not-match.ts";

describe("assert::notMatch", () => {
    describe("basic non-matching", () => {
        test("passes when string does not match pattern", () => {
            notMatch("hello", /world/);
            notMatch("abc", /\d+/);
            notMatch("123", /[a-z]+/);
        });

        test("throws when string matches pattern", () => {
            let threw = false;
            try {
                notMatch("hello", /hello/);
            } catch {
                threw = true;
            }
            equal(threw, true);
        });

        test("throws when string contains pattern", () => {
            let threw = false;
            try {
                notMatch("hello world", /world/);
            } catch {
                threw = true;
            }
            equal(threw, true);
        });
    });

    describe("case sensitivity", () => {
        test("passes with case-sensitive mismatch", () => {
            notMatch("HELLO", /hello/);
        });

        test("throws with case-insensitive match", () => {
            let threw = false;
            try {
                notMatch("HELLO", /hello/i);
            } catch {
                threw = true;
            }
            equal(threw, true);
        });
    });

    describe("pattern features", () => {
        test("passes when no digits present", () => {
            notMatch("hello world", /\d/);
        });

        test("passes when pattern doesn't match start", () => {
            notMatch("hello", /^world/);
        });

        test("passes when pattern doesn't match end", () => {
            notMatch("hello", /world$/);
        });

        test("passes when word boundary doesn't match", () => {
            notMatch("helloworld", /\bhello\b/);
        });

        test("throws when word boundary matches", () => {
            let threw = false;
            try {
                notMatch("hello world", /\bhello\b/);
            } catch {
                threw = true;
            }
            equal(threw, true);
        });
    });

    describe("Unicode", () => {
        test("passes when Unicode pattern doesn't match", () => {
            notMatch("hello", /世界/);
        });

        test("throws when Unicode pattern matches", () => {
            let threw = false;
            try {
                notMatch("こんにちは世界", /世界/);
            } catch {
                threw = true;
            }
            equal(threw, true);
        });

        test("passes when emoji pattern doesn't match", () => {
            notMatch("hello world", /🎉/);
        });

        test("throws when emoji pattern matches", () => {
            let threw = false;
            try {
                notMatch("🎉 party", /🎉/);
            } catch {
                threw = true;
            }
            equal(threw, true);
        });
    });

    describe("custom message", () => {
        test("includes custom message in error", () => {
            let message = "";
            try {
                notMatch("hello", /hello/, "should not match hello");
            } catch (e) {
                message = (e as Error).message;
            }
            equal(message.includes("should not match hello"), true);
        });
    });

    describe("special patterns", () => {
        test("passes when empty pattern doesn't apply", () => {
            // Note: empty pattern matches any string
            let threw = false;
            try {
                notMatch("hello", /(?!)/); // Negative lookahead that never matches
            } catch {
                threw = true;
            }
            equal(threw, false);
        });

        test("works with complex patterns", () => {
            notMatch("invalid-email", /^[\w.]+@[\w.]+\.[a-z]{2,}$/);
        });

        test("throws for valid email pattern", () => {
            let threw = false;
            try {
                notMatch("test@example.com", /^[\w.]+@[\w.]+\.[a-z]{2,}$/);
            } catch {
                threw = true;
            }
            equal(threw, true);
        });
    });

    describe("edge cases", () => {
        test("passes for empty string with non-empty pattern", () => {
            notMatch("", /./);
        });

        test("passes for whitespace with word pattern", () => {
            notMatch("   ", /\S/);
        });
    });
});
