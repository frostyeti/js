import { test } from "node:test";
import { equal, ok } from "@frostyeti/assert";
import { mkdtemp, mkdtempSync } from "./mkdtemp.ts";
import { globals, WIN } from "./globals.ts";
import { mkdir } from "./mkdir.ts";
import { rm } from "./rm.ts";
import { exists, existsSync } from "./exists.ts";

// deno-lint-ignore no-explicit-any
const g = globals as Record<string, any>;

test("fs::makeTempDir creates temporary directory with default options", async () => {
    const tempDir = await mkdtemp();
    ok(await exists(tempDir));
    await rm(tempDir, { recursive: true });
});

test("fs::makeTempDir creates directory with prefix", async () => {
    const tempDir = await mkdtemp({ prefix: "test-" });
    ok(await exists(tempDir));
    ok(tempDir.includes("test-"), `Expected prefix 'test-' in ${tempDir}`);
    await rm(tempDir, { recursive: true });
});

test("fs::makeTempDir creates directory with suffix", async () => {
    const tempDir = await mkdtemp({ suffix: "-tmp" });
    ok(await exists(tempDir));
    ok(tempDir.endsWith("-tmp"), `Expected suffix '.tmp' in ${tempDir}`);
    await rm(tempDir, { recursive: true });
});

test("fs::makeTempDir creates directory in specified dir", async () => {
    const baseDir = !WIN ? "/tmp/test-base" : (globals.process.env.TEMP + "\\test-base");
    await mkdir(baseDir, { recursive: true });
    const tempDir = await mkdtemp({ dir: baseDir });
    ok(tempDir.startsWith(baseDir));
    ok(await exists(tempDir));
    await rm(baseDir, { recursive: true });
});

test("fs::makeTempDir uses Deno.makeTempDir when available", async () => {
    const { Deno: od } = globals;
    delete g["Deno"];
    try {
        g.Deno = {
            makeTempDir: () => Promise.resolve("/fake/temp/dir"),
        };
        const dir = await mkdtemp();
        equal(dir, "/fake/temp/dir");
    } finally {
        globals.Deno = od;
    }
});

test("fs::makeTempDirSync creates temporary directory with default options", async () => {
    const tempDir = mkdtempSync();
    ok(existsSync(tempDir));
    await rm(tempDir, { recursive: true });
});

test("fs::makeTempDirSync creates directory with prefix", async () => {
    const tempDir = mkdtempSync({ prefix: "test-" });
    ok(existsSync(tempDir));
    ok(tempDir.includes("test-"));
    await rm(tempDir, { recursive: true });
});

test("fs::makeTempDirSync creates directory with suffix", async () => {
    const tempDir = mkdtempSync({ suffix: "-tmp" });
    ok(existsSync(tempDir));
    ok(tempDir.endsWith("-tmp"));
    await rm(tempDir, { recursive: true });
});

test("fs::makeTempDirSync creates directory in specified dir", async () => {
    const baseDir = !WIN ? "/tmp/test-base" : (globals.process.env.TEMP + "\\test-base");
    await mkdir(baseDir, { recursive: true });
    const tempDir = mkdtempSync({ dir: baseDir });
    ok(tempDir.startsWith(baseDir));

    ok(existsSync(tempDir));
    await rm(baseDir, { recursive: true });
});

test("fs::makeTempDirSync uses Deno.makeTempDirSync when available", () => {
    const { Deno: od } = globals;
    delete g["Deno"];
    try {
        g.Deno = {
            makeTempDirSync: () => "/fake/temp/dir",
        };
        const dir = mkdtempSync();
        equal(dir, "/fake/temp/dir");
    } finally {
        globals.Deno = od;
    }
});
