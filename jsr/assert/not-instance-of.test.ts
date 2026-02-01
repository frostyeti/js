import { describe, test } from "node:test";
import { equal } from "./equal.ts";
import { notInstanceOf } from "./not-instance-of.ts";

describe("assert::notInstanceOf", () => {
    describe("passes for non-instances", () => {
        test("passes for number when expecting Error", () => {
            notInstanceOf(123, Error);
        });

        test("passes for string when expecting Array", () => {
            notInstanceOf("hello", Array);
        });

        test("passes for object literal when expecting Date", () => {
            notInstanceOf({}, Date);
        });

        test("passes for array when expecting Map", () => {
            notInstanceOf([], Map);
        });

        test("passes for Date when expecting RegExp", () => {
            notInstanceOf(new Date(), RegExp);
        });

        test("passes for Map when expecting Set", () => {
            notInstanceOf(new Map(), Set);
        });

        test("passes for Error when expecting TypeError", () => {
            notInstanceOf(new Error(), TypeError);
        });
    });

    describe("passes for primitives", () => {
        test("passes for null when expecting Object", () => {
            notInstanceOf(null, Object);
        });

        test("passes for undefined when expecting Object", () => {
            notInstanceOf(undefined, Object);
        });

        test("passes for boolean when expecting Object", () => {
            notInstanceOf(true, Object);
        });

        test("passes for number when expecting Object", () => {
            notInstanceOf(42, Object);
        });

        test("passes for bigint when expecting Object", () => {
            notInstanceOf(BigInt(123), Object);
        });

        test("passes for symbol when expecting Object", () => {
            notInstanceOf(Symbol("test"), Object);
        });
    });

    describe("throws for actual instances", () => {
        test("throws for Error instance", () => {
            let threw = false;
            try {
                notInstanceOf(new Error(), Error);
            } catch {
                threw = true;
            }
            equal(threw, true);
        });

        test("throws for Array instance", () => {
            let threw = false;
            try {
                notInstanceOf([], Array);
            } catch {
                threw = true;
            }
            equal(threw, true);
        });

        test("throws for Date instance", () => {
            let threw = false;
            try {
                notInstanceOf(new Date(), Date);
            } catch {
                threw = true;
            }
            equal(threw, true);
        });

        test("throws for Map instance", () => {
            let threw = false;
            try {
                notInstanceOf(new Map(), Map);
            } catch {
                threw = true;
            }
            equal(threw, true);
        });

        test("throws for Set instance", () => {
            let threw = false;
            try {
                notInstanceOf(new Set(), Set);
            } catch {
                threw = true;
            }
            equal(threw, true);
        });

        test("throws for TypeError when expecting Error (subclass)", () => {
            let threw = false;
            try {
                notInstanceOf(new TypeError(), Error);
            } catch {
                threw = true;
            }
            equal(threw, true);
        });
    });

    describe("custom classes", () => {
        test("passes when not instance of custom class", () => {
            class MyClass {}
            notInstanceOf({}, MyClass);
        });

        test("throws when instance of custom class", () => {
            class MyClass {}
            let threw = false;
            try {
                notInstanceOf(new MyClass(), MyClass);
            } catch {
                threw = true;
            }
            equal(threw, true);
        });

        test("passes for sibling class instances", () => {
            class Parent {}
            class Child1 extends Parent {}
            class Child2 extends Parent {}
            notInstanceOf(new Child1(), Child2);
        });
    });

    describe("custom message", () => {
        test("includes custom message in error", () => {
            let message = "";
            try {
                notInstanceOf(new Date(), Date, "should not be a Date");
            } catch (e) {
                message = (e as Error).message;
            }
            equal(message.includes("should not be a Date"), true);
        });
    });

    describe("edge cases", () => {
        test("passes for Promise when expecting Array", () => {
            notInstanceOf(Promise.resolve(), Array);
        });

        test("throws for Promise instance", () => {
            let threw = false;
            try {
                notInstanceOf(Promise.resolve(), Promise);
            } catch {
                threw = true;
            }
            equal(threw, true);
        });

        test("passes for TypedArray when expecting Array", () => {
            notInstanceOf(new Uint8Array(), Array);
        });

        test("passes for function when expecting Error", () => {
            notInstanceOf(() => {}, Error);
        });
    });
});
