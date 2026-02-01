import { describe, test } from "node:test";
import { equal } from "./equal.ts";
import { notEqual } from "./not-equal.ts";

describe("assert::notEqual", () => {
    describe("different primitives", () => {
        test("passes for different numbers", () => {
            notEqual(1, 2);
            notEqual(0, 1);
            notEqual(-1, 1);
        });

        test("passes for different strings", () => {
            notEqual("hello", "world");
            notEqual("a", "b");
        });

        test("passes for different booleans", () => {
            notEqual(true, false);
        });

        test("passes for null vs undefined", () => {
            notEqual(null, undefined);
        });

        test("passes for NaN vs number", () => {
            notEqual(NaN, 1);
        });
    });

    describe("different objects", () => {
        test("passes for objects with different keys", () => {
            notEqual({ a: 1 }, { b: 1 });
        });

        test("passes for objects with different values", () => {
            notEqual({ a: 1 }, { a: 2 });
        });

        test("passes for objects with extra keys", () => {
            notEqual({ a: 1 }, { a: 1, b: 2 });
        });

        test("passes for nested objects with differences", () => {
            notEqual(
                { a: { b: 1 } },
                { a: { b: 2 } }
            );
        });
    });

    describe("different arrays", () => {
        test("passes for arrays with different length", () => {
            notEqual([1, 2], [1, 2, 3]);
        });

        test("passes for arrays with different values", () => {
            notEqual([1, 2, 3], [1, 2, 4]);
        });

        test("passes for arrays with same values in different order", () => {
            notEqual([1, 2, 3], [3, 2, 1]);
        });
    });

    describe("different collections", () => {
        test("passes for Sets with different values", () => {
            notEqual(new Set([1, 2]), new Set([1, 3]));
        });

        test("passes for Maps with different values", () => {
            notEqual(
                new Map([["a", 1]]),
                new Map([["a", 2]])
            );
        });

        test("passes for Sets with different sizes", () => {
            notEqual(new Set([1]), new Set([1, 2]));
        });
    });

    describe("different types", () => {
        test("passes for object vs array", () => {
            notEqual({} as unknown, [] as unknown);
        });

        test("passes for Date vs object", () => {
            notEqual(new Date() as unknown, {} as unknown);
        });
    });

    describe("throws for equal values", () => {
        test("throws for equal numbers", () => {
            let threw = false;
            try {
                notEqual(1, 1);
            } catch {
                threw = true;
            }
            equal(threw, true);
        });

        test("throws for equal strings", () => {
            let threw = false;
            try {
                notEqual("hello", "hello");
            } catch {
                threw = true;
            }
            equal(threw, true);
        });

        test("throws for deeply equal objects", () => {
            let threw = false;
            try {
                notEqual({ a: 1, b: 2 }, { a: 1, b: 2 });
            } catch {
                threw = true;
            }
            equal(threw, true);
        });

        test("throws for deeply equal arrays", () => {
            let threw = false;
            try {
                notEqual([1, 2, 3], [1, 2, 3]);
            } catch {
                threw = true;
            }
            equal(threw, true);
        });

        test("throws for deeply equal nested structures", () => {
            let threw = false;
            try {
                notEqual(
                    { a: [1, 2], b: { c: 3 } },
                    { a: [1, 2], b: { c: 3 } }
                );
            } catch {
                threw = true;
            }
            equal(threw, true);
        });

        test("throws for equal Sets", () => {
            let threw = false;
            try {
                notEqual(new Set([1, 2, 3]), new Set([1, 2, 3]));
            } catch {
                threw = true;
            }
            equal(threw, true);
        });

        test("throws for equal Maps", () => {
            let threw = false;
            try {
                notEqual(
                    new Map([["a", 1], ["b", 2]]),
                    new Map([["a", 1], ["b", 2]])
                );
            } catch {
                threw = true;
            }
            equal(threw, true);
        });

        test("throws for NaN vs NaN (deep equality)", () => {
            let threw = false;
            try {
                notEqual(NaN, NaN);
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
                notEqual(1, 1, "values should differ");
            } catch (e) {
                message = (e as Error).message;
            }
            equal(message.includes("values should differ"), true);
        });
    });

    describe("edge cases", () => {
        test("passes for empty object vs object with keys", () => {
            notEqual({}, { a: 1 });
        });

        test("passes for empty array vs non-empty array", () => {
            notEqual([], [1]);
        });

        test("passes for different Date objects", () => {
            notEqual(new Date("2024-01-01"), new Date("2024-01-02"));
        });

        test("throws for same Date values", () => {
            let threw = false;
            try {
                notEqual(new Date("2024-01-01"), new Date("2024-01-01"));
            } catch {
                threw = true;
            }
            equal(threw, true);
        });
    });
});
