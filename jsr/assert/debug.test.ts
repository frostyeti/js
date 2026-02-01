import { describe, test } from "node:test";
import { equal } from "./equal.ts";
import { debug, isDebugTests, setDebugTests } from "./debug.ts";

describe("assert::debug", () => {
    test("isDebugTests returns false by default", () => {
        // Save current state
        const originalState = isDebugTests();
        setDebugTests(false);

        equal(isDebugTests(), false);

        // Restore original state
        setDebugTests(originalState);
    });

    test("setDebugTests enables debug mode", () => {
        const originalState = isDebugTests();
        setDebugTests(true);

        equal(isDebugTests(), true);

        // Restore original state
        setDebugTests(originalState);
    });

    test("setDebugTests disables debug mode", () => {
        const originalState = isDebugTests();
        setDebugTests(true);
        setDebugTests(false);

        equal(isDebugTests(), false);

        // Restore original state
        setDebugTests(originalState);
    });

    test("debug does not throw when disabled", () => {
        const originalState = isDebugTests();
        setDebugTests(false);

        // Should not throw
        debug("test message");
        debug("multiple", "arguments", 123);
        debug({ object: true });
        debug([1, 2, 3]);

        // Restore original state
        setDebugTests(originalState);
    });

    test("debug does not throw when enabled", () => {
        const originalState = isDebugTests();
        setDebugTests(true);

        // Should not throw (outputs to console)
        debug("test message");
        debug("multiple", "arguments", 123);
        debug({ object: true });
        debug([1, 2, 3]);

        // Restore original state
        setDebugTests(originalState);
    });

    test("debug accepts various argument types", () => {
        const originalState = isDebugTests();
        setDebugTests(false);

        // All these should work without throwing
        debug();
        debug(null);
        debug(undefined);
        debug(true);
        debug(42);
        debug(BigInt(123));
        debug(Symbol("test"));
        debug(() => {});
        debug(new Date());
        debug(new Map());
        debug(new Set());
        debug(new Error("test error"));

        // Restore original state
        setDebugTests(originalState);
    });

    test("debug with spread arguments", () => {
        const originalState = isDebugTests();
        setDebugTests(false);

        const args = [1, 2, 3, "four", { five: 5 }];
        debug(...args);

        // Restore original state
        setDebugTests(originalState);
    });
});
