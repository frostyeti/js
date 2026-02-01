import { test } from "node:test";
import { equal, ok, rejects } from "@frostyeti/assert";
import { mkdir, mkdirSync } from "./mkdir.ts";
import { join } from "@frostyeti/path";
import { exec, output } from "./_testutils.ts";
import { globals } from "./globals.ts";
import { statSync } from "./stat.ts";
import { rmSync } from "./rm.ts";

// deno-lint-ignore no-explicit-any
const g = globals as Record<string, any>;

const testData = join(import.meta.dirname!, "test-data", "make_dir");

test("fs::makeDir creates a directory", async () => {
    const dirPath = join(testData, "new-dir");
    await mkdir(testData, { recursive: true });
    try {
        await mkdir(dirPath);
        const o = await output("test", ["-d", dirPath]);
        equal(o.code, 0);
    } finally {
        await exec("rm", ["-rf", dirPath]);
    }
});

test("fs::makeDir throws when directory already exists", async () => {
    const dirPath = join(testData, "existing-dir");
    await mkdir(testData, { recursive: true });
    try {
        await mkdir(dirPath, { recursive: true });
        await rejects(async () => await mkdir(dirPath));
    } finally {
        await exec("rm", ["-rf", dirPath]);
    }
});

test("fs::makeDir uses Deno.mkdir when available", async () => {
    const { Deno: od } = globals;
    delete g["Deno"];

    try {
        let called = false;
        g.Deno = {
            mkdir: () => {
                called = true;
            },
        };
        await mkdir("test");
        ok(called);
    } finally {
        globals.Deno = od;
    }
});

test("fs::mkdirSync creates a directory synchronously", () => {
    const dirPath = join(testData, "new-dir-sync");

    try {
        mkdirSync(dirPath);
        const result = statSync(dirPath);
        ok(result.isDirectory);
    } finally {
        rmSync(dirPath, { recursive: true });
    }
});

test("fs::mkdirSync uses Deno.mkdirSync when available", () => {
    const { Deno: od } = globals;
    delete g["Deno"];

    try {
        let called = false;
        g.Deno = {
            mkdirSync: () => {
                called = true;
            },
        };
        mkdirSync("test");
        ok(called);
    } finally {
        globals.Deno = od;
    }
});
