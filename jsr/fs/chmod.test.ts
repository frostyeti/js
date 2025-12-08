import { test } from "node:test";
import { equal } from "@frostyeti/assert";
import { chmod, chmodSync } from "./chmod.ts";
import { join } from "@frostyeti/path";
import { WIN } from "./globals.ts";
import { exec } from "./_testutils.ts";
import { stat } from "./stat.ts";
import { ensureFile, ensureFileSync } from "./ensure_file.ts";

const testFile = join(import.meta.dirname!, "chmod_test.txt");

test("fs::chmod changes permissions async", { skip: WIN }, async () => {
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

test("fs::chmodSync changes permissions sync", { skip: WIN }, async () => {
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
