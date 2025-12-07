import { test } from "node:test";
import { equal } from "@frostyeti/assert";
import { indexOf, indexOfFold } from "./index_of.ts";
import { toCharArray } from "./utils.ts";

test("slices::indexOf finds substring in ASCII string", () => {
    const value = toCharArray("hello world");
    const search = toCharArray("world");
    equal(6, indexOf(value, search));
});

test("slices::indexOf returns -1 when substring not found", () => {
    const value = toCharArray("hello world");
    const search = toCharArray("xyz");
    equal(-1, indexOf(value, search));
});

test("slices::indexOf handles empty search string", () => {
    const value = toCharArray("hello");
    const search: number[] = [];
    equal(-1, indexOf(value, search));
});

test("slices::indexOf respects start index", () => {
    const value = toCharArray("hello world world");
    const search = toCharArray("world");
    equal(12, indexOf(value, search, 7));
});

test("slices::indexOfFold finds case-insensitive substring", () => {
    const value = toCharArray("Hello World");
    const search = toCharArray("world");
    equal(6, indexOfFold(value, search));
});

test("slices::indexOfFold finds uppercase in lowercase string", () => {
    const value = toCharArray("hello world");
    const search = toCharArray("WORLD");
    equal(6, indexOfFold(value, search));
});

test("slices::indexOfFold handles non-ASCII characters", () => {
    const value = toCharArray("Hëllo Wörld");
    const search = toCharArray("wörld");
    equal(6, indexOfFold(value, search));
});

test("slices::indexOfFold returns -1 when substring not found", () => {
    const value = toCharArray("Hello World");
    const search = toCharArray("xyz");
    equal(-1, indexOfFold(value, search));
});

test("slices::indexOfFold respects start index", () => {
    const value = toCharArray("Hello World WORLD");
    const search = toCharArray("world");
    equal(12, indexOfFold(value, search, 7));
});
