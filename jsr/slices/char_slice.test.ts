import { test } from "node:test";
import { equal, ok, throws } from "@frostyeti/assert";
import { CharSlice, ReadOnlyCharSlice } from "./char_slice.ts";

test("slices::ReadOnlyCharSlice.fromString creates slice from string", () => {
    const s = ReadOnlyCharSlice.fromString("hello");
    equal(5, s.length);
    equal("hello", s.toString());
});

test("slices::ReadOnlyCharSlice.length gets correct length", () => {
    const s = ReadOnlyCharSlice.fromString("hello");
    equal(5, s.length);
});

test("slices::ReadOnlyCharSlice.isEmpty returns true for empty slice", () => {
    const s = ReadOnlyCharSlice.fromString("");
    ok(s.isEmpty);
});

test("slices::ReadOnlyCharSlice.at gets correct character", () => {
    const s = ReadOnlyCharSlice.fromString("hello");
    equal("h".codePointAt(0), s.at(0));
    equal("e".codePointAt(0), s.at(1));
});

test("slices::ReadOnlyCharSlice.at throws on invalid index", () => {
    const s = ReadOnlyCharSlice.fromString("hello");
    throws(() => s.at(-1));
    throws(() => s.at(5));
});

test("slices::ReadOnlyCharSlice.slice creates correct subslice", () => {
    const s = ReadOnlyCharSlice.fromString("hello");
    const sub = s.slice(1, 4);
    equal("ell", sub.toString());
});

test("slices::ReadOnlyCharSlice.toLower converts to lowercase", () => {
    const s = ReadOnlyCharSlice.fromString("HELLO");
    equal("hello", s.toLower.toString());
});

test("slices::ReadOnlyCharSlice.toUpper converts to uppercase", () => {
    const s = ReadOnlyCharSlice.fromString("hello");
    equal("HELLO", s.toUpper.toString());
});

test("slices::ReadOnlyCharSlice.trim removes whitespace", () => {
    const s = ReadOnlyCharSlice.fromString("  hello  ");
    equal("hello", s.trim().toString());
});

test("slices::ReadOnlyCharSlice.trim characters", () => {
    const s = ReadOnlyCharSlice.fromString("[[[hello  ");
    equal("hello  ", s.trim("[").toString());
});

test("slices::CharSlice.fromString creates mutable slice", () => {
    const s = CharSlice.fromString("hello");
    s.set(0, "H".codePointAt(0)!);
    equal("Hello", s.toString());
});

test("slices::CharSlice.set throws on invalid index", () => {
    const s = CharSlice.fromString("hello");
    throws(() => s.set(-1, "x".codePointAt(0)!));
    throws(() => s.set(5, "x".codePointAt(0)!));
});

test("slices::CharSlice.replace updates slice content", () => {
    const s = CharSlice.fromString("hello");
    s.replace(0, "j");
    equal("jello", s.toString());
});

test("slices::CharSlice.captialize capitalizes first letter", () => {
    const s = CharSlice.fromString("hello");
    s.slice(1).captialize();
    equal("hEllo", s.toString());
});

test("slices::CharSlice.findIndex finds matching element", () => {
    const s = CharSlice.fromString("hello");
    const index = s.findIndex((c) => c === "l".codePointAt(0));
    equal(2, index);
});

test("slices::CharSlice.includes finds substring", () => {
    const s = CharSlice.fromString("hello");
    ok(s.includes(new Uint32Array([..."el"].map((c) => c.codePointAt(0)!))));
});

test("slices::CharSlice.indexOf finds first occurrence", () => {
    const s = CharSlice.fromString("hello");
    equal(2, s.indexOf(new Uint32Array([..."l"].map((c) => c.codePointAt(0)!))));
});

test("slices::CharSlice.lastIndexOf finds last occurrence", () => {
    const s = CharSlice.fromString("hello");
    equal(s.lastIndexOf("l"), 3);
});
