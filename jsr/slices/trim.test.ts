import { test } from "node:test";
import { equal, throws } from "@frostyeti/assert";
import {
    trim,
    trimChar,
    trimEnd,
    trimEndChar,
    trimEndSlice,
    trimEndSpace,
    trimSlice,
    trimSpace,
    trimStart,
    trimStartChar,
    trimStartSlice,
    trimStartSpace,
} from "./trim.ts";

test("trim::trimEnd removes trailing whitespace", () => {
    const input = new Uint32Array([65, 66, 32, 32]); // "AB  "
    const expected = new Uint32Array([65, 66]); // "AB"
    const result = trimEnd(input);
    equal(expected, result);
});

test("trim::trimEnd removes trailing whitespace using string", () => {
    const input = "AB  ";
    const expected = new Uint32Array([65, 66]); // "AB"
    const result = trimEnd(input);
    equal(expected, result);
});

test("trim::trimEndSpace removes trailing whitespace", () => {
    const input = new Uint32Array([65, 66, 32, 32]); // "AB  "
    const expected = new Uint32Array([65, 66]); // "AB"
    const result = trimEndSpace(input);
    equal(expected, result);
});

test("trim::trimEndSpace removes trailing whitespace using string", () => {
    const expected = new Uint32Array([65, 66]); // "AB"
    const result = trimEndSpace("AB ");
    equal(expected, result);
});

test("trim::trimEndChar removes trailing character", () => {
    const input = new Uint32Array([65, 66, 46, 46]); // "AB.."
    const result = trimEndChar(input, 46); // 46 is '.'
    const expected = new Uint32Array([65, 66]); // "AB"
    equal(expected, result);
});

test("trim::trimEndSlice removes trailing characters using string", () => {
    const input = new Uint32Array([65, 66, 46, 33]); // "AB.!"
    const suffix = new Uint32Array([46, 33]); // ".!"
    const result = trimEndSlice(input, suffix);
    const expected = new Uint32Array([65, 66]); // "AB"
    equal(expected, result);
});

test("trim::trimEndSlice removes trailing characters", () => {
    const suffix = new Uint32Array([46, 33]); // ".!"
    const result = trimEndSlice("AB.!", suffix);
    const expected = new Uint32Array([65, 66]); // "AB"
    equal(expected, result);
});

test("trim::trimStart removes leading whitespace", () => {
    const input = new Uint32Array([32, 32, 65, 66]); // "  AB"
    const result = trimStart(input);
    const expected = new Uint32Array([65, 66]); // "AB"
    equal(expected, result);
});

test("trim::trimStart removes leading whitespace using string", () => {
    const input = "  AB";
    const result = trimStart(input);
    const expected = new Uint32Array([65, 66]); // "AB"
    equal(expected, result);
});

test("trim::trimStartSpace removes leading whitespace", () => {
    const input = new Uint32Array([32, 32, 65, 66]); // "  AB"
    const result = trimStartSpace(input);
    const expected = new Uint32Array([65, 66]); // "AB"
    equal(expected, result);
});

test("trim::trimStartSpace removes leading whitespace using string", () => {
    const input = "  AB";
    const result = trimStartSpace(input);
    const expected = new Uint32Array([65, 66]); // "AB"
    equal(expected, result);
});

test("trim::trimStartChar removes leading character", () => {
    const input = new Uint32Array([46, 46, 65, 66]); // "..AB"
    const result = trimStartChar(input, 46); // 46 is '.'
    const expected = new Uint32Array([65, 66]); // "AB"
    equal(expected, result);
});

test("trim::trimStartChar removes leading character using string", () => {
    const input = "..AB";
    const result = trimStartChar(input, 46); // 46 is '.'
    const expected = new Uint32Array([65, 66]); // "AB"
    equal(expected, result);
});

test("trim::trimStartChar throws on invalid code point", () => {
    const input = new Uint32Array([65, 66]);
    throws(() => trimStartChar(input, -1));
    throws(() => trimStartChar(input, 0x110000));
});

test("trim::trimStartSlice removes leading characters", () => {
    const input = new Uint32Array([46, 33, 65, 66]); // ".!AB"
    const prefix = new Uint32Array([46, 33]); // ".!"
    const result = trimStartSlice(input, prefix);
    const expected = new Uint32Array([65, 66]); // "AB"
    equal(expected, result);
});

test("trim::trimSpace removes leading and trailing whitespace", () => {
    const input = new Uint32Array([32, 32, 65, 66, 32, 32]); // "  AB  "
    const result = trimSpace(input);
    const expected = new Uint32Array([65, 66]); // "AB"
    equal(expected, result);
});

test("trim::trimChar removes leading and trailing character", () => {
    const input = new Uint32Array([46, 65, 66, 46]); // ".AB."
    const result = trimChar(input, 46); // 46 is '.'
    const expected = new Uint32Array([65, 66]); // "AB"
    equal(expected, result);
});

test("trim::trimSlice removes leading and trailing characters", () => {
    const input = new Uint32Array([46, 33, 65, 66, 33, 46]); // ".!AB!."
    const chars = new Uint32Array([46, 33]); // ".!"
    const result = trimSlice(input, chars);
    const expected = new Uint32Array([65, 66]); // "AB"
    equal(expected, result);
});

test("trim::trim removes whitespace by default", () => {
    const input = new Uint32Array([32, 32, 65, 66, 32, 32]); // "  AB  "
    const result = trim(input);
    const expected = new Uint32Array([65, 66]); // "AB"
    equal(expected, result);
});

test("trim::trim removes specified single character", () => {
    const input = new Uint32Array([46, 65, 66, 46]); // ".AB."
    const chars = new Uint32Array([46]); // "."
    const result = trim(input, chars);
    const expected = new Uint32Array([65, 66]); // "AB"
    equal(expected, result);
});

test("trim::trim removes specified characters", () => {
    const input = new Uint32Array([46, 33, 65, 66, 33, 46]); // ".!AB!."
    const chars = new Uint32Array([46, 33]); // ".!"
    const result = trim(input, chars);
    const expected = new Uint32Array([65, 66]); // "AB"
    equal(expected, result);
});
