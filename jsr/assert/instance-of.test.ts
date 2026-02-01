import { describe, test } from "node:test";
import { equal } from "./equal.ts";
import { instanceOf } from "./instance-of.ts";
import { notInstanceOf } from "./not-instance-of.ts";
import { AssertionError } from "./assertion-error.ts";

describe("assert::instanceOf", () => {
    test("passes for Error instances", () => {
        instanceOf(new Error("test"), Error);
        instanceOf(new TypeError("test"), Error);
        instanceOf(new TypeError("test"), TypeError);
    });

    test("passes for Array instances", () => {
        instanceOf([], Array);
        instanceOf([1, 2, 3], Array);
    });

    test("passes for Date instances", () => {
        instanceOf(new Date(), Date);
    });

    test("passes for RegExp instances", () => {
        instanceOf(/abc/, RegExp);
        instanceOf(new RegExp("abc"), RegExp);
    });

    test("passes for Map and Set instances", () => {
        instanceOf(new Map(), Map);
        instanceOf(new Set(), Set);
    });

    test("passes for TypedArray instances", () => {
        instanceOf(new Uint8Array([1, 2, 3]), Uint8Array);
        instanceOf(new Float64Array([1.1]), Float64Array);
    });

    test("passes for custom class instances", () => {
        class MyClass {}
        instanceOf(new MyClass(), MyClass);
    });

    test("passes for subclass instances", () => {
        class Parent {}
        class Child extends Parent {}
        instanceOf(new Child(), Parent);
        instanceOf(new Child(), Child);
    });

    test("throws when not an instance", () => {
        let threw = false;
        try {
            instanceOf({}, Array);
        } catch (e) {
            threw = true;
            equal(e instanceof AssertionError, true);
        }
        equal(threw, true);
    });

    test("throws for primitives", () => {
        let threw = false;
        try {
            instanceOf("string", String);
        } catch {
            threw = true;
        }
        equal(threw, true);
    });

    test("throws with custom message", () => {
        let message = "";
        try {
            instanceOf({}, Array, "should be an Array");
        } catch (e) {
            message = (e as Error).message;
        }
        equal(message.includes("should be an Array"), true);
    });

    test("works with Promise instances", () => {
        instanceOf(Promise.resolve(), Promise);
        instanceOf(new Promise(() => {}), Promise);
    });

    test("works with Function instances", () => {
        instanceOf(() => {}, Function);
        instanceOf(function () {}, Function);
    });
});

describe("assert::notInstanceOf", () => {
    test("passes when not an instance", () => {
        notInstanceOf({}, Array);
        notInstanceOf([], Map);
        notInstanceOf("string", Array);
    });

    test("passes for primitives", () => {
        notInstanceOf("string", String);
        notInstanceOf(123, Number);
        notInstanceOf(true, Boolean);
    });

    test("throws when is an instance", () => {
        let threw = false;
        try {
            notInstanceOf([], Array);
        } catch (e) {
            threw = true;
            equal(e instanceof AssertionError, true);
        }
        equal(threw, true);
    });

    test("throws for Error instances", () => {
        let threw = false;
        try {
            notInstanceOf(new Error(), Error);
        } catch {
            threw = true;
        }
        equal(threw, true);
    });

    test("throws with custom message", () => {
        let message = "";
        try {
            notInstanceOf([], Array, "should not be an Array");
        } catch (e) {
            message = (e as Error).message;
        }
        equal(message.includes("should not be an Array"), true);
    });

    test("passes for null and undefined", () => {
        notInstanceOf(null, Object);
        notInstanceOf(undefined, Object);
    });
});
