import { describe, test } from "node:test";
import { equal } from "./equal.js";
import { rejects } from "./rejects.js";
describe("assert::rejects", () => {
  describe("basic rejection", () => {
    test("passes when promise rejects", async () => {
      await rejects(() => Promise.reject(new Error("fail")));
    });
    test("passes when async function throws", async () => {
      await rejects(async () => {
        await Promise.resolve();
        throw new Error("async error");
      });
    });
    test("throws when promise resolves", async () => {
      let threw = false;
      try {
        await rejects(() => Promise.resolve("success"));
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
    test("throws when async function returns", async () => {
      let threw = false;
      try {
        await rejects(() => Promise.resolve("returned value"));
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
  });
  describe("error class matching", () => {
    test("passes when error matches expected class", async () => {
      await rejects(
        () => Promise.reject(new TypeError("type error")),
        TypeError,
      );
    });
    test("passes when error is subclass of expected", async () => {
      class CustomError extends Error {
      }
      await rejects(() => Promise.reject(new CustomError("custom")), Error);
    });
    test("throws when error class doesn't match", async () => {
      let threw = false;
      try {
        await rejects(
          () => Promise.reject(new TypeError("type error")),
          SyntaxError,
        );
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
    test("passes with RangeError", async () => {
      await rejects(
        () => Promise.reject(new RangeError("out of range")),
        RangeError,
      );
    });
    test("passes with ReferenceError", async () => {
      await rejects(
        () => Promise.reject(new ReferenceError("undefined variable")),
        ReferenceError,
      );
    });
  });
  describe("message matching", () => {
    test("passes when message includes expected string", async () => {
      await rejects(
        () => Promise.reject(new Error("validation failed")),
        Error,
        "validation",
      );
    });
    test("throws when message doesn't include expected string", async () => {
      let threw = false;
      try {
        await rejects(
          () => Promise.reject(new Error("validation failed")),
          Error,
          "not found",
        );
      } catch {
        threw = true;
      }
      equal(threw, true);
    });
    test("passes with partial message match", async () => {
      await rejects(
        () => Promise.reject(new Error("User not found in database")),
        Error,
        "not found",
      );
    });
  });
  describe("custom message", () => {
    test("throws with custom message when promise resolves", async () => {
      let message = "";
      try {
        await rejects(() => Promise.resolve("ok"), "should have rejected");
      } catch (e) {
        message = e.message;
      }
      equal(message.includes("should have rejected"), true);
    });
    test("includes custom message in error", async () => {
      let message = "";
      try {
        await rejects(
          () => Promise.reject(new TypeError("type")),
          SyntaxError,
          undefined,
          "custom assertion message",
        );
      } catch (e) {
        message = e.message;
      }
      equal(message.includes("custom assertion message"), true);
    });
  });
  describe("return value", () => {
    test("returns the rejected error", async () => {
      const error = new Error("test error");
      const result = await rejects(() => Promise.reject(error));
      equal(result, error);
    });
    test("returns typed error when class specified", async () => {
      const error = new TypeError("type error");
      const result = await rejects(() => Promise.reject(error), TypeError);
      equal(result instanceof TypeError, true);
      equal(result.message, "type error");
    });
  });
  describe("edge cases", () => {
    test("handles rejected primitive values", async () => {
      await rejects(() => Promise.reject("string error"));
      await rejects(() => Promise.reject(42));
      await rejects(() => Promise.reject(null));
    });
    test("handles undefined rejection", async () => {
      await rejects(() => Promise.reject(undefined));
    });
    test("handles delayed rejection", async () => {
      await rejects(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        throw new Error("delayed error");
      });
    });
    test("handles nested promises", async () => {
      await rejects(async () => {
        return await Promise.reject(new Error("nested"));
      });
    });
  });
});
