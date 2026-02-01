import { describe, test } from "node:test";
import { equal } from "./equal.ts";
import { isError } from "./is-error.ts";

describe("assert::isError", () => {
    describe("basic Error validation", () => {
        test("passes for Error instances", () => {
            isError(new Error("test"));
        });

        test("passes for TypeError instances", () => {
            isError(new TypeError("type error"));
        });

        test("passes for SyntaxError instances", () => {
            isError(new SyntaxError("syntax error"));
        });

        test("passes for RangeError instances", () => {
            isError(new RangeError("range error"));
        });

        test("passes for ReferenceError instances", () => {
            isError(new ReferenceError("reference error"));
        });

        test("passes for URIError instances", () => {
            isError(new URIError("uri error"));
        });

        test("passes for EvalError instances", () => {
            isError(new EvalError("eval error"));
        });
    });

    describe("throws for non-Error values", () => {
        test("throws for null", () => {
            let threw = false;
            try {
                isError(null);
            } catch {
                threw = true;
            }
            equal(threw, true);
        });

        test("throws for undefined", () => {
            let threw = false;
            try {
                isError(undefined);
            } catch {
                threw = true;
            }
            equal(threw, true);
        });

        test("throws for string", () => {
            let threw = false;
            try {
                isError("error message");
            } catch {
                threw = true;
            }
            equal(threw, true);
        });

        test("throws for number", () => {
            let threw = false;
            try {
                isError(404);
            } catch {
                threw = true;
            }
            equal(threw, true);
        });

        test("throws for plain object", () => {
            let threw = false;
            try {
                isError({ message: "fake error" });
            } catch {
                threw = true;
            }
            equal(threw, true);
        });

        test("throws for object with error-like properties", () => {
            let threw = false;
            try {
                isError({ message: "error", name: "Error", stack: "" });
            } catch {
                threw = true;
            }
            equal(threw, true);
        });
    });

    describe("error class matching", () => {
        test("passes when error matches expected class", () => {
            isError(new TypeError("test"), TypeError);
        });

        test("passes when error is subclass of expected", () => {
            isError(new TypeError("test"), Error);
        });

        test("throws when error class doesn't match", () => {
            let threw = false;
            try {
                isError(new TypeError("test"), SyntaxError);
            } catch {
                threw = true;
            }
            equal(threw, true);
        });

        test("throws for Error when expecting TypeError", () => {
            let threw = false;
            try {
                isError(new Error("test"), TypeError);
            } catch {
                threw = true;
            }
            equal(threw, true);
        });
    });

    describe("message matching with string", () => {
        test("passes when message includes expected string", () => {
            isError(new Error("validation failed"), Error, "validation");
        });

        test("passes when message equals expected string", () => {
            isError(new Error("exact match"), Error, "exact match");
        });

        test("throws when message doesn't include string", () => {
            let threw = false;
            try {
                isError(new Error("something else"), Error, "validation");
            } catch {
                threw = true;
            }
            equal(threw, true);
        });

        test("passes with partial message match", () => {
            isError(new Error("User not found in database"), Error, "not found");
        });
    });

    describe("message matching with RegExp", () => {
        test("passes when message matches pattern", () => {
            isError(new Error("Error code: 123"), Error, /code: \d+/);
        });

        test("passes with case-insensitive pattern", () => {
            isError(new Error("VALIDATION ERROR"), Error, /validation/i);
        });

        test("throws when message doesn't match pattern", () => {
            let threw = false;
            try {
                isError(new Error("no numbers here"), Error, /\d+/);
            } catch {
                threw = true;
            }
            equal(threw, true);
        });
    });

    describe("custom message", () => {
        test("includes custom message for non-Error", () => {
            let message = "";
            try {
                isError("not an error", undefined, undefined, "expected Error instance");
            } catch (e) {
                message = (e as Error).message;
            }
            equal(message.includes("expected Error instance"), true);
        });

        test("includes custom message for class mismatch", () => {
            let message = "";
            try {
                isError(new Error("test"), TypeError, undefined, "expected TypeError");
            } catch (e) {
                message = (e as Error).message;
            }
            equal(message.includes("expected TypeError"), true);
        });
    });

    describe("custom Error classes", () => {
        test("passes for custom Error subclass", () => {
            class CustomError extends Error {
                constructor(message: string) {
                    super(message);
                    this.name = "CustomError";
                }
            }
            isError(new CustomError("custom"), CustomError);
        });

        test("passes when custom error extends expected class", () => {
            class CustomError extends TypeError {}
            isError(new CustomError("custom"), TypeError);
            isError(new CustomError("custom"), Error);
        });

        test("throws for sibling error classes", () => {
            class CustomError1 extends Error {}
            class CustomError2 extends Error {}
            let threw = false;
            try {
                isError(new CustomError1("test"), CustomError2);
            } catch {
                threw = true;
            }
            equal(threw, true);
        });
    });

    describe("combined class and message matching", () => {
        test("passes when both class and message match", () => {
            isError(new TypeError("invalid type"), TypeError, "invalid");
        });

        test("throws when class matches but message doesn't", () => {
            let threw = false;
            try {
                isError(new TypeError("invalid type"), TypeError, "wrong");
            } catch {
                threw = true;
            }
            equal(threw, true);
        });

        test("throws when message matches but class doesn't", () => {
            let threw = false;
            try {
                isError(new TypeError("invalid type"), SyntaxError, "invalid");
            } catch {
                threw = true;
            }
            equal(threw, true);
        });
    });

    describe("edge cases", () => {
        test("passes for Error with empty message", () => {
            isError(new Error(""));
        });

        test("handles Error with no message", () => {
            isError(new Error());
        });

        test("passes when expecting empty message string", () => {
            isError(new Error("contains text"), Error, "");
        });
    });
});
