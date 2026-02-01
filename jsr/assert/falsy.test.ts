import { test, describe } from "node:test";
import { equal } from "./equal.ts";
import { falsy, nope, notOk } from "./falsy.ts";
import { AssertionError } from "./assertion-error.ts";

describe("assert::falsy", () => {
    test("passes for false", () => {
        falsy(false);
    });

    test("passes for zero", () => {
        falsy(0);
        falsy(-0);
    });

    test("passes for empty string", () => {
        falsy("");
    });

    test("passes for null", () => {
        falsy(null);
    });

    test("passes for undefined", () => {
        falsy(undefined);
    });

    test("passes for NaN", () => {
        falsy(NaN);
    });

    test("passes for 0n (bigint zero)", () => {
        falsy(0n);
    });

    test("throws for true", () => {
        let threw = false;
        try {
            falsy(true);
        } catch (e) {
            threw = true;
            equal(e instanceof AssertionError, true);
        }
        equal(threw, true);
    });

    test("throws for non-zero numbers", () => {
        let threw = false;
        try {
            falsy(1);
        } catch {
            threw = true;
        }
        equal(threw, true);
    });

    test("throws for non-empty strings", () => {
        let threw = false;
        try {
            falsy("hello");
        } catch {
            threw = true;
        }
        equal(threw, true);
    });

    test("throws for objects", () => {
        let threw = false;
        try {
            falsy({});
        } catch {
            threw = true;
        }
        equal(threw, true);
    });

    test("throws for arrays", () => {
        let threw = false;
        try {
            falsy([]);
        } catch {
            threw = true;
        }
        equal(threw, true);
    });

    test("throws for functions", () => {
        let threw = false;
        try {
            falsy(() => {});
        } catch {
            threw = true;
        }
        equal(threw, true);
    });

    test("throws with custom message", () => {
        let message = "";
        try {
            falsy(true, "should be falsy");
        } catch (e) {
            message = (e as Error).message;
        }
        equal(message.includes("should be falsy"), true);
    });
});

describe("assert::nope", () => {
    test("nope is an alias for falsy", () => {
        nope(false);
        nope(0);
        nope("");
        nope(null);
        nope(undefined);
    });
});

describe("assert::notOk", () => {
    test("notOk is an alias for falsy", () => {
        notOk(false);
        notOk(0);
        notOk("");
        notOk(null);
        notOk(undefined);
    });
});
