// Copyright 2018-2025 the Deno authors. MIT license.

import { equal, throws } from "@frostyeti/assert";
import { test } from "node:test";
import { _format, assertArg } from "./format.ts";

test("path::_format()", () => {
    equal(_format("", {}), "");
    equal(_format("", { root: "/" }), "/");
    equal(_format("", { dir: "/foo/bar" }), "/foo/bar");
    equal(_format("", { base: "baz" }), "baz");
    equal(_format("", { name: "baz" }), "baz");
    equal(_format("", { ext: ".js" }), ".js");
    equal(_format("", { name: "baz", ext: ".js" }), "baz.js");
    equal(_format("", { root: "/", base: "baz" }), "/baz");
    equal(_format("", { root: "/", name: "baz" }), "/baz");
    equal(_format("", { root: "/", ext: ".js" }), "/.js");
    equal(_format("", { root: "/", name: "baz", ext: ".js" }), "/baz.js");
    equal(_format("/", { dir: "/foo/bar", base: "baz" }), "/foo/bar/baz");
    equal(
        _format("/", { dir: "/foo/bar", base: "baz", ext: ".js" }),
        "/foo/bar/baz",
    );
    equal(
        _format("/", { dir: "/foo/bar", name: "baz", ext: ".js" }),
        "/foo/bar/baz.js",
    );
});

test("path::assertArg()", () => {
    equal(assertArg({}), undefined);
    equal(assertArg({ root: "/" }), undefined);
    equal(assertArg({ dir: "/foo/bar" }), undefined);
});

test("path::assertArg() throws", () => {
    throws(
        // @ts-expect-error - testing invalid input
        () => assertArg(null),
        TypeError,
        `The "pathObject" argument must be of type Object, received type "object"`,
    );
    throws(
        // @ts-expect-error - testing invalid input
        () => assertArg(undefined),
        TypeError,
        `The "pathObject" argument must be of type Object, received type "undefined"`,
    );
    throws(
        // @ts-expect-error - testing invalid input
        () => assertArg(""),
        TypeError,
        `The "pathObject" argument must be of type Object, received type "string"`,
    );
});
