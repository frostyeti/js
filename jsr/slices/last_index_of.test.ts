import { test } from "node:test";
import { equal, isDebugTests } from "@frostyeti/assert";
import { lastIndexOf, lastIndexOfFold } from "./last_index_of.ts";

test("slices::lastIndexOf", () => {
    const tests = [
        { input: "hello world", test: "world", result: 6, position: Infinity },
        { input: "hello world", test: "world ", result: -1, position: Infinity },
        { input: "hello world", test: "WORLD", result: -1, position: Infinity },
        { input: "hello world", test: "WORLD ", result: -1, position: Infinity },
        { input: "hello world next", test: "world", result: 6, position: 11 },
        { input: "hello WÖrLD", test: "wörld", result: -1, position: Infinity },
    ];

    let i = 0;
    for (const { input, test, result, position } of tests) {
        if (isDebugTests()) {
            console.log(i, input, test, result);
        }
        i++;
        const actual = lastIndexOf(input, test, position) as number;
        equal(actual, result);
    }
});

test("slices::lastIndexOfFold", () => {
    const tests = [
        { input: "hello world", test: "world", result: 6, position: Infinity },
        { input: "hello world", test: "world ", result: -1, position: Infinity },
        { input: "hello world", test: "WORLD", result: 6, position: Infinity },
        { input: "hello world", test: "WORLD ", result: -1, position: Infinity },
        { input: "hello world next", test: "world", result: 6, position: 11 },
        { input: "hello WÖrLD", test: "wörld", result: 6, position: Infinity },
    ];

    let i = 0;
    for (const { input, test, result, position } of tests) {
        i++;
        const actual = lastIndexOfFold(input, test, position) as number;
        if (isDebugTests()) {
            console.log(i, input, test, result, actual);
        }
        equal(actual, result);
    }
});
