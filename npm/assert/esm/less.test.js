import { describe, test } from "node:test";
import { equal } from "./equal.js";
import { less } from "./less.js";
describe("assert::less", () => {
  describe("numbers", () => {
    test("passes when actual is less", () => {
      less(3, 5);
      less(99, 100);
      less(-1, 0);
      less(-2, -1);
    });
    test("passes for floating point", () => {
      less(3.14, 3.15);
      less(0.1, 0.2);
      less(1.0, 1.0001);
    });
    test("passes for negative numbers", () => {
      less(-2, -1);
      less(-100, -10);
      less(-1, 0);
    });
    test("throws when actual equals expected", () => {
      let threw = false;
      try {
        less(5, 5);
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
    test("throws when actual is greater", () => {
      let threw = false;
      try {
        less(5, 3);
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
    test("passes for -Infinity", () => {
      less(-Infinity, 0);
      less(-Infinity, Infinity);
    });
    test("throws for Infinity vs number", () => {
      let threw = false;
      try {
        less(Infinity, 1000000);
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
  });
  describe("bigints", () => {
    test("passes when actual is less", () => {
      less(3n, 5n);
      less(999999999999n, 1000000000000n);
      less(-1n, 0n);
    });
    test("throws when actual equals expected", () => {
      let threw = false;
      try {
        less(5n, 5n);
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
    test("throws when actual is greater", () => {
      let threw = false;
      try {
        less(5n, 3n);
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
  });
  describe("strings", () => {
    test("passes for lexicographically lesser strings", () => {
      less("a", "b");
      less("apple", "banana");
      less("a", "z");
    });
    test("throws for lexicographically greater strings", () => {
      let threw = false;
      try {
        less("b", "a");
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
    test("throws for equal strings", () => {
      let threw = false;
      try {
        less("hello", "hello");
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
    test("passes for empty string vs non-empty", () => {
      less("", "a");
    });
  });
  describe("dates", () => {
    test("passes when actual date is earlier", () => {
      less(new Date("2024-01-01"), new Date("2024-01-02"));
      less(new Date("2024-12-31"), new Date("2025-01-01"));
    });
    test("throws when actual date is later", () => {
      let threw = false;
      try {
        less(new Date("2024-01-02"), new Date("2024-01-01"));
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
    test("throws when dates are equal", () => {
      let threw = false;
      try {
        less(new Date("2024-01-01"), new Date("2024-01-01"));
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
        less(5, 3, "value should be less");
      } catch (e) {
        message = e.message;
      }
      equal(message.includes("value should be less"), true);
    });
  });
});
