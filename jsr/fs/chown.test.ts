import { test } from "node:test";
import { equal } from "@frostyeti/assert";
import { chown, chownSync } from "./chown.ts";
import { exec } from "./_testutils.ts";
import { join } from "@frostyeti/path";
import { uid } from "./uid.ts";
import { stat } from "./stat.ts";
import { exists } from "./exists.ts";
import { remove } from "./remove.ts";
import { ok } from "node:assert";

const testFile1 = join(import.meta.dirname!, "chown_test.txt");
const testFile2 = join(import.meta.dirname!, "chown_test2.txt");
const cu = uid();
const g: Record<string, unknown> = globalThis as Record<string, unknown>;

test("chown::chown changes the owner async", async (t) => {
    if (cu === null || cu !== 0) {
        if (g.Bun) {
            ok(
                true,
                "Skipping test: Bun does not support nested tests using node:test, including the skip",
            );
            return;
        }

        t.skip("Skipping test: chown requires root privileges");
        return;
    }

    if (await exists(testFile2)) {
        await remove(testFile2);
    }

    await exec("touch", [testFile2]);

    try {
        await exec("sudo", ["chown", "nobody:nogroup", testFile2]);
        await chown(testFile2, 1000, 1000);
        const o = await stat(testFile2);
        // 1000 in decimal = 0o1750 in octal
        equal(o.uid, 1000);
        equal(o.gid, 1000);
    } finally {
        await exec("rm", ["-f", testFile2]);
    }
});

test("chown::chownSync changes the owner", async (t) => {
    if (cu === null || cu !== 0) {
        if (g.Bun) {
            ok(
                true,
                "Skipping test: Bun does not support nested tests using node:test, including the skip",
            );
            return;
        }

        t.skip("Skipping test: chown requires root privileges");
        return;
    }

    if (await exists(testFile1)) {
        await remove(testFile1);
    }

    await exec("touch", [testFile1]);

    try {
        await exec("sudo", ["chown", "nobody:nogroup", testFile1]);
        chownSync(testFile1, 1000, 1000);

        const o = await stat(testFile1);

        // 1000 in decimal = 0o1750 in octal
        equal(1000, o.uid);
        equal(1000, o.gid);
    } finally {
        await exec("rm", ["-f", testFile1]);
    }
});
