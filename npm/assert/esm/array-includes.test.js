import { describe, test } from "node:test";
import { equal } from "./equal.js";
import { arrayIncludes } from "./array-includes.js";
describe("assert::arrayIncludes", () => {
  describe("primitive values", () => {
    test("passes when array includes single value", () => {
      arrayIncludes([1, 2, 3], [2]);
    });
    test("passes when array includes multiple values", () => {
      arrayIncludes([1, 2, 3, 4, 5], [2, 4]);
    });
    test("passes when array includes all expected values", () => {
      arrayIncludes([1, 2, 3], [1, 2, 3]);
    });
    test("passes with empty expected array", () => {
      arrayIncludes([1, 2, 3], []);
    });
    test("throws when value is missing", () => {
      let threw = false;
      try {
        arrayIncludes([1, 2, 3], [4]);
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
    test("throws when any expected value is missing", () => {
      let threw = false;
      try {
        arrayIncludes([1, 2, 3], [2, 5]);
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
  });
  describe("string values", () => {
    test("passes with string array", () => {
      arrayIncludes(["a", "b", "c"], ["b"]);
      arrayIncludes(["hello", "world"], ["hello", "world"]);
    });
    test("is case sensitive", () => {
      let threw = false;
      try {
        arrayIncludes(["Hello"], ["hello"]);
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
  });
  describe("object values (deep equality)", () => {
    test("passes with matching objects", () => {
      arrayIncludes([{ a: 1 }, { b: 2 }], [{ a: 1 }]);
    });
    test("passes with nested objects", () => {
      arrayIncludes([{ user: { name: "Alice" } }, { user: { name: "Bob" } }], [{
        user: { name: "Alice" },
      }]);
    });
    test("throws for non-matching objects", () => {
      let threw = false;
      try {
        arrayIncludes([{ a: 1 }], [{ a: 2 }]);
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
  });
  describe("array values (deep equality)", () => {
    test("passes with matching nested arrays", () => {
      arrayIncludes([[1, 2], [3, 4]], [[1, 2]]);
    });
    test("throws for non-matching nested arrays", () => {
      let threw = false;
      try {
        arrayIncludes([[1, 2]], [[1, 3]]);
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
  });
  describe("special values", () => {
    test("passes with null values", () => {
      arrayIncludes([null, 1, 2], [null]);
    });
    test("passes with undefined values", () => {
      arrayIncludes([undefined, 1, 2], [undefined]);
    });
    test("passes with NaN (using deep equality)", () => {
      arrayIncludes([NaN, 1, 2], [NaN]);
    });
    test("passes with boolean values", () => {
      arrayIncludes([true, false, null], [true, false]);
    });
  });
  describe("TypedArrays", () => {
    test("passes with Uint8Array", () => {
      arrayIncludes(new Uint8Array([1, 2, 3, 4, 5]), [2, 4]);
    });
    test("passes with Int32Array", () => {
      arrayIncludes(new Int32Array([10, 20, 30]), [20]);
    });
    test("throws when value missing in TypedArray", () => {
      let threw = false;
      try {
        arrayIncludes(new Uint8Array([1, 2, 3]), [5]);
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
  });
  describe("custom message", () => {
    test("includes custom message in error", () => {
      let message = "";
      try {
        arrayIncludes([1, 2, 3], [5], "should contain 5");
      } catch (e) {
        message = e.message;
      }
      equal(message.includes("should contain 5"), true);
    });
  });
  describe("edge cases", () => {
    test("throws for empty array with expected values", () => {
      let threw = false;
      try {
        arrayIncludes([], [1]);
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
    test("handles duplicate values", () => {
      arrayIncludes([1, 1, 2, 2, 3, 3], [1, 2, 3]);
    });
    test("order doesn't matter for expected values", () => {
      arrayIncludes([1, 2, 3], [3, 1, 2]);
    });
    test("works with large arrays", () => {
      const arr = Array.from({ length: 1000 }, (_, i) => i);
      arrayIncludes(arr, [0, 500, 999]);
    });
  });
});
