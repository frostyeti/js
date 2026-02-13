import { test } from "node:test";
import { equal, ok } from "@frostyeti/assert";
import { isProcessElevated } from "./mod.ts";
import process from "node:process";
import { WINDOWS } from "@frostyeti/globals/os";

const CI = process.env.CI === "true" || process.env.CI === "1" || process.env.GITHUB_ACTIONS === "true" || process.env.GITHUB_ACTIONS === "1" || process.env.TF_BUILD === "true" || process.env.TF_BUILD === "1";
const uid = process.getuid?.();
const unixIsRoot = uid === 0;

test("isProcessElevated returns a boolean", () => {
    const result = isProcessElevated();
    equal(typeof result, "boolean");
});

test("isProcessElevated with cache=true returns consistent results", () => {
    const first = isProcessElevated(true);
    const second = isProcessElevated(true);
    equal(first, second);
});

test("isProcessElevated with cache=false re-evaluates", () => {
    // This should not throw and should return a boolean
    const result = isProcessElevated(false);
    equal(typeof result, "boolean");
});

test("isProcessElevated caches by default", () => {
    const first = isProcessElevated();
    const second = isProcessElevated();
    equal(first, second);
});

test("isProcessElevated returns false for non-elevated process", { skip: unixIsRoot || CI }, () => {
    // Skip this test if running as root or in CI
    const result = isProcessElevated();
    ok(!result, "Expected non-elevated process to return false");
});

test("isProcessElevated returns true for elevated process", { skip: !unixIsRoot && !(WINDOWS && CI) }, () => {
    if (!unixIsRoot && !(WINDOWS && CI)) {
        return;
    }

    // Skip this test if NOT running as root
    const result = isProcessElevated();
    ok(result, "Expected elevated process to return true");
});

test("isProcessElevated does not throw", () => {
    try {
        const result = isProcessElevated();
        console.log(`isProcessElevated returned: ${result}`);
    } catch (error) {
        ok(false, `isProcessElevated threw an error: ${error}`);
    }
});
