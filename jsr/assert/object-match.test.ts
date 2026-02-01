import { describe, test } from "node:test";
import { equal } from "./equal.ts";
import { objectMatch } from "./object-match.ts";
import { AssertionError } from "./assertion-error.ts";

describe("assert::objectMatch", () => {
    test("passes when objects are equal", () => {
        objectMatch({ foo: "bar" }, { foo: "bar" });
        objectMatch({ a: 1, b: 2 }, { a: 1, b: 2 });
    });

    test("passes when expected is subset of actual", () => {
        objectMatch({ foo: 1, bar: 2 }, { foo: 1 });
        objectMatch({ a: 1, b: 2, c: 3 }, { a: 1 });
        objectMatch({ x: 10, y: 20, z: 30 }, { x: 10, z: 30 });
    });

    test("passes with nested objects", () => {
        objectMatch(
            { foo: { bar: 3, baz: 4 } },
            { foo: { bar: 3 } },
        );
        objectMatch(
            { a: { b: { c: 1, d: 2 } } },
            { a: { b: { c: 1 } } },
        );
    });

    test("passes with arrays inside objects", () => {
        objectMatch(
            { foo: [1, 2, 3], bar: true },
            { foo: [1, 2, 3] },
        );
        objectMatch(
            { items: [{ id: 1 }, { id: 2 }] },
            { items: [{ id: 1 }] },
        );
    });

    test("throws when actual is missing expected key", () => {
        let threw = false;
        try {
            objectMatch({ foo: 1 }, { foo: 1, bar: 2 });
        } catch (e) {
            threw = true;
            equal(e instanceof AssertionError, true);
        }
        equal(threw, true);
    });

    test("throws when values don't match", () => {
        let threw = false;
        try {
            objectMatch({ foo: "bar" }, { foo: "baz" });
        } catch (e) {
            threw = true;
            equal(e instanceof AssertionError, true);
        }
        equal(threw, true);
    });

    test("throws when nested values don't match", () => {
        let threw = false;
        try {
            objectMatch(
                { foo: { bar: 1 } },
                { foo: { bar: 2 } },
            );
        } catch (e) {
            threw = true;
            equal(e instanceof AssertionError, true);
        }
        equal(threw, true);
    });

    test("throws with custom message", () => {
        let message = "";
        try {
            objectMatch({ a: 1 }, { a: 2 }, "values should match");
        } catch (e) {
            message = (e as Error).message;
        }
        equal(message.includes("values should match"), true);
    });

    test("works with symbol keys", () => {
        const sym = Symbol("foo");
        objectMatch({ [sym]: true, bar: false }, { [sym]: true });
    });

    test("works with Date objects", () => {
        const date = new Date(2025, 0, 1);
        objectMatch({ created: date, name: "test" }, { name: "test" });
    });

    test("works with null values", () => {
        objectMatch({ foo: null, bar: 1 }, { foo: null });
    });

    test("works with undefined values", () => {
        objectMatch({ foo: undefined, bar: 1 }, { foo: undefined });
    });

    test("works with RegExp values", () => {
        objectMatch({ pattern: /abc+/i, bar: 1 }, { pattern: /abc+/i });
    });

    test("handles circular references", () => {
        const obj: Record<string, unknown> = { foo: true };
        obj.bar = obj;
        objectMatch(obj, { foo: true });
    });

    test("works with Map inside objects", () => {
        const map = new Map([["key", "value"]]);
        objectMatch({ data: map, extra: 1 }, { data: map });
    });

    test("works with Set inside objects", () => {
        const set = new Set([1, 2, 3]);
        objectMatch({ data: set, extra: 1 }, { data: set });
    });

    test("works with deeply nested structures", () => {
        objectMatch(
            {
                level1: {
                    level2: {
                        level3: {
                            value: 42,
                            extra: "ignored",
                        },
                    },
                },
            },
            {
                level1: {
                    level2: {
                        level3: {
                            value: 42,
                        },
                    },
                },
            },
        );
    });

    test("works with empty objects", () => {
        objectMatch({}, {});
        objectMatch({ a: 1 }, {});
    });

    test("works with arrays of objects", () => {
        objectMatch(
            { users: [{ name: "Alice", age: 30 }, { name: "Bob", age: 25 }] },
            { users: [{ name: "Alice" }] },
        );
    });
});
