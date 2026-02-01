import { describe, test } from "node:test";
import { equal } from "./equal.js";
import { greater } from "./greater.js";
import { greaterOrEqual } from "./greater-or-equal.js";
import { less } from "./less.js";
import { lessOrEqual } from "./less-or-equal.js";
import { AssertionError } from "./assertion-error.js";
describe("assert::greater", () => {
  test("passes when actual is greater than expected", () => {
    greater(2, 1);
    greater(100, 99);
    greater(0, -1);
    greater(-1, -2);
  });
  test("works with bigints", () => {
    greater(2n, 1n);
    greater(100n, 99n);
    greater(0n, -1n);
  });
  test("works with floating point", () => {
    greater(1.1, 1.0);
    greater(0.001, 0.0001);
    greater(-0.5, -1);
  });
  test("throws when actual equals expected", () => {
    let threw = false;
    try {
      greater(1, 1);
    } catch (e) {
      threw = true;
      equal(e instanceof AssertionError, true);
    }
    equal(threw, true);
  });
  test("throws when actual is less than expected", () => {
    let threw = false;
    try {
      greater(1, 2);
    } catch (e) {
      threw = true;
      equal(e instanceof AssertionError, true);
    }
    equal(threw, true);
  });
  test("throws with custom message", () => {
    let message = "";
    try {
      greater(1, 2, "one is not greater than two");
    } catch (e) {
      message = e.message;
    }
    equal(message.includes("one is not greater than two"), true);
  });
  test("works with strings", () => {
    greater("b", "a");
    greater("z", "a");
    greater("aa", "a");
  });
  test("works with dates", () => {
    const later = new Date(2025, 1, 1);
    const earlier = new Date(2024, 1, 1);
    greater(later.getTime(), earlier.getTime());
  });
});
describe("assert::greaterOrEqual", () => {
  test("passes when actual is greater than expected", () => {
    greaterOrEqual(2, 1);
    greaterOrEqual(100, 99);
    greaterOrEqual(0, -1);
  });
  test("passes when actual equals expected", () => {
    greaterOrEqual(1, 1);
    greaterOrEqual(0, 0);
    greaterOrEqual(-5, -5);
  });
  test("works with bigints", () => {
    greaterOrEqual(2n, 1n);
    greaterOrEqual(1n, 1n);
  });
  test("works with floating point", () => {
    greaterOrEqual(1.1, 1.0);
    greaterOrEqual(1.0, 1.0);
  });
  test("throws when actual is less than expected", () => {
    let threw = false;
    try {
      greaterOrEqual(1, 2);
    } catch (e) {
      threw = true;
      equal(e instanceof AssertionError, true);
    }
    equal(threw, true);
  });
  test("throws with custom message", () => {
    let message = "";
    try {
      greaterOrEqual(0, 1, "zero is not >= one");
    } catch (e) {
      message = e.message;
    }
    equal(message.includes("zero is not >= one"), true);
  });
});
describe("assert::less", () => {
  test("passes when actual is less than expected", () => {
    less(1, 2);
    less(99, 100);
    less(-1, 0);
    less(-2, -1);
  });
  test("works with bigints", () => {
    less(1n, 2n);
    less(-1n, 0n);
  });
  test("works with floating point", () => {
    less(1.0, 1.1);
    less(0.0001, 0.001);
    less(-1, -0.5);
  });
  test("throws when actual equals expected", () => {
    let threw = false;
    try {
      less(1, 1);
    } catch (e) {
      threw = true;
      equal(e instanceof AssertionError, true);
    }
    equal(threw, true);
  });
  test("throws when actual is greater than expected", () => {
    let threw = false;
    try {
      less(2, 1);
    } catch (e) {
      threw = true;
      equal(e instanceof AssertionError, true);
    }
    equal(threw, true);
  });
  test("throws with custom message", () => {
    let message = "";
    try {
      less(2, 1, "two is not less than one");
    } catch (e) {
      message = e.message;
    }
    equal(message.includes("two is not less than one"), true);
  });
  test("works with strings", () => {
    less("a", "b");
    less("a", "z");
    less("a", "aa");
  });
});
describe("assert::lessOrEqual", () => {
  test("passes when actual is less than expected", () => {
    lessOrEqual(1, 2);
    lessOrEqual(99, 100);
    lessOrEqual(-1, 0);
  });
  test("passes when actual equals expected", () => {
    lessOrEqual(1, 1);
    lessOrEqual(0, 0);
    lessOrEqual(-5, -5);
  });
  test("works with bigints", () => {
    lessOrEqual(1n, 2n);
    lessOrEqual(1n, 1n);
  });
  test("works with floating point", () => {
    lessOrEqual(1.0, 1.1);
    lessOrEqual(1.0, 1.0);
  });
  test("throws when actual is greater than expected", () => {
    let threw = false;
    try {
      lessOrEqual(2, 1);
    } catch (e) {
      threw = true;
      equal(e instanceof AssertionError, true);
    }
    equal(threw, true);
  });
  test("throws with custom message", () => {
    let message = "";
    try {
      lessOrEqual(1, 0, "one is not <= zero");
    } catch (e) {
      message = e.message;
    }
    equal(message.includes("one is not <= zero"), true);
  });
});
