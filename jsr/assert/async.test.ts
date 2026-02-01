import { test, describe } from "node:test";
import { equal } from "./equal.ts";
import { rejects } from "./rejects.ts";
import { isError } from "./is-error.ts";
import { AssertionError } from "./assertion-error.ts";

describe("assert::rejects", () => {
    test("passes when promise rejects", async () => {
        await rejects(() => Promise.reject(new Error("test")));
    });

    test("passes when promise rejects with expected error type", async () => {
        await rejects(
            () => Promise.reject(new TypeError("test")),
            TypeError
        );
    });

    test("passes when promise rejects with matching message", async () => {
        await rejects(
            () => Promise.reject(new Error("test error message")),
            Error,
            "test error"
        );
    });

    test("throws when promise resolves", async () => {
        let threw = false;
        try {
            await rejects(() => Promise.resolve("success"));
        } catch (e) {
            threw = true;
            equal(e instanceof AssertionError, true);
        }
        equal(threw, true);
    });

    test("throws when error type doesn't match", async () => {
        let threw = false;
        try {
            await rejects(
                () => Promise.reject(new Error("test")),
                TypeError
            );
        } catch (e) {
            threw = true;
            equal(e instanceof AssertionError, true);
        }
        equal(threw, true);
    });

    test("throws with custom message", async () => {
        let message = "";
        try {
            await rejects(
                () => Promise.resolve(),
                "should have rejected"
            );
        } catch (e) {
            message = (e as Error).message;
        }
        equal(message.includes("should have rejected"), true);
    });

    test("returns the error when successful", async () => {
        const error = await rejects(
            () => Promise.reject(new Error("test message"))
        );
        equal(error instanceof Error, true);
    });

    test("works with async functions", async () => {
        await rejects(async () => {
            throw new Error("async error");
        });
    });

    test("works with Error subclasses", async () => {
        class CustomError extends Error {
            constructor(message: string) {
                super(message);
                this.name = "CustomError";
            }
        }
        
        await rejects(
            () => Promise.reject(new CustomError("custom")),
            CustomError
        );
    });
});

describe("assert::isError", () => {
    test("passes for Error instances", () => {
        isError(new Error("test"));
    });

    test("passes for TypeError instances", () => {
        isError(new TypeError("test"));
        isError(new TypeError("test"), TypeError);
    });

    test("passes for custom Error subclasses", () => {
        class CustomError extends Error {}
        isError(new CustomError("test"));
        isError(new CustomError("test"), CustomError);
    });

    test("passes when message includes expected string", () => {
        isError(new Error("hello world"), Error, "world");
    });

    test("passes when message matches RegExp", () => {
        isError(new Error("error code: 404"), Error, /code: \d+/);
    });

    test("throws for non-Error values", () => {
        let threw = false;
        try {
            isError("not an error");
        } catch (e) {
            threw = true;
            equal(e instanceof AssertionError, true);
        }
        equal(threw, true);
    });

    test("throws for wrong error type", () => {
        let threw = false;
        try {
            isError(new Error("test"), TypeError);
        } catch {
            threw = true;
        }
        equal(threw, true);
    });

    test("throws when message doesn't match", () => {
        let threw = false;
        try {
            isError(new Error("hello"), Error, "world");
        } catch {
            threw = true;
        }
        equal(threw, true);
    });

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

    test("throws for plain objects", () => {
        let threw = false;
        try {
            isError({ message: "fake error" });
        } catch {
            threw = true;
        }
        equal(threw, true);
    });
});
