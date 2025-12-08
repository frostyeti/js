import { test } from "node:test";
import { equal } from "@frostyeti/assert";
import { join, unixJoin, windowsJoin } from "./join.ts";

test("args::windowsJoin joins simple args without special chars", () => {
    equal(windowsJoin(["foo", "bar", "baz"]), "foo bar baz");
});

test("args::windowsJoin joins args with spaces", () => {
    equal(windowsJoin(["foo", "bar baz"]), 'foo "bar baz"');
});
test("args::windowsJoin joins args with double quotes", () => {
    equal(windowsJoin(["foo", 'bar"baz']), 'foo "bar\\"baz"');
});

test("args::windowsJoin joins args with backslashes", () => {
    equal(windowsJoin(["foo", "bar\\baz"]), "foo bar\\baz");
});

test("args::windowsJoin joins args with multiple backslashes before quote", () => {
    equal(windowsJoin(["foo", 'bar\\\\\\"baz']), 'foo "bar\\\\\\\\\\\\\\"baz"');
});

test("args::unixJoin joins simple args without special chars", () => {
    equal(unixJoin(["foo", "bar", "baz"]), "foo bar baz");
});

test("args::unixJoin joins args with spaces", () => {
    equal(unixJoin(["foo", "bar baz"]), 'foo "bar baz"');
});

test("args::unixJoin joins args with double quotes", () => {
    equal(unixJoin(["foo", 'bar"baz']), 'foo "bar\\"baz"');
});

test("args::unixJoin joins args with dollar sign and backtick", () => {
    equal(unixJoin(["foo", "bar$`baz"]), 'foo "bar\\$\\`baz"');
});

test("args::unixJoin joins args with backslashes", () => {
    equal(unixJoin(["foo", "bar\\baz"]), 'foo "bar\\\\baz"');
});

test("args::join joins simple args without special chars", () => {
    equal(join(["foo", "bar", "baz"]), "foo bar baz");
});

test("args::join joins args with spaces", () => {
    equal(join(["foo", "bar baz"]), 'foo "bar baz"');
});
