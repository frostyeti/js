import { test } from "node:test";
import { equal, isDebugTests } from "@frostyeti/assert";
import { pascalize } from "./pascalize.ts";

test("slices::pascalize", () => {
    const tests = [
        { input: "hello world", result: "HelloWorld" },
        { input: "HelloWorld", result: "Helloworld" },
        { input: "helloWorld", result: "Helloworld" },

        { input: "hello wörld", result: "HelloWörld" },
        { input: "helloWörld", result: "Hellowörld" },
        { input: "hello WÖrLD", result: "HelloWörld" },
    ];

    let i = 0;
    for (const { input, result } of tests) {
        const actual = pascalize(input);

        if (isDebugTests()) {
            console.log(i, input, actual, result);
        }

        equal(actual, result);
        i++;
    }
});
