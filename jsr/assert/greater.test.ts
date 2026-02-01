import { describe, test } from "node:test";
import { equal } from "./equal.ts";
import { greater } from "./greater.ts";

describe("assert::greater", () => {
    describe("numbers", () => {
        test("passes when actual is greater", () => {
            greater(5, 3);
            greater(100, 99);
            greater(1, 0);
            greater(0, -1);
        });

        test("passes for floating point", () => {
            greater(3.15, 3.14);
            greater(0.2, 0.1);
            greater(1.0001, 1.0);
        });

        test("passes for negative numbers", () => {
            greater(-1, -2);
            greater(-10, -100);
            greater(0, -1);
        });

        test("throws when actual equals expected", () => {
            let threw = false;
            try {
                greater(5, 5);
            } catch {
                threw = true;
            }
            equal(threw, true);
        });

        test("throws when actual is less", () => {
            let threw = false;
            try {
                greater(3, 5);
            } catch {
                threw = true;
            }
            equal(threw, true);
        });

        test("passes for Infinity", () => {
            greater(Infinity, 1000000);
            greater(1, -Infinity);
        });

        test("throws for -Infinity vs Infinity", () => {
            let threw = false;
            try {
                greater(-Infinity, Infinity);
            } catch {
                threw = true;
            }
            equal(threw, true);
        });
    });

    describe("bigints", () => {
        test("passes when actual is greater", () => {
            greater(5n, 3n);
            greater(1000000000000n, 999999999999n);
            greater(0n, -1n);
        });

        test("throws when actual equals expected", () => {
            let threw = false;
            try {
                greater(5n, 5n);
            } catch {
                threw = true;
            }
            equal(threw, true);
        });

        test("throws when actual is less", () => {
            let threw = false;
            try {
                greater(3n, 5n);
            } catch {
                threw = true;
            }
            equal(threw, true);
        });
    });

    describe("strings", () => {
        test("passes for lexicographically greater strings", () => {
            greater("b", "a");
            greater("banana", "apple");
            greater("z", "a");
        });

        test("throws for lexicographically lesser strings", () => {
            let threw = false;
            try {
                greater("a", "b");
            } catch {
                threw = true;
            }
            equal(threw, true);
        });

        test("throws for equal strings", () => {
            let threw = false;
            try {
                greater("hello", "hello");
            } catch {
                threw = true;
            }
            equal(threw, true);
        });
    });

    describe("dates", () => {
        test("passes when actual date is later", () => {
            greater(new Date("2024-01-02"), new Date("2024-01-01"));
            greater(new Date("2025-01-01"), new Date("2024-12-31"));
        });

        test("throws when actual date is earlier", () => {
            let threw = false;
            try {
                greater(new Date("2024-01-01"), new Date("2024-01-02"));
            } catch {
                threw = true;
            }
            equal(threw, true);
        });

        test("throws when dates are equal", () => {
            let threw = false;
            try {
                greater(new Date("2024-01-01"), new Date("2024-01-01"));
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
                greater(3, 5, "value should be greater");
            } catch (e) {
                message = (e as Error).message;
            }
            equal(message.includes("value should be greater"), true);
        });
    });
});
