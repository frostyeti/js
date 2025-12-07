// @deno-ig
import { test } from "node:test";
import { fail, stringIncludes } from "@frostyeti/assert";
import { BUN, DENO, globals, NODE } from "@frostyeti/globals";
import { dirname, fromFileUrl } from "@frostyeti/path";
import { spawn, spawnSync } from "node:child_process";

const dir = dirname(fromFileUrl(import.meta.url));

const WINDOWS = (globals.Deno && globals.Deno.build.os === "windows") ||
    (globals.process && globals.process.platform === "win32");
const deno = WINDOWS ? "deno.exe" : "deno";
const node = WINDOWS ? "node.exe" : "node";
const bun = WINDOWS ? "bun.exe" : "bun";

test("process::stdout", () => {
    if (DENO) {
        const o = spawnSync(deno, ["run", "-A", `${dir}/internal/write_stdout.ts`], {
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

        stringIncludes(output, "writeSync");
        stringIncludes(output, "write");

        return;
    }

    if (BUN) {
        const o = spawnSync(bun, [`${dir}/internal/write_stdout.js`], {
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

        stringIncludes(output, "writeSync");
        stringIncludes(output, "write");

        return;
    }

    if (NODE) {
        const o = spawnSync(node, [`${dir}/internal/write_stdout.js`], {
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

        stringIncludes(output, "writeSync");
        stringIncludes(output, "write");

        return;
    }
});

test("process::stderr", () => {
    if (DENO) {
        const o = spawnSync(deno, ["run", "-A", `${dir}/internal/write_stderr.ts`], {
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

        stringIncludes(errorOutput, "writeSync");
        stringIncludes(errorOutput, "write");

        return;
    }

    if (BUN) {
        const o = spawnSync(bun, [`${dir}/internal/write_stderr.js`], {
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

        stringIncludes(errorOutput, "writeSync");
        stringIncludes(errorOutput, "write");

        return;
    }

    if (NODE) {
        const o = spawnSync(node, [`${dir}/internal/write_stderr.js`], {
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

        stringIncludes(errorOutput, "writeSync");
        stringIncludes(errorOutput, "write");

        return;
    }
});

test("process::stdin.readSync", async () => {
    if (DENO) {
        const cmd = spawn(deno, ["run", "-A", `${dir}/internal/read_stdin.ts`], {
            stdio: ["pipe", "pipe", "pipe"],
        });

        const data: Array<string> = [];
        cmd.stdout.on("data", (chunk) => {
            // really a buffer, but can be joined as a string
            data.push(chunk);
        });

        cmd.stdin.write("hello world");
        cmd.stdin.end();

        const waitForExit = new Promise((resolve) => {
            cmd.on("close", (code) => {
                resolve(code);
            });
        });

        await waitForExit;

        const code = cmd.exitCode;
        const output = data.join("");

        if (code !== 0) {
            fail(`deno run failed ${output}`);
        }

        stringIncludes(output, "hello world");
        return;
    }

    if (BUN) {
        const cmd = spawn(bun, [`${dir}/internal/read_stdin.js`], {
            stdio: ["pipe", "pipe", "pipe"],
        });

        const data: Array<string> = [];
        cmd.stdout.on("data", (chunk) => {
            // really a buffer, but can be joined as a string
            data.push(chunk);
        });

        cmd.stdin.write("hello world");
        cmd.stdin.end();

        const waitForExit = new Promise((resolve) => {
            cmd.on("close", (code) => {
                resolve(code);
            });
        });

        await waitForExit;

        const code = cmd.exitCode;
        const output = data.join("");

        if (code !== 0) {
            fail(`bun run failed ${output}`);
        }

        stringIncludes(output, "hello world");
        return;
    }

    if (NODE) {
        const cmd = spawn(node, [`${dir}/internal/read_stdin.js`], {
            stdio: ["pipe", "pipe", "pipe"],
        });

        const data: Array<string> = [];
        cmd.stdout.on("data", (chunk) => {
            // really a buffer, but can be joined as a string
            data.push(chunk);
        });

        cmd.stdin.write("hello world");
        cmd.stdin.end();

        const waitForExit = new Promise((resolve) => {
            cmd.on("close", (code) => {
                resolve(code);
            });
        });

        await waitForExit;

        const code = cmd.exitCode;
        const output = data.join("");

        if (code !== 0) {
            fail(`node run failed ${output}`);
        }

        stringIncludes(output, "hello world");
        return;
    }
});

test("process::stdin.read", async () => {
    if (DENO) {
        const cmd = spawn(deno, ["run", "-A", `${dir}/internal/read_stdin_async.ts`], {
            stdio: ["pipe", "pipe", "pipe"],
        });

        const data: Array<string> = [];
        cmd.stdout.on("data", (chunk) => {
            // really a buffer, but can be joined as a string
            data.push(chunk);
        });

        cmd.stdin.write("hello world");
        cmd.stdin.end();

        const waitForExit = new Promise((resolve) => {
            cmd.on("close", (code) => {
                resolve(code);
            });
        });

        await waitForExit;

        const code = cmd.exitCode;
        const output = data.join("");

        if (code !== 0) {
            fail(`deno run failed ${output} with code ${code}`);
        }

        stringIncludes(output, "hello world");
        return;
    }

    if (BUN) {
        const cmd = spawn(bun, [`${dir}/internal/read_stdin_async.js`], {
            stdio: ["pipe", "pipe", "pipe"],
        });

        const data: Array<string> = [];
        cmd.stdout.on("data", (chunk) => {
            // really a buffer, but can be joined as a string
            data.push(chunk);
        });

        cmd.stdin.write("hello world");
        cmd.stdin.end();

        const waitForExit = new Promise((resolve) => {
            cmd.on("close", (code) => {
                resolve(code);
            });
        });

        await waitForExit;

        const code = cmd.exitCode;
        const output = data.join("");

        if (code !== 0) {
            fail(`bun run failed ${output}`);
        }

        stringIncludes(output, "hello world");
        return;
    }

    if (NODE) {
        const cmd = spawn(node, [`${dir}/internal/read_stdin_async.js`], {
            stdio: ["pipe", "pipe", "pipe"],
        });

        const data: Array<string> = [];
        cmd.stdout.on("data", (chunk) => {
            // really a buffer, but can be joined as a string
            data.push(chunk);
        });

        cmd.stdin.write("hello world");
        cmd.stdin.end();

        const waitForExit = new Promise((resolve) => {
            cmd.on("close", (code) => {
                resolve(code);
            });
        });

        await waitForExit;

        const code = cmd.exitCode;
        const output = data.join("");

        if (code !== 0) {
            fail(`node run failed ${output}`);
        }

        stringIncludes(output, "hello world");
        return;
    }
});
