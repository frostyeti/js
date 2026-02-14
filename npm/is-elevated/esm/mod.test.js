import { test } from "node:test";
import { equal, ok } from "@frostyeti/assert";
import { isElevated } from "./mod.js";
import process from "node:process";
import { WINDOWS } from "@frostyeti/globals/os";
const CI = process.env.CI === "true" || process.env.CI === "1" ||
  process.env.GITHUB_ACTIONS === "true" || process.env.GITHUB_ACTIONS === "1" ||
  process.env.TF_BUILD === "true" || process.env.TF_BUILD === "1";
const uid = process.getuid?.();
const unixIsRoot = uid === 0;
test("isElevated returns a boolean", () => {
  const result = isElevated();
  equal(typeof result, "boolean");
});
test("isElevated with cache=true returns consistent results", () => {
  const first = isElevated(true);
  const second = isElevated(true);
  equal(first, second);
});
test("isElevated with cache=false re-evaluates", () => {
  // This should not throw and should return a boolean
  const result = isElevated(false);
  equal(typeof result, "boolean");
});
test("isElevated caches by default", () => {
  const first = isElevated();
  const second = isElevated();
  equal(first, second);
});
test("isElevated returns false for non-elevated process", {
  skip: unixIsRoot || CI,
}, () => {
  // Skip this test if running as root or in CI
  const result = isElevated();
  ok(!result, "Expected non-elevated process to return false");
});
test("isElevated returns true for elevated process", {
  skip: !unixIsRoot && !(WINDOWS && CI),
}, () => {
  if (!unixIsRoot && !(WINDOWS && CI)) {
    return;
  }
  // Skip this test if NOT running as root
  const result = isElevated();
  ok(result, "Expected elevated process to return true");
});
test("isElevated does not throw", () => {
  try {
    const result = isElevated();
    console.log(`isElevated returned: ${result}`);
  } catch (error) {
    ok(false, `isElevated threw an error: ${error}`);
  }
});
