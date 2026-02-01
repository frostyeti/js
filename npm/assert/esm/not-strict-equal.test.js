import { describe, test } from "node:test";
import { equal } from "./equal.js";
import { notStrictEquals } from "./not-strict-equal.js";
describe("assert::notStrictEquals", () => {
  describe("different primitives", () => {
    test("passes for different numbers", () => {
      notStrictEquals(1, 2);
      notStrictEquals(0, 1);
      notStrictEquals(-1, 1);
      notStrictEquals(3.14, 2.71);
    });
    test("passes for different strings", () => {
      notStrictEquals("hello", "world");
      notStrictEquals("a", "b");
      notStrictEquals("", "x");
    });
    test("passes for different booleans", () => {
      notStrictEquals(true, false);
      notStrictEquals(false, true);
    });
    test("passes for null vs undefined", () => {
      notStrictEquals(null, undefined);
      notStrictEquals(undefined, null);
    });
    test("passes for different bigints", () => {
      notStrictEquals(1n, 2n);
      notStrictEquals(BigInt(100), BigInt(200));
    });
  });
  describe("reference inequality", () => {
    test("passes for different object references", () => {
      notStrictEquals({}, {});
      notStrictEquals({ a: 1 }, { a: 1 });
    });
    test("passes for different array references", () => {
      notStrictEquals([], []);
      notStrictEquals([1, 2], [1, 2]);
    });
    test("passes for different function references", () => {
      notStrictEquals(() => {}, () => {});
    });
    test("passes for different symbols with same description", () => {
      notStrictEquals(Symbol("test"), Symbol("test"));
    });
  });
  describe("special number cases", () => {
    test("passes for 0 and -0 (Object.is behavior)", () => {
      notStrictEquals(0, -0);
      notStrictEquals(-0, 0);
    });
    test("throws for NaN (Object.is considers NaN === NaN)", () => {
      let threw = false;
      try {
        notStrictEquals(NaN, NaN);
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
  });
  describe("throws for identical values", () => {
    test("throws for same number", () => {
      let threw = false;
      try {
        notStrictEquals(1, 1);
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
    test("throws for same string", () => {
      let threw = false;
      try {
        notStrictEquals("hello", "hello");
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
    test("throws for same boolean", () => {
      let threw = false;
      try {
        notStrictEquals(true, true);
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
    test("throws for same object reference", () => {
      const obj = { a: 1 };
      let threw = false;
      try {
        notStrictEquals(obj, obj);
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
    test("throws for same array reference", () => {
      const arr = [1, 2, 3];
      let threw = false;
      try {
        notStrictEquals(arr, arr);
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
    test("throws for null vs null", () => {
      let threw = false;
      try {
        notStrictEquals(null, null);
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
    test("throws for undefined vs undefined", () => {
      let threw = false;
      try {
        notStrictEquals(undefined, undefined);
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
        notStrictEquals(1, 1, "values should differ");
      } catch (e) {
        message = e.message;
      }
      equal(message.includes("values should differ"), true);
    });
  });
  describe("type differences", () => {
    test("passes for number vs string of same value", () => {
      // @ts-expect-error intentional type mismatch
      notStrictEquals(1, "1");
    });
    test("passes for boolean vs number", () => {
      // @ts-expect-error intentional type mismatch
      notStrictEquals(true, 1);
    });
    test("passes for empty string vs 0", () => {
      // @ts-expect-error intentional type mismatch
      notStrictEquals("", 0);
    });
  });
});
