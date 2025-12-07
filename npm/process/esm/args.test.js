import { test } from "node:test";
import { equal, fail } from "@frostyeti/assert";
import { BUN, DENO, globals, NODE } from "@frostyeti/globals";
import { dirname, fromFileUrl } from "@frostyeti/path";
import { spawnSync } from "node:child_process";
const dir = dirname(fromFileUrl(import.meta.url));
const WINDOWS = (globals.Deno && globals.Deno.build.os === "windows") ||
    (globals.process && globals.process.platform === "win32");
const deno = WINDOWS ? "deno.exe" : "deno";
const node = WINDOWS ? "node.exe" : "node";
const bun = WINDOWS ? "bun.exe" : "bun";
const expected = ["arg1", "arg2", "--option", "value", "-o"];
test("process::args", () => {
    if (DENO) {
        const o = spawnSync(deno, [
            "run",
            "-A",
            `${dir}/internal/args.ts`,
            "arg1",
            "arg2",
            "--option",
            "value",
            "-o",
        ], {
            encoding: "utf-8",
            stdio: "pipe",
        });
        const { status, stdout, stderr } = o;
        const code = status;
        const output = stdout;
        const errorOutput = stderr;
        if (code !== 0) {
            fail(`deno run failed ${output} ${errorOutput}`);
        }
        const data = JSON.parse(output);
        equal(data, expected);
        return;
    }
    if (BUN) {
        const o = spawnSync(bun, [
            `${dir}/internal/args.js`,
            "arg1",
            "arg2",
            "--option",
            "value",
            "-o",
        ], {
            encoding: "utf-8",
            stdio: "pipe",
        });
        const { status, stdout, stderr } = o;
        const code = status;
        const output = stdout;
        const errorOutput = stderr;
        if (code !== 0) {
            fail(`bun run failed ${output} ${errorOutput}`);
        }
        const data = JSON.parse(output);
        equal(data, expected);
        return;
    }
    if (NODE) {
        const o = spawnSync(node, [
            `${dir}/internal/args.js`,
            "arg1",
            "arg2",
            "--option",
            "value",
            "-o",
        ], {
            encoding: "utf-8",
            stdio: "pipe",
        });
        const { status, stdout, stderr } = o;
        const code = status;
        const output = stdout;
        const errorOutput = stderr;
        if (code !== 0) {
            fail(`node run failed ${output} ${errorOutput}`);
        }
        const data = JSON.parse(output);
        equal(data, expected);
        return;
    }
});
