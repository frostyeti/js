import { describe, test } from "node:test";
import { equal } from "./equal.js";
import { exists } from "./exists.js";
describe("assert::exists", () => {
  describe("passes for existing values", () => {
    test("passes for numbers", () => {
      exists(0);
      exists(1);
      exists(-1);
      exists(3.14);
      exists(Infinity);
      exists(-Infinity);
    });
    test("passes for NaN", () => {
      exists(NaN);
    });
    test("passes for strings", () => {
      exists("");
      exists("hello");
      exists("   ");
    });
    test("passes for booleans", () => {
      exists(true);
      exists(false);
    });
    test("passes for objects", () => {
      exists({});
      exists({ a: 1 });
    });
    test("passes for arrays", () => {
      exists([]);
      exists([1, 2, 3]);
    });
    test("passes for functions", () => {
      exists(() => {});
      exists(function named() {});
    });
    test("passes for symbols", () => {
      exists(Symbol("test"));
    });
    test("passes for bigints", () => {
      exists(0n);
      exists(BigInt(123));
    });
  });
  describe("passes for complex types", () => {
    test("passes for Date objects", () => {
      exists(new Date());
    });
    test("passes for RegExp objects", () => {
      exists(/pattern/);
    });
    test("passes for Map objects", () => {
      exists(new Map());
    });
    test("passes for Set objects", () => {
      exists(new Set());
    });
    test("passes for Promise objects", () => {
      exists(Promise.resolve());
    });
    test("passes for TypedArrays", () => {
      exists(new Uint8Array());
      exists(new Int32Array());
    });
    test("passes for Error objects", () => {
      exists(new Error());
    });
  });
  describe("throws for null", () => {
    test("throws for null", () => {
      let threw = false;
      try {
        exists(null);
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
    test("error message mentions null", () => {
      let message = "";
      try {
        exists(null);
      } catch (e) {
        message = e.message;
      }
      equal(message.includes("null"), true);
    });
  });
  describe("throws for undefined", () => {
    test("throws for undefined", () => {
      let threw = false;
      try {
        exists(undefined);
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
    test("error message mentions undefined", () => {
      let message = "";
      try {
        exists(undefined);
      } catch (e) {
        message = e.message;
      }
      equal(message.includes("undefined"), true);
    });
  });
  describe("custom message", () => {
    test("includes custom message for null", () => {
      let message = "";
      try {
        exists(null, "value should exist");
      } catch (e) {
        message = e.message;
      }
      equal(message.includes("value should exist"), true);
    });
    test("includes custom message for undefined", () => {
      let message = "";
      try {
        exists(undefined, "expected a value");
      } catch (e) {
        message = e.message;
      }
      equal(message.includes("expected a value"), true);
    });
  });
  describe("type narrowing", () => {
    test("narrows type after assertion", () => {
      const value = "hello";
      exists(value);
      // After exists(), value is narrowed to string
      equal(value.toUpperCase(), "HELLO");
    });
    test("works with optional chaining result", () => {
      const obj = { nested: { value: 42 } };
      const value = obj?.nested?.value;
      exists(value);
      equal(value * 2, 84);
    });
  });
  describe("edge cases", () => {
    test("passes for empty collections", () => {
      exists([]);
      exists({});
      exists(new Map());
      exists(new Set());
    });
    test("passes for zero and falsy values", () => {
      exists(0);
      exists("");
      exists(false);
      exists(0n);
    });
    test("distinguishes between null and undefined", () => {
      // Both should throw, but with different messages
      let nullMessage = "";
      let undefinedMessage = "";
      try {
        exists(null);
      } catch (e) {
        nullMessage = e.message;
      }
      try {
        exists(undefined);
      } catch (e) {
        undefinedMessage = e.message;
      }
      equal(nullMessage.includes("null"), true);
      equal(undefinedMessage.includes("undefined"), true);
    });
  });
});
