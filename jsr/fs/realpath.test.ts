import { test } from "node:test";
import { equal, rejects, throws } from "@frostyeti/assert";
import { realpath, realpathSync } from "./realpath.ts";
import { globals } from "./globals.ts";
import { join } from "@frostyeti/path";
import { exec } from "./_testutils.ts";

// deno-lint-ignore no-explicit-any
const g = globals as Record<string, any>;

const testData = join(import.meta.dirname!, "test-data", "realpath");

test("fs::realPath resolves path when Deno exists", async () => {
    const { Deno: od } = globals;
    delete g["Deno"];

    try {
        g.Deno = {
            realPath: (_: string) => Promise.resolve("/real/path"),
        };
        const result = await realpath("/test/path");
        equal(result, "/real/path");
    } finally {
        globals.Deno = od;
    }
});

test("fs::realPath resolves path using node fs", async () => {
    const testFile = join(testData, "realpath-test.txt");
    await exec("mkdir", ["-p", testData]);
    await exec("touch", [testFile]);

    try {
        const result = await realpath(testFile);
        equal(result.endsWith("realpath-test.txt"), true);
    } finally {
        await exec("rm", ["-f", testFile]);
    }
});

test("fs::realPath throws when no fs module available", async () => {
    const { Deno: od, process: op, require: or } = globals;
    delete g["Deno"];
    delete g["process"];
    delete g["require"];

    try {
        await rejects(() => realpath("/test/path"), Error);
    } finally {
        globals.Deno = od;
        globals.process = op;
        globals.require = or;
    }
});

test("fs::realpathSync resolves path when Deno exists", () => {
    const { Deno: od } = globals;
    delete g["Deno"];

    try {
        g.Deno = {
            realPathSync: (_: string) => "/real/path",
        };
        const result = realpathSync("/test/path");
        equal(result, "/real/path");
    } finally {
        globals.Deno = od;
    }
});

test("fs::realpathSync resolves path using node fs", async () => {
    const testFile = join(testData, "realpath-sync-test.txt");
    await exec("touch", [testFile]);

    try {
        const result = realpathSync(testFile);
        equal(result.endsWith("realpath-sync-test.txt"), true);
    } finally {
        await exec("rm", ["-f", testFile]);
    }
});

test("fs::realpathSync throws when no fs module available", () => {
    const { Deno: od, process: op, require: or } = globals;
    delete g["Deno"];
    delete g["process"];
    delete g["require"];

    try {
        throws(() => realpathSync("/test/path"), Error);
    } finally {
        globals.Deno = od;
        globals.process = op;
        globals.require = or;
    }
});
