import { describe, test } from "node:test";
import { equal } from "./equal.ts";
import { greaterOrEqual } from "./greater-or-equal.ts";

describe("assert::greaterOrEqual", () => {
    describe("numbers", () => {
        test("passes when actual is greater", () => {
            greaterOrEqual(5, 3);
            greaterOrEqual(100, 99);
            greaterOrEqual(0, -1);
        });

        test("passes when actual equals expected", () => {
            greaterOrEqual(5, 5);
            greaterOrEqual(0, 0);
            greaterOrEqual(-1, -1);
        });

        test("passes for floating point", () => {
            greaterOrEqual(3.15, 3.14);
            greaterOrEqual(3.14, 3.14);
        });

        test("passes for negative numbers", () => {
            greaterOrEqual(-1, -2);
            greaterOrEqual(-1, -1);
        });

        test("throws when actual is less", () => {
            let threw = false;
            try {
                greaterOrEqual(3, 5);
            } catch {
                threw = true;
            }
            equal(threw, true);
        });

        test("passes for Infinity", () => {
            greaterOrEqual(Infinity, Infinity);
            greaterOrEqual(Infinity, 1000000);
        });

        test("passes for -Infinity equality", () => {
            greaterOrEqual(-Infinity, -Infinity);
        });
    });

    describe("bigints", () => {
        test("passes when actual is greater", () => {
            greaterOrEqual(5n, 3n);
            greaterOrEqual(1000000000000n, 999999999999n);
        });

        test("passes when actual equals expected", () => {
            greaterOrEqual(5n, 5n);
            greaterOrEqual(0n, 0n);
        });

        test("throws when actual is less", () => {
            let threw = false;
            try {
                greaterOrEqual(3n, 5n);
            } catch {
                threw = true;
            }
            equal(threw, true);
        });
    });

    describe("strings", () => {
        test("passes for lexicographically greater strings", () => {
            greaterOrEqual("b", "a");
            greaterOrEqual("banana", "apple");
        });

        test("passes for equal strings", () => {
            greaterOrEqual("hello", "hello");
            greaterOrEqual("", "");
        });

        test("throws for lexicographically lesser strings", () => {
            let threw = false;
            try {
                greaterOrEqual("a", "b");
            } catch {
                threw = true;
            }
            equal(threw, true);
        });
    });

    describe("dates", () => {
        test("passes when actual date is later", () => {
            greaterOrEqual(new Date("2024-01-02"), new Date("2024-01-01"));
        });

        test("passes when dates are equal", () => {
            greaterOrEqual(new Date("2024-01-01"), new Date("2024-01-01"));
        });

        test("throws when actual date is earlier", () => {
            let threw = false;
            try {
                greaterOrEqual(new Date("2024-01-01"), new Date("2024-01-02"));
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
                greaterOrEqual(3, 5, "value should be >= 5");
            } catch (e) {
                message = (e as Error).message;
            }
            equal(message.includes("value should be >= 5"), true);
        });
    });

    describe("edge cases", () => {
        test("passes for 0 and -0", () => {
            greaterOrEqual(0, -0);
            greaterOrEqual(-0, 0);
        });
    });
});
