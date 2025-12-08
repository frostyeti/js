import { test } from "node:test";
import { ok } from "@frostyeti/assert";
import { gid } from "./gid.ts";
import { WIN } from "./globals.ts";

const gb: Record<string, unknown> = globalThis as Record<string, unknown>;


test("fs::gid returns number when not on windows",  (t) => {
    if (WIN) {
        if (gb.Bun) {
            ok(
                true,
                "Skipping test: Bun does not support nested tests using node:test, including the skip",
            );
            return;
        }

        t.skip("Skipping test: gid is not supported on Windows");
    }

    const g = gid();
    ok(g !== undefined && g !== null && g > -1);
});
