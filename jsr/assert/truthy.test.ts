import { test } from "node:test";
import { truthy } from "./truthy.ts";

test("assert::truthy", () => {
    let thrown = false;
    try {
        truthy(false, "true is false");
    } catch (e) {
        thrown = true;
        if (!(e instanceof Error)) {
            throw new Error("Expected an error to be thrown");
        }

        if (e.message !== "true is false") {
            throw new Error("Expected the error message to be 'true is false'");
        }
    }

    if (!thrown) {
        throw new Error("assert(false) should throw an error");
    }

    truthy(true, "true is true");

    truthy(true);
    truthy(1);
    truthy("1");

    function throws(fn: () => void, msg: string) {
        let threw = false;
        try {
            fn();
        } catch {
            threw = true;
        }

        if (!threw) {
            throw new Error(msg ?? "Expected function to throw");
        }
    }

    throws(() => truthy(false), "Expected value to be truthy");
    throws(() => truthy(0), "Expected value to be truthy");
    throws(() => truthy(""), "Expected value to be truthy");
    throws(() => truthy(null), "Expected value to be truthy");
    throws(() => truthy(undefined), "Expected value to be truthy");
});
