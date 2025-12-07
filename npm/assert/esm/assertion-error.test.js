import { test } from "node:test";
import { AssertionError } from "./assertion-error.js";
test("assert::AssertionError - constructor", () => {
  const e1 = new AssertionError("Assertion failed");
  if (e1.message !== "Assertion failed") {
    throw new Error("Expected message to be 'Assertion failed'");
  }
  if (e1.link !== "https://jsr.io/@frostyetiassert/docs/assert-error") {
    throw new Error(
      "Expected link to be 'https://jsr.io/@frostyetiassert/docs/assert-error'",
    );
  }
  if (e1.expected !== undefined) {
    throw new Error("Expected target to be undefined");
  }
  const e2 = new AssertionError("Assertion failed", {
    link: "https://example.com/docs",
    expected: "someObject",
  });
  if (e2.message !== "Assertion failed") {
    throw new Error("Expected message to be 'Assertion failed'");
  }
  if (e2.link !== "https://example.com/docs") {
    throw new Error("Expected link to be 'https://example.com/docs'");
  }
  if (e2.expected !== "someObject") {
    throw new Error("Expected target to be 'someObject'");
  }
});
test("assert::AssertionError - is", () => {
  const e1 = new AssertionError("Assertion failed");
  if (!AssertionError.is(e1)) {
    throw new Error("Expected e1 to be an AssertionError");
  }
  const e2 = new Error("Assertion failed");
  if (AssertionError.is(e2)) {
    throw new Error("Expected e2 to not be an AssertionError");
  }
  const e3 = new Error("Assertion failed");
  e3.name = "AssertionError";
  if (!AssertionError.is(e3)) {
    throw new Error("Expected e3 to be an AssertionError");
  }
});
