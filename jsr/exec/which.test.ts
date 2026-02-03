import { test } from "node:test";
import { equal, ok, throws } from "@frostyeti/assert";
import { globals, WIN } from "./globals.ts";
import { which, whichSync } from "./which.ts";

let rt = "node";
if (globals.Deno) {
    rt = "deno";
} else if (globals.Bun) {
    rt = "bun";
}
const RUNTIME = rt;

test("exec::which", async () => {
    switch (RUNTIME) {
        case "deno":
            {
                const exe = await which("deno");
                ok(exe);
                if (WIN) {
                    equal(exe.substring(exe.length - 8), "deno.exe");
                } else {
                    equal(exe.substring(exe.length - 4), "deno");
                }
            }
            break;

        case "node":
            {
                const exe = await which("node");
                ok(exe);
                if (WIN) {
                    equal(exe.substring(exe.length - 8), "node.exe");
                } else {
                    equal(exe.substring(exe.length - 4), "node");
                }
            }
            break;

        case "bun":
            {
                const exe = await which("bun");
                ok(exe);
                if (WIN) {
                    equal(exe.substring(exe.length - 7), "bun.exe");
                } else {
                    equal(exe.substring(exe.length - 3), "bun");
                }
            }
            break;
    }
});

test("exec::whichSync", () => {
    switch (RUNTIME) {
        case "deno":
            {
                const exe = whichSync("deno");
                ok(exe);
                if (WIN) {
                    equal(exe.substring(exe.length - 8), "deno.exe");
                } else {
                    equal(exe.substring(exe.length - 4), "deno");
                }
            }
            break;

        case "node":
            {
                const exe = whichSync("node");
                ok(exe);
                if (WIN) {
                    equal(exe.substring(exe.length - 8), "node.exe");
                } else {
                    equal(exe.substring(exe.length - 4), "node");
                }
            }
            break;

        case "bun":
            {
                const exe = whichSync("bun");
                ok(exe);
                if (WIN) {
                    equal(exe.substring(exe.length - 7), "bun.exe");
                } else {
                    equal(exe.substring(exe.length - 3), "bun");
                }
            }
            break;
    }
});

test("exec::which - returns undefined for non-existent command", async () => {
    const result = await which("definitely-not-a-real-command-12345");
    equal(result, undefined);
});

test("exec::whichSync - returns undefined for non-existent command", () => {
    const result = whichSync("definitely-not-a-real-command-12345");
    equal(result, undefined);
});

test("exec::which - throws for empty fileName", async () => {
    let threw = false;
    try {
        await which("");
    } catch {
        threw = true;
    }
    ok(threw, "Expected which to throw for empty filename");
});

test("exec::whichSync - throws for empty fileName", () => {
    throws(() => whichSync(""));
});

test("exec::which - throws for whitespace-only fileName", async () => {
    let threw = false;
    try {
        await which("   ");
    } catch {
        threw = true;
    }
    ok(threw, "Expected which to throw for whitespace-only filename");
});

test("exec::which - with useCache false", async () => {
    // First call caches
    const first = await which("git");
    // Second call without cache
    const second = await which("git", undefined, false);
    equal(first, second);
});

test("exec::whichSync - with useCache false", () => {
    const first = whichSync("git");
    const second = whichSync("git", undefined, false);
    equal(first, second);
});

test("exec::which - with prependPath", async () => {
    // Even with invalid prepend paths, should still find on PATH
    const result = await which("git", ["/non-existent-path"]);
    // git should still be found on the system PATH
    if (result) {
        ok(result.includes("git"));
    }
});

test("exec::whichSync - with prependPath", () => {
    const result = whichSync("git", ["/non-existent-path"]);
    if (result) {
        ok(result.includes("git"));
    }
});
