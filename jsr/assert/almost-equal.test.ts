// deno-lint-ignore-file no-console
import { test, describe } from "node:test";
import { equal } from "./equal.ts";
import { almostEqual, notAlmostEqual } from "./almost-equal.ts";
import { AssertionError } from "./assertion-error.ts";

describe("assert::almostEqual", () => {
    test("passes when values are exactly equal", () => {
        almostEqual(0, 0);
        almostEqual(1, 1);
        almostEqual(-1, -1);
        almostEqual(1000000, 1000000);
    });

    test("passes when values are within default tolerance (1e-7)", () => {
        almostEqual(0, 0.00000001);
        almostEqual(1, 1.00000001);
        almostEqual(0.1 + 0.2, 0.3, 1e-15);
    });

    test("passes when values are within custom tolerance", () => {
        almostEqual(0.01, 0.02, 0.1);
        almostEqual(1, 1.5, 1);
        almostEqual(100, 110, 15);
    });

    test("throws when values exceed default tolerance", () => {
        let threw = false;
        try {
            almostEqual(0, 0.001);
        } catch (e) {
            threw = true;
            equal(e instanceof AssertionError, true);
        }
        equal(threw, true);
    });

    test("throws when values exceed custom tolerance", () => {
        let threw = false;
        try {
            almostEqual(1, 2, 0.5);
        } catch (e) {
            threw = true;
            equal(e instanceof AssertionError, true);
        }
        equal(threw, true);
    });

    test("handles negative numbers", () => {
        almostEqual(-5, -5.00000001);
        almostEqual(-100, -99.99999999);
    });

    test("handles zero comparisons", () => {
        almostEqual(0, 0);
        almostEqual(-0, 0);
        almostEqual(0, -0);
    });

    test("handles NaN - both NaN passes (Object.is)", () => {
        almostEqual(NaN, NaN);
    });

    test("handles Infinity", () => {
        almostEqual(Infinity, Infinity);
        almostEqual(-Infinity, -Infinity);
    });

    test("throws with custom message", () => {
        let message = "";
        try {
            almostEqual(1, 100, 1, "custom message");
        } catch (e) {
            message = (e as Error).message;
        }
        equal(message.includes("custom message"), true);
    });

    test("handles very small differences", () => {
        almostEqual(1e-10, 1e-10);
        almostEqual(1e-15, 2e-15, 1e-14);
    });

    test("handles floating point precision issues", () => {
        // Classic floating point issue
        const result = 0.1 + 0.2;
        almostEqual(result, 0.3, 1e-10);
    });
});

describe("assert::notAlmostEqual", () => {
    test("passes when values are different", () => {
        notAlmostEqual(1, 2);
        notAlmostEqual(0, 1);
        notAlmostEqual(-5, 5);
    });

    test("passes when values exceed tolerance", () => {
        notAlmostEqual(1, 1.0001, 1e-5);
        notAlmostEqual(0, 0.001);
    });

    test("throws when values are equal", () => {
        let threw = false;
        try {
            notAlmostEqual(1, 1);
        } catch (e) {
            threw = true;
            equal(e instanceof AssertionError, true);
        }
        equal(threw, true);
    });

    test("throws when values are within tolerance", () => {
        let threw = false;
        try {
            notAlmostEqual(1, 1.0000001, 1e-6);
        } catch (e) {
            threw = true;
            equal(e instanceof AssertionError, true);
        }
        equal(threw, true);
    });

    test("throws with custom message", () => {
        let message = "";
        try {
            notAlmostEqual(1, 1, 1e-7, "should not be equal");
        } catch (e) {
            message = (e as Error).message;
        }
        equal(message.includes("should not be equal"), true);
    });
});
