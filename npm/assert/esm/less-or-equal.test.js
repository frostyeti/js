import { describe, test } from "node:test";
import { equal } from "./equal.js";
import { lessOrEqual } from "./less-or-equal.js";
describe("assert::lessOrEqual", () => {
  describe("numbers", () => {
    test("passes when actual is less", () => {
      lessOrEqual(3, 5);
      lessOrEqual(99, 100);
      lessOrEqual(-1, 0);
    });
    test("passes when actual equals expected", () => {
      lessOrEqual(5, 5);
      lessOrEqual(0, 0);
      lessOrEqual(-1, -1);
    });
    test("passes for floating point", () => {
      lessOrEqual(3.14, 3.15);
      lessOrEqual(3.14, 3.14);
    });
    test("passes for negative numbers", () => {
      lessOrEqual(-2, -1);
      lessOrEqual(-1, -1);
    });
    test("throws when actual is greater", () => {
      let threw = false;
      try {
        lessOrEqual(5, 3);
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
    test("passes for -Infinity", () => {
      lessOrEqual(-Infinity, -Infinity);
      lessOrEqual(-Infinity, 0);
    });
    test("passes for Infinity equality", () => {
      lessOrEqual(Infinity, Infinity);
    });
  });
  describe("bigints", () => {
    test("passes when actual is less", () => {
      lessOrEqual(3n, 5n);
      lessOrEqual(999999999999n, 1000000000000n);
    });
    test("passes when actual equals expected", () => {
      lessOrEqual(5n, 5n);
      lessOrEqual(0n, 0n);
    });
    test("throws when actual is greater", () => {
      let threw = false;
      try {
        lessOrEqual(5n, 3n);
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
  });
  describe("strings", () => {
    test("passes for lexicographically lesser strings", () => {
      lessOrEqual("a", "b");
      lessOrEqual("apple", "banana");
    });
    test("passes for equal strings", () => {
      lessOrEqual("hello", "hello");
      lessOrEqual("", "");
    });
    test("throws for lexicographically greater strings", () => {
      let threw = false;
      try {
        lessOrEqual("b", "a");
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
  });
  describe("dates", () => {
    test("passes when actual date is earlier", () => {
      lessOrEqual(new Date("2024-01-01"), new Date("2024-01-02"));
    });
    test("passes when dates are equal", () => {
      lessOrEqual(new Date("2024-01-01"), new Date("2024-01-01"));
    });
    test("throws when actual date is later", () => {
      let threw = false;
      try {
        lessOrEqual(new Date("2024-01-02"), new Date("2024-01-01"));
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
        lessOrEqual(5, 3, "value should be <= 3");
      } catch (e) {
        message = e.message;
      }
      equal(message.includes("value should be <= 3"), true);
    });
  });
  describe("edge cases", () => {
    test("passes for 0 and -0", () => {
      lessOrEqual(0, -0);
      lessOrEqual(-0, 0);
    });
  });
});
