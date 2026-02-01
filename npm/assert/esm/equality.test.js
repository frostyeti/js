import { describe, test } from "node:test";
import { equal } from "./equal.js";
import { strictEquals } from "./strict-equal.js";
import { notStrictEquals } from "./not-strict-equal.js";
import { notEqual } from "./not-equal.js";
import { AssertionError } from "./assertion-error.js";
describe("assert::strictEquals", () => {
  test("passes for identical primitives", () => {
    strictEquals(1, 1);
    strictEquals("hello", "hello");
    strictEquals(true, true);
    strictEquals(null, null);
    strictEquals(undefined, undefined);
  });
  test("passes for same object reference", () => {
    const obj = { a: 1 };
    strictEquals(obj, obj);
  });
  test("passes for same array reference", () => {
    const arr = [1, 2, 3];
    strictEquals(arr, arr);
  });
  test("passes for same function reference", () => {
    const fn = () => {};
    strictEquals(fn, fn);
  });
  test("throws for different object references", () => {
    let threw = false;
    try {
      strictEquals({ a: 1 }, { a: 1 });
    } catch (e) {
      threw = true;
      equal(e instanceof AssertionError, true);
    }
    equal(threw, true);
  });
  test("throws for different array references", () => {
    let threw = false;
    try {
      strictEquals([1, 2], [1, 2]);
    } catch {
      threw = true;
    }
    equal(threw, true);
  });
  test("throws for 0 and -0", () => {
    // Object.is(0, -0) is false
    let threw = false;
    try {
      strictEquals(0, -0);
    } catch {
      threw = true;
    }
    equal(threw, true);
  });
  test("passes for NaN === NaN", () => {
    // Object.is(NaN, NaN) is true
    strictEquals(NaN, NaN);
  });
  test("throws with custom message", () => {
    let message = "";
    try {
      strictEquals(1, 2, "values must be identical");
    } catch (e) {
      message = e.message;
    }
    equal(message.includes("values must be identical"), true);
  });
  test("throws for null vs undefined", () => {
    let threw = false;
    try {
      strictEquals(null, undefined);
    } catch {
      threw = true;
    }
    equal(threw, true);
  });
});
describe("assert::notStrictEquals", () => {
  test("passes for different values", () => {
    notStrictEquals(1, 2);
    notStrictEquals("hello", "world");
    notStrictEquals(true, false);
  });
  test("passes for different object references", () => {
    notStrictEquals({ a: 1 }, { a: 1 });
    notStrictEquals([1, 2], [1, 2]);
  });
  test("passes for 0 and -0", () => {
    notStrictEquals(0, -0);
  });
  test("throws for same reference", () => {
    const obj = { a: 1 };
    let threw = false;
    try {
      notStrictEquals(obj, obj);
    } catch (e) {
      threw = true;
      equal(e instanceof AssertionError, true);
    }
    equal(threw, true);
  });
  test("throws for identical primitives", () => {
    let threw = false;
    try {
      notStrictEquals(1, 1);
    } catch {
      threw = true;
    }
    equal(threw, true);
  });
  test("throws for NaN", () => {
    let threw = false;
    try {
      notStrictEquals(NaN, NaN);
    } catch {
      threw = true;
    }
    equal(threw, true);
  });
  test("throws with custom message", () => {
    let message = "";
    try {
      notStrictEquals(1, 1, "values should differ");
    } catch (e) {
      message = e.message;
    }
    equal(message.includes("values should differ"), true);
  });
  test("passes for null vs undefined", () => {
    notStrictEquals(null, undefined);
  });
});
describe("assert::notEqual", () => {
  test("passes for different values", () => {
    notEqual(1, 2);
    notEqual("hello", "world");
    notEqual([1, 2], [1, 3]);
    notEqual({ a: 1 }, { a: 2 });
  });
  test("passes for null vs undefined", () => {
    notEqual(null, undefined);
  });
  test("throws for equal values", () => {
    let threw = false;
    try {
      notEqual(1, 1);
    } catch (e) {
      threw = true;
      equal(e instanceof AssertionError, true);
    }
    equal(threw, true);
  });
  test("throws for deeply equal objects", () => {
    let threw = false;
    try {
      notEqual({ a: 1, b: 2 }, { a: 1, b: 2 });
    } catch {
      threw = true;
    }
    equal(threw, true);
  });
  test("throws for deeply equal arrays", () => {
    let threw = false;
    try {
      notEqual([1, 2, 3], [1, 2, 3]);
    } catch {
      threw = true;
    }
    equal(threw, true);
  });
  test("throws with custom message", () => {
    let message = "";
    try {
      notEqual(1, 1, "values should be different");
    } catch (e) {
      message = e.message;
    }
    equal(message.includes("values should be different"), true);
  });
  test("passes for arrays with different length", () => {
    notEqual([1, 2], [1, 2, 3]);
  });
  test("passes for objects with different keys", () => {
    notEqual({ a: 1 }, { b: 1 });
  });
});
