import { describe, test } from "node:test";
import { equal } from "./equal.ts";
import { AssertionError } from "./assertion-error.ts";

describe("assert::equal", () => {
    test("passes for identical primitives", () => {
        equal(1, 1);
        equal("hello", "hello");
        equal(true, true);
        equal(false, false);
        equal(undefined, undefined);
        equal(null, null);
        equal(0, 0);
        equal(-0, -0);
    });

    test("passes for deeply equal arrays", () => {
        equal([1, 2, 3], [1, 2, 3]);
        equal([], []);
        equal([[1, 2], [3, 4]], [[1, 2], [3, 4]]);
    });

    test("passes for deeply equal objects", () => {
        equal({ a: 1, b: 2 }, { a: 1, b: 2 });
        equal({}, {});
        equal({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } });
    });

    test("passes for equal Sets", () => {
        equal(new Set([1, 2, 3]), new Set([1, 2, 3]));
        equal(new Set(), new Set());
    });

    test("passes for equal Maps", () => {
        equal(new Map([["a", 1]]), new Map([["a", 1]]));
        equal(new Map(), new Map());
    });

    test("passes for equal Dates", () => {
        const date = new Date(2025, 0, 1);
        equal(date, new Date(date.getTime()));
    });

    test("passes for equal RegExps", () => {
        equal(/abc/gi, /abc/gi);
    });

    test("passes for NaN", () => {
        equal(NaN, NaN);
    });

    test("throws for different primitives", () => {
        let threw = false;
        try {
            equal(1, 2);
        } catch (e) {
            threw = true;
            equal(e instanceof AssertionError, true);
        }
        equal(threw, true);
    });

    test("throws for different strings", () => {
        let threw = false;
        try {
            equal("hello", "world");
        } catch {
            threw = true;
        }
        equal(threw, true);
    });

    test("throws for different arrays", () => {
        let threw = false;
        try {
            equal([1, 2, 3], [1, 2, 4]);
        } catch {
            threw = true;
        }
        equal(threw, true);
    });

    test("throws for different objects", () => {
        let threw = false;
        try {
            equal({ a: 1, b: 2 }, { a: 1, b: 3 });
        } catch {
            threw = true;
        }
        equal(threw, true);
    });

    test("throws for arrays of different lengths", () => {
        let threw = false;
        try {
            equal([1, 2], [1, 2, 3]);
        } catch {
            threw = true;
        }
        equal(threw, true);
    });

    test("works with TypedArrays", () => {
        equal(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3]));
        equal(new Float64Array([1.1, 2.2]), new Float64Array([1.1, 2.2]));
    });

    test("works with Unicode strings", () => {
        equal("こんにちは", "こんにちは");
        equal("世界", "世界");
    });

    test("works with emoji", () => {
        equal("🎉", "🎉");
        equal("Hello 👋 World 🌍", "Hello 👋 World 🌍");
    });

    test("works with nested structures", () => {
        equal(
            { a: [1, { b: [2, { c: 3 }] }] },
            { a: [1, { b: [2, { c: 3 }] }] },
        );
    });

    test("throws for null vs undefined", () => {
        let threw = false;
        try {
            equal(null, undefined);
        } catch {
            threw = true;
        }
        equal(threw, true);
    });

    test("works with symbols", () => {
        const sym = Symbol.for("test");
        equal(sym, sym);
    });

    test("works with empty collections", () => {
        equal([], []);
        equal({}, {});
        equal(new Set(), new Set());
        equal(new Map(), new Map());
    });

    test("handles circular references", () => {
        const a: Record<string, unknown> = { foo: 1 };
        const b: Record<string, unknown> = { foo: 1 };
        a.self = a;
        b.self = b;
        equal(a, b);
    });
});
