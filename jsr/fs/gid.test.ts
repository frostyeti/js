import { test } from "node:test";
import { ok } from "@frostyeti/assert";
import { gid } from "./gid.ts";
import { WIN } from "./globals.ts";

const g: Record<string, unknown> = globalThis as Record<string, unknown>;
const isBun = g.Bun !== undefined;
const o : test.TestOptions = {};
if (!isBun && WIN) {
    o.skip = true;
}

test("fs::gid returns number when not on windows", o, () => {
    if (isBun && WIN) {
        ok(
            true,
            "Skipping test: Bun on Windows does not support nested tests using node:test, including the skip",
        );
        return;
    }

    const g = gid();
    ok(g !== undefined && g !== null && g > -1);
});
