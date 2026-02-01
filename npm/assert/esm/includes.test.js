import { describe, test } from "node:test";
import { equal } from "./equal.js";
import { stringIncludes } from "./string-includes.js";
import { arrayIncludes } from "./array-includes.js";
import { AssertionError } from "./assertion-error.js";
describe("assert::stringIncludes", () => {
  test("passes when string includes substring", () => {
    stringIncludes("hello world", "world");
    stringIncludes("hello world", "hello");
    stringIncludes("hello world", " ");
    stringIncludes("hello world", "o w");
  });
  test("passes when string equals substring", () => {
    stringIncludes("hello", "hello");
  });
  test("passes with empty substring", () => {
    stringIncludes("hello", "");
  });
  test("throws when string does not include substring", () => {
    let threw = false;
    try {
      stringIncludes("hello", "world");
    } catch (e) {
      threw = true;
      equal(e instanceof AssertionError, true);
    }
    equal(threw, true);
  });
  test("throws with custom message", () => {
    let message = "";
    try {
      stringIncludes("hello", "xyz", "should contain xyz");
    } catch (e) {
      message = e.message;
    }
    equal(message.includes("should contain xyz"), true);
  });
  test("is case sensitive", () => {
    let threw = false;
    try {
      stringIncludes("Hello World", "hello");
    } catch {
      threw = true;
    }
    equal(threw, true);
  });
  test("works with Unicode characters", () => {
    stringIncludes("こんにちは世界", "世界");
    stringIncludes("Hello 世界", "世界");
  });
  test("works with emoji", () => {
    stringIncludes("Hello 👋 World", "👋");
    stringIncludes("🎉 party 🎉", "party");
  });
  test("works with numbers in strings", () => {
    stringIncludes("abc123def", "123");
    stringIncludes("test 42 test", "42");
  });
  test("works with special characters", () => {
    stringIncludes("hello\nworld", "\n");
    stringIncludes("hello\tworld", "\t");
    stringIncludes("hello\\world", "\\");
  });
  test("works with multi-byte characters", () => {
    stringIncludes("café", "é");
    stringIncludes("naïve", "ï");
  });
});
describe("assert::arrayIncludes", () => {
  test("passes when array includes value", () => {
    arrayIncludes([1, 2, 3], [2]);
    arrayIncludes(["a", "b", "c"], ["b"]);
    arrayIncludes([true, false], [true]);
  });
  test("passes when array includes multiple values", () => {
    arrayIncludes([1, 2, 3, 4, 5], [2, 4]);
    arrayIncludes(["a", "b", "c"], ["a", "c"]);
  });
  test("passes when array includes all values", () => {
    arrayIncludes([1, 2, 3], [1, 2, 3]);
  });
  test("passes with objects (deep equality)", () => {
    arrayIncludes([{ a: 1 }, { b: 2 }], [{ a: 1 }]);
  });
  test("passes with empty expected array", () => {
    arrayIncludes([1, 2, 3], []);
  });
  test("throws when array does not include value", () => {
    let threw = false;
    try {
      arrayIncludes([1, 2, 3], [4]);
    } catch (e) {
      threw = true;
      equal(e instanceof AssertionError, true);
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
  test("throws with custom message", () => {
    let message = "";
    try {
      arrayIncludes([1, 2], [3], "should contain 3");
    } catch (e) {
      message = e.message;
    }
    equal(message.includes("should contain 3"), true);
  });
  test("works with TypedArrays", () => {
    arrayIncludes(Uint8Array.from([1, 2, 3, 4]), Uint8Array.from([1, 2]));
  });
  test("works with nested arrays", () => {
    arrayIncludes([[1, 2], [3, 4]], [[1, 2]]);
  });
  test("works with null and undefined", () => {
    arrayIncludes([null, undefined, 1], [null]);
    arrayIncludes([null, undefined, 1], [undefined]);
  });
  test("works with empty arrays", () => {
    let threw = false;
    try {
      arrayIncludes([], [1]);
    } catch {
      threw = true;
    }
    equal(threw, true);
  });
  test("works with strings in arrays", () => {
    arrayIncludes(["hello", "world"], ["world"]);
    arrayIncludes(["🎉", "🚀"], ["🎉"]);
  });
});
