import { describe, test } from "node:test";
import { equal } from "./equal.ts";
import { unreachable } from "./unreachable.ts";
import { unimplemented } from "./unimplemented.ts";
import { fail } from "./fail.ts";
import { exists } from "./exists.ts";
import { AssertionError } from "./assertion-error.ts";

describe("assert::unreachable", () => {
    test("always throws", () => {
        let threw = false;
        try {
            unreachable();
        } catch (e) {
            threw = true;
            equal(e instanceof AssertionError, true);
            equal((e as Error).message, "Unreachable.");
        }
        equal(threw, true);
    });

    test("throws with custom message", () => {
        let message = "";
        try {
            unreachable("this code path should never execute");
        } catch (e) {
            message = (e as Error).message;
        }
        equal(message, "Unreachable: this code path should never execute");
    });

    test("can be used in switch statements", () => {
        const value = "a" as "a" | "b";
        let result = "";

        switch (value) {
            case "a":
                result = "got a";
                break;
            case "b":
                result = "got b";
                break;
                // In real code: default: unreachable();
        }

        equal(result, "got a");
    });
});

describe("assert::unimplemented", () => {
    test("always throws", () => {
        let threw = false;
        try {
            unimplemented();
        } catch (e) {
            threw = true;
            equal(e instanceof AssertionError, true);
            equal((e as Error).message, "Unimplemented.");
        }
        equal(threw, true);
    });

    test("throws with custom message", () => {
        let message = "";
        try {
            unimplemented("TODO: implement this feature");
        } catch (e) {
            message = (e as Error).message;
        }
        equal(message, "Unimplemented: TODO: implement this feature");
    });
});

describe("assert::fail", () => {
    test("always throws", () => {
        let threw = false;
        try {
            fail();
        } catch (e) {
            threw = true;
            equal(e instanceof AssertionError, true);
            equal((e as Error).message, "Failed assertion.");
        }
        equal(threw, true);
    });

    test("throws with custom message", () => {
        let message = "";
        try {
            fail("deliberately failed");
        } catch (e) {
            message = (e as Error).message;
        }
        equal(message, "Failed assertion: deliberately failed");
    });
});

describe("assert::exists", () => {
    test("passes when value exists", () => {
        exists("hello");
        exists(0);
        exists(false);
        exists("");
        exists([]);
        exists({});
    });

    test("throws when value is null", () => {
        let threw = false;
        try {
            exists(null);
        } catch (e) {
            threw = true;
            equal(e instanceof AssertionError, true);
        }
        equal(threw, true);
    });

    test("throws when value is undefined", () => {
        let threw = false;
        try {
            exists(undefined);
        } catch (e) {
            threw = true;
            equal(e instanceof AssertionError, true);
        }
        equal(threw, true);
    });

    test("throws with custom message", () => {
        let message = "";
        try {
            exists(null, "value should exist");
        } catch (e) {
            message = (e as Error).message;
        }
        equal(message.includes("value should exist"), true);
    });

    test("works with complex types", () => {
        exists(new Date());
        exists(() => {});
        exists(Symbol("test"));
        exists(new Map());
        exists(new Set());
    });

    test("works with numbers including 0 and NaN", () => {
        exists(0);
        exists(-0);
        exists(NaN);
        exists(Infinity);
        exists(-Infinity);
    });

    test("works with empty collections", () => {
        exists([]);
        exists({});
        exists(new Map());
        exists(new Set());
        exists("");
    });
});
