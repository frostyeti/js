import { test } from "node:test";
import { equal } from "@frostyeti/assert";
import { toLower } from "./to_lower.ts";

test("chars::toLower", () => {
    equal(toLower(0x0041), 0x0061);
    equal(toLower(0x0061), 0x0061);
    equal(toLower(0x00B5), 0x00B5);
    equal(toLower(0x039C), 0x03BC);
    equal(toLower(0x03BC), 0x03BC);
    equal(toLower(0x1F600), 0x1F600);
    equal(toLower(0x1F600), 0x1F600);
    equal(toLower(0x1F600), 0x1F600);
    equal(toLower(0x1F600), 0x1F600);
    equal(toLower(0x1F600), 0x1F600);
    equal(toLower(0x1F600), 0x1F600);
    equal(toLower(0x1F600), 0x1F600);
    equal(toLower(0x1F600), 0x1F600);
    equal(toLower(0x1F600), 0x1F600);
    equal(toLower(0x1F600), 0x1F600);
    equal(toLower(0x1F600), 0x1F600);
});
