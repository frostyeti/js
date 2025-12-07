import { test } from "node:test";
import { equal } from "@frostyeti/assert";
import { toUpper } from "./to_upper.ts";

test("chars::toUpper", () => {
    equal(toUpper(0x0041), 0x0041);
    equal(toUpper(0x0061), 0x0041);
    equal(toUpper(0x00B5), 0x039C);
    equal(toUpper(0x039C), 0x039C);
    equal(toUpper(0x03BC), 0x039C);
    equal(toUpper(0x1F600), 0x1F600);
    equal(toUpper(0x1F600), 0x1F600);
    equal(toUpper(0x1F600), 0x1F600);
    equal(toUpper(0x1F600), 0x1F600);
    equal(toUpper(0x1F600), 0x1F600);
    equal(toUpper(0x1F600), 0x1F600);
    equal(toUpper(0x1F600), 0x1F600);
    equal(toUpper(0x1F600), 0x1F600);
    equal(toUpper(0x1F600), 0x1F600);
    equal(toUpper(0x1F600), 0x1F600);
    equal(toUpper(0x1F600), 0x1F600);
});
