import { test } from "node:test";
import { equal, ok } from "@frostyeti/assert";
import { mktemp, mktempSync } from "./mktemp.ts";
import { join } from "@frostyeti/path";
import { globals } from "./globals.ts";
import { mkdir } from "./mkdir.ts";
import { rm } from "./rm.ts";
import { exists, existsSync } from "./exists.ts";

// deno-lint-ignore no-explicit-any
const g = globals as Record<string, any>;
const testData = join(import.meta.dirname!, "test-data", "make_temp_file");

test("fs::makeTempFile creates a temporary file with default options", async () => {
    const file = await mktemp();
    console.log(file);
    ok(await exists(file), "File should exist");
    await rm(file);
});

test("fs::makeTempFile creates a file with custom prefix and suffix", async () => {
    const file = await mktemp({ prefix: "test-", suffix: ".txt" });
    ok(await exists(file));
    const tmp = globals.process.env.TEMP ?? globals.process.env.TMPDIR ?? "/tmp";
    ok(file.startsWith(join(tmp, "test-")));
    ok(file.endsWith(".txt"));
    await rm(file);
});

test("fs::makeTempFile creates a file in custom directory", async () => {
    const customDir = join(testData, "custom-temp");
    await mkdir(customDir, { recursive: true });
    const file = await mktemp({ dir: customDir });
    ok(await exists(file), `File ${file} should exist in ${customDir}`);
    ok(file.includes(customDir));
    await rm(customDir, { recursive: true });
});

test("fs::makeTempFileSync creates a temporary file with default options", async () => {
    const file = mktempSync();
    ok(existsSync(file));
    await rm(file, { recursive: true });
});

test("fs::makeTempFileSync creates a file with custom prefix and suffix", async () => {
    const file = mktempSync({ prefix: "test-", suffix: ".txt" });
    ok(existsSync(file));
    const tmp = globals.process.env.TEMP ?? globals.process.env.TMPDIR ?? "/tmp";
    ok(file.startsWith(join(tmp, "test-")));
    ok(file.endsWith(".txt"));
    await rm(file, { recursive: true });
});

test("fs::makeTempFileSync creates a file in custom directory", async () => {
    const customDir = join(testData, "custom-temp-sync");
    await mkdir(customDir, { recursive: true });
    const file = mktempSync({ dir: customDir });
    ok(existsSync(file));
    ok(file.includes(customDir));
    await rm(customDir, { recursive: true });
});

test("fs::makeTempFile uses Deno.makeTempFile when available", async () => {
    const originalDeno = g.Deno;
    delete g["Deno"];
    const testFile = "/tmp/test-deno-file";
    try {
        g.Deno = {
            makeTempFile: () => Promise.resolve(testFile),
        };
        const file = await mktemp();
        equal(file, testFile);
    } finally {
        g.Deno = originalDeno;
    }
});

test("fs::makeTempFileSync uses Deno.makeTempFileSync when available", () => {
    const originalDeno = g.Deno;
    delete g["Deno"];
    const testFile = "/tmp/test-deno-file-sync";
    try {
        g.Deno = {
            makeTempFileSync: () => testFile,
        };
        const file = mktempSync();
        equal(file, testFile);
    } finally {
        g.Deno = originalDeno;
    }
});
