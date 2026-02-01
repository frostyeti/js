import { describe, test } from "node:test";
import { equal } from "./equal.js";
import { strictEquals } from "./strict-equal.js";
describe("assert::strictEquals", () => {
  describe("primitives", () => {
    test("passes for identical numbers", () => {
      strictEquals(1, 1);
      strictEquals(0, 0);
      strictEquals(-1, -1);
      strictEquals(3.14159, 3.14159);
      strictEquals(Infinity, Infinity);
      strictEquals(-Infinity, -Infinity);
    });
    test("passes for identical strings", () => {
      strictEquals("hello", "hello");
      strictEquals("", "");
      strictEquals("unicode: 日本語", "unicode: 日本語");
    });
    test("passes for identical booleans", () => {
      strictEquals(true, true);
      strictEquals(false, false);
    });
    test("passes for null", () => {
      strictEquals(null, null);
    });
    test("passes for undefined", () => {
      strictEquals(undefined, undefined);
    });
    test("passes for NaN (Object.is behavior)", () => {
      strictEquals(NaN, NaN);
    });
    test("passes for identical bigints", () => {
      strictEquals(BigInt(123), BigInt(123));
      strictEquals(0n, 0n);
    });
  });
  describe("reference equality", () => {
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
    test("passes for same symbol", () => {
      const sym = Symbol("test");
      strictEquals(sym, sym);
    });
    test("throws for different object references", () => {
      let threw = false;
      try {
        strictEquals({}, {});
      } catch {
        threw = true;
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
    test("throws for different function references", () => {
      let threw = false;
      try {
        strictEquals(() => {}, () => {});
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
  });
  describe("special number cases", () => {
    test("throws for 0 and -0 (Object.is behavior)", () => {
      let threw = false;
      try {
        strictEquals(0, -0);
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
    test("throws for -0 and 0", () => {
      let threw = false;
      try {
        strictEquals(-0, 0);
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
  });
  describe("type coercion prevention", () => {
    test("throws for null vs undefined", () => {
      let threw = false;
      try {
        strictEquals(null, undefined);
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
    test("throws for number vs string", () => {
      let threw = false;
      try {
        strictEquals(1, "1");
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
    test("throws for boolean vs number", () => {
      let threw = false;
      try {
        strictEquals(true, 1);
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
        strictEquals(1, 2, "values should be equal");
      } catch (e) {
        message = e.message;
      }
      equal(message.includes("values should be equal"), true);
    });
  });
  describe("complex objects", () => {
    test("passes for same Date reference", () => {
      const date = new Date();
      strictEquals(date, date);
    });
    test("throws for different Date objects with same value", () => {
      let threw = false;
      try {
        strictEquals(new Date("2024-01-01"), new Date("2024-01-01"));
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
    test("passes for same Map reference", () => {
      const map = new Map();
      strictEquals(map, map);
    });
    test("passes for same Set reference", () => {
      const set = new Set();
      strictEquals(set, set);
    });
  });
});
