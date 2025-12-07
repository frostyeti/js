import { test } from "node:test";
import { equal, ok, throws } from "@frostyeti/assert";
import { ReadOnlySlice, Slice } from "./slice.ts";

test("slices::Slice constructor creates slice with default offset", () => {
    const arr = [1, 2, 3, 4];
    const slice = new Slice(arr);
    equal(4, slice.length);
    equal(1, slice.at(0));
});

test("slices::Slice constructor creates slice with offset", () => {
    const arr = [1, 2, 3, 4];
    const slice = new Slice(arr, 1);
    equal(3, slice.length);
    equal(2, slice.at(0));
});

test("slices::Slice constructor throws on invalid offset", () => {
    const arr = [1, 2, 3];
    throws(() => new Slice(arr, -1));
    throws(() => new Slice(arr, 4));
});

test("slices::Slice.length gets correct length", () => {
    const slice = new Slice([1, 2, 3], 1);
    equal(2, slice.length);
});

test("slices::Slice.isEmpty returns true for empty slice", () => {
    const slice = new Slice([], 0);
    ok(slice.isEmpty);
});

test("slices::Slice.at gets element at index", () => {
    const slice = new Slice([1, 2, 3], 1);
    equal(2, slice.at(0));
    equal(3, slice.at(1));
});

test("slices::Slice.set updates element at index", () => {
    const arr = [1, 2, 3];
    const slice = new Slice(arr, 1);
    slice.set(0, 5);
    equal(5, arr[1]);
});

test("slices::Slice.update updates multiple elements", () => {
    const arr = [1, 2, 3, 4];
    const slice = new Slice(arr, 1);
    slice.update(0, [5, 6]);
    equal(5, arr[1]);
    equal(6, arr[2]);
});

test("slices::Slice.map transforms elements", () => {
    const slice = new Slice([1, 2, 3], 1);
    const mapped = slice.map((x) => x * 2);
    equal(4, mapped.at(0));
    equal(6, mapped.at(1));
});

test("slices::Slice.indexOf finds element index", () => {
    const slice = new Slice([1, 2, 3], 1);
    equal(0, slice.indexOf(2));
    equal(1, slice.indexOf(3));
    equal(-1, slice.indexOf(4));
});

test("slices::Slice.slice creates sub-slice", () => {
    const slice = new Slice([1, 2, 3, 4], 1);
    const subSlice = slice.slice(1);
    equal(1, subSlice.length);
    equal(3, subSlice.at(0));
});

test("slices::Slice.find finds matching element", () => {
    const slice = new Slice([1, 2, 3], 0);
    const found = slice.find((x) => x > 2);
    equal(3, found);
});

test("slices::Slice.findIndex finds matching element index", () => {
    const slice = new Slice([1, 2, 3], 0);
    const index = slice.findIndex((x) => x > 2);
    equal(2, index);
});

test("slices::Slice.includes checks element existence", () => {
    const slice = new Slice([1, 2, 3], 1);
    ok(slice.includes(2));
    ok(!slice.includes(1));
});

test("slices::ReadOnlySlice provides read-only view", () => {
    const arr = [1, 2, 3];
    const slice = new ReadOnlySlice(arr, 1);
    equal(2, slice.length);
    equal(2, slice.at(0));
    equal(3, slice.at(1));
});
