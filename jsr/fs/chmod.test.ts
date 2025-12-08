import { test } from "node:test";
import { equal, ok } from "@frostyeti/assert";
import { chmod, chmodSync } from "./chmod.ts";
import { join } from "@frostyeti/path";
import { WIN } from "./globals.ts";
import { exec } from "./_testutils.ts";
import { stat } from "./stat.ts";
import { ensureFile, ensureFileSync } from "./ensure_file.ts";

const testFile = join(import.meta.dirname!, "chmod_test.txt");

const o: test.TestOptions = {};
const g: Record<string, unknown> = globalThis as Record<string, unknown>;
if (!g.Bun && WIN) {
    o.skip = true;
}

test("fs::chmod changes permissions async", o, async () => {
    if (g.Bun && WIN) {
        ok(
            true,
            "Skipping test: Bun on Windows does not support nested tests using node:test, including the skip",
        );
        return;
    }

    await ensureFile(testFile);

    try {
        await exec("chmod", ["644", testFile]);
        await chmod(testFile, 0o755);
        const o = await stat(testFile);

        // 0o755 in octal = 493 in decimal
        equal(o.mode! & 0o777, 0o755);
    } finally {
        await exec("rm", [testFile]);
    }
});

test("fs::chmodSync changes permissions sync", o, async () => {
    if (g.Bun && WIN) {
        ok(
            true,
            "Skipping test: Bun on Windows does not support nested tests using node:test, including the skip",
        );
        return;
    }

    ensureFileSync(testFile);

    try {
        await exec("chmod", ["644", testFile]);
        chmodSync(testFile, 0o755);
        const o = await stat(testFile);
        // 0o755 in octal = 493 in decimal
        equal(o.mode! & 0o777, 0o755);
    } finally {
        await exec("rm", [testFile]);
    }
});
