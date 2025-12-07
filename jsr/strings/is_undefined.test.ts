import { test } from "node:test";
import { nope, ok } from "@frostyeti/assert";
import { isUndefined } from "./is_undefined.ts";

test("strings::isUndefined returns true for undefined", () => {
    const s: string | undefined = undefined;
    ok(isUndefined(s));
});

test("strings::isUndefined returns false for empty string", () => {
    const s = "";
    nope(isUndefined(s));
});

test("strings::isUndefined returns false for non-empty string", () => {
    const s = "test";
    nope(isUndefined(s));
});
