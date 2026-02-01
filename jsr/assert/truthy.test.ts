import { describe, test } from "node:test";
import { ok, truthy } from "./truthy.ts";
import { equal } from "./equal.ts";
import { AssertionError } from "./assertion-error.ts";

describe("assert::truthy", () => {
    test("passes for true", () => {
        truthy(true);
    });

    test("passes for non-zero numbers", () => {
        truthy(1);
        truthy(-1);
        truthy(100);
        truthy(0.5);
        truthy(Infinity);
        truthy(-Infinity);
    });

    test("passes for non-empty strings", () => {
        truthy("hello");
        truthy("0");
        truthy("false");
        truthy(" ");
    });

    test("passes for objects", () => {
        truthy({});
        truthy({ a: 1 });
        truthy([]);
        truthy([1, 2, 3]);
    });

    test("passes for functions", () => {
        truthy(() => {});
        truthy(function () {});
    });

    test("passes for symbols", () => {
        truthy(Symbol("test"));
        truthy(Symbol.for("test"));
    });

    test("throws for false", () => {
        let threw = false;
        try {
            truthy(false);
        } catch (e) {
            threw = true;
            equal(e instanceof AssertionError, true);
        }
        equal(threw, true);
    });

    test("throws for zero", () => {
        let threw = false;
        try {
            truthy(0);
        } catch {
            threw = true;
        }
        equal(threw, true);
    });

    test("throws for empty string", () => {
        let threw = false;
        try {
            truthy("");
        } catch {
            threw = true;
        }
        equal(threw, true);
    });

    test("throws for null", () => {
        let threw = false;
        try {
            truthy(null);
        } catch {
            threw = true;
        }
        equal(threw, true);
    });

    test("throws for undefined", () => {
        let threw = false;
        try {
            truthy(undefined);
        } catch {
            threw = true;
        }
        equal(threw, true);
    });

    test("throws for NaN", () => {
        let threw = false;
        try {
            truthy(NaN);
        } catch {
            threw = true;
        }
        equal(threw, true);
    });

    test("throws with custom message", () => {
        let message = "";
        try {
            truthy(false, "custom error message");
        } catch (e) {
            message = (e as Error).message;
        }
        equal(message, "custom error message");
    });
});

describe("assert::ok", () => {
    test("ok is an alias for truthy", () => {
        ok(true);
        ok(1);
        ok("hello");
        ok({});
    });

    test("ok throws for falsy values", () => {
        let threw = false;
        try {
            ok(false);
        } catch {
            threw = true;
        }
        equal(threw, true);
    });
});
