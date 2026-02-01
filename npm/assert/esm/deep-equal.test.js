import { describe, test } from "node:test";
import { equal } from "./equal.js";
import { deepEqual } from "./deep-equal.js";
import { throws } from "./throws.js";
describe("assert::deepEqual", () => {
  describe("primitives", () => {
    test("returns true for identical numbers", () => {
      equal(deepEqual(1, 1), true);
      equal(deepEqual(0, 0), true);
      equal(deepEqual(-1, -1), true);
      equal(deepEqual(3.14, 3.14), true);
    });
    test("returns true for identical strings", () => {
      equal(deepEqual("hello", "hello"), true);
      equal(deepEqual("", ""), true);
      equal(deepEqual("unicode: 你好", "unicode: 你好"), true);
    });
    test("returns true for identical booleans", () => {
      equal(deepEqual(true, true), true);
      equal(deepEqual(false, false), true);
    });
    test("returns true for null and undefined", () => {
      equal(deepEqual(null, null), true);
      equal(deepEqual(undefined, undefined), true);
    });
    test("returns false for null vs undefined", () => {
      equal(deepEqual(null, undefined), false);
      equal(deepEqual(undefined, null), false);
    });
    test("returns true for NaN", () => {
      equal(deepEqual(NaN, NaN), true);
    });
    test("returns true for 0 and -0", () => {
      equal(deepEqual(0, -0), true);
      equal(deepEqual(-0, 0), true);
    });
    test("returns false for different primitives", () => {
      equal(deepEqual(1, 2), false);
      equal(deepEqual("a", "b"), false);
      equal(deepEqual(true, false), false);
    });
    test("returns true for identical bigints", () => {
      equal(deepEqual(BigInt(123), BigInt(123)), true);
      equal(deepEqual(0n, 0n), true);
    });
    test("returns false for different bigints", () => {
      equal(deepEqual(BigInt(1), BigInt(2)), false);
    });
    test("returns true for identical symbols", () => {
      const sym = Symbol("test");
      equal(deepEqual(sym, sym), true);
    });
    test("returns false for different symbols", () => {
      equal(deepEqual(Symbol("test"), Symbol("test")), false);
    });
  });
  describe("arrays", () => {
    test("returns true for identical arrays", () => {
      equal(deepEqual([1, 2, 3], [1, 2, 3]), true);
    });
    test("returns true for empty arrays", () => {
      equal(deepEqual([], []), true);
    });
    test("returns false for different length arrays", () => {
      equal(deepEqual([1, 2], [1, 2, 3]), false);
    });
    test("returns false for different values", () => {
      equal(deepEqual([1, 2, 3], [1, 2, 4]), false);
    });
    test("returns true for nested arrays", () => {
      equal(deepEqual([[1, 2], [3, 4]], [[1, 2], [3, 4]]), true);
    });
    test("returns false for different nested arrays", () => {
      equal(deepEqual([[1, 2], [3, 4]], [[1, 2], [3, 5]]), false);
    });
    test("handles arrays with mixed types", () => {
      equal(deepEqual([1, "two", true, null], [1, "two", true, null]), true);
      equal(deepEqual([1, "two", true, null], [1, "two", false, null]), false);
    });
  });
  describe("objects", () => {
    test("returns true for identical objects", () => {
      equal(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 }), true);
    });
    test("returns true for empty objects", () => {
      equal(deepEqual({}, {}), true);
    });
    test("returns false for different keys", () => {
      equal(deepEqual({ a: 1 }, { b: 1 }), false);
    });
    test("returns false for different values", () => {
      equal(deepEqual({ a: 1 }, { a: 2 }), false);
    });
    test("returns true for nested objects", () => {
      equal(deepEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } }), true);
    });
    test("returns false for different nested values", () => {
      equal(deepEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 2 } } }), false);
    });
    test("handles objects with array values", () => {
      equal(deepEqual({ arr: [1, 2, 3] }, { arr: [1, 2, 3] }), true);
    });
    test("order of keys doesn't matter", () => {
      equal(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 }), true);
    });
    test("handles symbol keys", () => {
      const sym = Symbol("key");
      equal(deepEqual({ [sym]: 1 }, { [sym]: 1 }), true);
    });
  });
  describe("Date objects", () => {
    test("returns true for same dates", () => {
      const d1 = new Date("2024-01-01");
      const d2 = new Date("2024-01-01");
      equal(deepEqual(d1, d2), true);
    });
    test("returns false for different dates", () => {
      const d1 = new Date("2024-01-01");
      const d2 = new Date("2024-01-02");
      equal(deepEqual(d1, d2), false);
    });
    test("handles Invalid Date", () => {
      const d1 = new Date("invalid");
      const d2 = new Date("invalid");
      equal(deepEqual(d1, d2), true);
    });
  });
  describe("Set objects", () => {
    test("returns true for identical sets", () => {
      equal(deepEqual(new Set([1, 2, 3]), new Set([1, 2, 3])), true);
    });
    test("returns true for empty sets", () => {
      equal(deepEqual(new Set(), new Set()), true);
    });
    test("returns false for different sets", () => {
      equal(deepEqual(new Set([1, 2]), new Set([1, 3])), false);
    });
    test("returns false for different size sets", () => {
      equal(deepEqual(new Set([1, 2]), new Set([1, 2, 3])), false);
    });
    test("handles sets with object values", () => {
      const obj = { a: 1 };
      equal(deepEqual(new Set([obj]), new Set([obj])), true);
    });
  });
  describe("Map objects", () => {
    test("returns true for identical maps", () => {
      const m1 = new Map([["a", 1], ["b", 2]]);
      const m2 = new Map([["a", 1], ["b", 2]]);
      equal(deepEqual(m1, m2), true);
    });
    test("returns true for empty maps", () => {
      equal(deepEqual(new Map(), new Map()), true);
    });
    test("returns false for different values", () => {
      const m1 = new Map([["a", 1]]);
      const m2 = new Map([["a", 2]]);
      equal(deepEqual(m1, m2), false);
    });
    test("returns false for different keys", () => {
      const m1 = new Map([["a", 1]]);
      const m2 = new Map([["b", 1]]);
      equal(deepEqual(m1, m2), false);
    });
    test("handles maps with object keys", () => {
      const key = { id: 1 };
      const m1 = new Map([[key, "value"]]);
      const m2 = new Map([[key, "value"]]);
      equal(deepEqual(m1, m2), true);
    });
  });
  describe("TypedArrays", () => {
    test("returns true for identical Uint8Arrays", () => {
      equal(
        deepEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3])),
        true,
      );
    });
    test("returns false for different Uint8Arrays", () => {
      equal(
        deepEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 4])),
        false,
      );
    });
    test("returns false for different length TypedArrays", () => {
      equal(
        deepEqual(new Uint8Array([1, 2]), new Uint8Array([1, 2, 3])),
        false,
      );
    });
    test("works with Int32Array", () => {
      equal(
        deepEqual(new Int32Array([1, -2, 3]), new Int32Array([1, -2, 3])),
        true,
      );
    });
    test("works with Float64Array", () => {
      equal(
        deepEqual(new Float64Array([1.5, 2.5]), new Float64Array([1.5, 2.5])),
        true,
      );
    });
    test("works with BigInt64Array", () => {
      equal(
        deepEqual(
          new BigInt64Array([1n, 2n, 3n]),
          new BigInt64Array([1n, 2n, 3n]),
        ),
        true,
      );
    });
  });
  describe("RegExp objects", () => {
    test("returns true for identical regexps", () => {
      equal(deepEqual(/abc/, /abc/), true);
    });
    test("returns true for regexps with same flags", () => {
      equal(deepEqual(/abc/gi, /abc/gi), true);
    });
    test("returns false for different patterns", () => {
      equal(deepEqual(/abc/, /def/), false);
    });
    test("returns false for different flags", () => {
      equal(deepEqual(/abc/i, /abc/g), false);
    });
  });
  describe("URL objects", () => {
    test("returns true for identical URLs", () => {
      equal(
        deepEqual(
          new URL("https://example.com/path"),
          new URL("https://example.com/path"),
        ),
        true,
      );
    });
    test("returns false for different URLs", () => {
      equal(
        deepEqual(
          new URL("https://example.com/a"),
          new URL("https://example.com/b"),
        ),
        false,
      );
    });
  });
  describe("circular references", () => {
    test("handles circular references in objects", () => {
      const a = { x: 1 };
      a.self = a;
      const b = { x: 1 };
      b.self = b;
      equal(deepEqual(a, b), true);
    });
    test("handles circular references in arrays", () => {
      const a = [1, 2];
      a.push(a);
      const b = [1, 2];
      b.push(b);
      equal(deepEqual(a, b), true);
    });
  });
  describe("WeakMap and WeakSet", () => {
    test("throws TypeError for WeakMap", () => {
      throws(
        () => deepEqual(new WeakMap(), new WeakMap()),
        TypeError,
        "cannot compare WeakMap instances",
      );
    });
    test("throws TypeError for WeakSet", () => {
      throws(
        () => deepEqual(new WeakSet(), new WeakSet()),
        TypeError,
        "cannot compare WeakSet instances",
      );
    });
  });
  describe("WeakRef", () => {
    test("compares WeakRef dereferenced values", () => {
      const obj = { value: 42 };
      const ref1 = new WeakRef(obj);
      const ref2 = new WeakRef(obj);
      equal(deepEqual(ref1, ref2), true);
    });
  });
  describe("mixed types", () => {
    test("returns false for object vs array", () => {
      equal(deepEqual({}, []), false);
      equal(deepEqual({ 0: "a" }, ["a"]), false);
    });
    test("returns false for number vs string", () => {
      equal(deepEqual(1, "1"), false);
    });
    test("returns false for object vs null", () => {
      equal(deepEqual({}, null), false);
    });
    test("returns false for array vs null", () => {
      equal(deepEqual([], null), false);
    });
  });
  describe("same reference", () => {
    test("returns true for same object reference", () => {
      const obj = { a: 1 };
      equal(deepEqual(obj, obj), true);
    });
    test("returns true for same array reference", () => {
      const arr = [1, 2, 3];
      equal(deepEqual(arr, arr), true);
    });
  });
});
