import { test } from "node:test";
import { equal, ok } from "@frostyeti/assert";
import { pathFinder } from "@frostyeti/exec";

import { bash, BASH_SHELL_ARGS } from "./bash.ts";
import { bun } from "./bun.ts";
import { deno } from "./deno.ts";
import { DotnetScriptCommand } from "./dotnet.ts";
import { GoScriptCommand } from "./go.ts";
import { node } from "./node.ts";
import { powershell, POWERSHELL_SHELL_ARGS } from "./powershell.ts";
import { pwsh, PWSH_SHELL_ARGS } from "./pwsh.ts";
import { python } from "./python.ts";
import { ruby } from "./ruby.ts";
import { sh, SH_SHELL_ARGS } from "./sh.ts";
import { CmdScriptCommand } from "./wincmd.ts";

const globals = globalThis as unknown as { Deno?: unknown; Bun?: unknown };
const RUNTIME = globals.Deno ? "deno" : globals.Bun ? "bun" : "node";

async function requireExe(t: { skip: (message?: string) => void }, name: string): Promise<string | undefined> {
    const exe = await pathFinder.findExe(name);
    if (exe) {
        return exe;
    }

    if (RUNTIME === "bun") {
        // Bun's node:test implementation historically has issues with skipping.
        ok(true, `Skipping test: ${name} command not found`);
        return undefined;
    }

    t.skip(`Skipping test: ${name} command not found`);
    return undefined;
}

test("exec-scripts::node.script builds -e for inline code", async (t) => {
    if (!await requireExe(t, "node")) return;

    const c = node.script("console.log('hi')");
    equal(c.toArgs(), ["node", "-e", "console.log('hi')"]);
    equal(c.script, "console.log('hi')");
});

test("exec-scripts::node.script treats extension as file", async (t) => {
    if (!await requireExe(t, "node")) return;

    const c = node.script("./example.ts");
    equal(c.toArgs(), ["node", "./example.ts"]);
});

test("exec-scripts::deno.script builds eval by default", async (t) => {
    if (!await requireExe(t, "deno")) return;

    const c = deno.script("console.log('hi')");
    equal(c.toArgs(), ["deno", "eval", "console.log('hi')"]);
    equal(c.script, "console.log('hi')");
});

test("exec-scripts::deno.script treats extension as file", async (t) => {
    if (!await requireExe(t, "deno")) return;

    const c = deno.script("./example.ts");
    equal(c.toArgs(), ["deno", "run", "-A", "./example.ts"]);
});

test("exec-scripts::bun.script builds -e for inline code", async (t) => {
    if (!await requireExe(t, "bun")) return;

    const c = bun.script("console.log('hi')");
    equal(c.toArgs(), ["bun", "-e", "console.log('hi')"]);
});

test("exec-scripts::bash.script uses -c for inline code", async (t) => {
    if (!await requireExe(t, "bash")) return;

    const c = bash.script("echo hi");
    equal(c.toArgs(), ["bash", ...BASH_SHELL_ARGS, "-c", "echo hi"]);
});

test("exec-scripts::sh.script uses -c for inline code", async (t) => {
    if (!await requireExe(t, "sh")) return;

    const c = sh.script("echo hi");
    equal(c.toArgs(), ["sh", ...SH_SHELL_ARGS, "-c", "echo hi"]);
});

test("exec-scripts::python.script uses -c for inline code", async (t) => {
    if (!await requireExe(t, "python")) return;

    const c = python.script("print('hi')");
    equal(c.toArgs(), ["python", "-c", "print('hi')"]);
});

test("exec-scripts::ruby.script uses -e for inline code", async (t) => {
    if (!await requireExe(t, "ruby")) return;

    const c = ruby.script("puts 'hi'");
    equal(c.toArgs(), ["ruby", "-e", "puts 'hi'"]);
});

test("exec-scripts::powershell.script uses -Command for inline code", async (t) => {
    if (!await requireExe(t, "powershell")) return;

    const c = powershell.script("Write-Output 'hi'");
    equal(c.toArgs(), ["powershell", ...POWERSHELL_SHELL_ARGS, "-Command", "Write-Output 'hi'"]);
});

test("exec-scripts::pwsh.script uses -Command for inline code", async (t) => {
    if (!await requireExe(t, "pwsh")) return;

    const c = pwsh.script("Write-Output 'hi'");
    equal(c.toArgs(), ["pwsh", ...PWSH_SHELL_ARGS, "-Command", "Write-Output 'hi'"]);
});

test("exec-scripts::DotnetScriptCommand.getShellArgs selects mode by extension", async (t) => {
    if (!await requireExe(t, "dotnet")) return;

    const cmd = new DotnetScriptCommand("ignored");
    equal(cmd.getShellArgs("./test.cs", true), ["run", "--file", "./test.cs"]);
    equal(cmd.getShellArgs("./test.dll", true), ["./test.dll"]);
    equal(cmd.getShellArgs("./proj.csproj", true), ["run", "--project", "./proj.csproj", "--"]);
});

test("exec-scripts::GoScriptCommand.getShellArgs includes go run", async (t) => {
    if (!await requireExe(t, "go")) return;

    const cmd = new GoScriptCommand("ignored");
    equal(cmd.getShellArgs("./test.go", true), ["run", "./test.go"]);
});

test("exec-scripts::CmdScriptCommand exists (skips on non-Windows)", async (t) => {
    if (!await requireExe(t, "cmd")) return;

    const cmd = new CmdScriptCommand("echo hi");
    equal(typeof cmd.getShellArgs, "function");
});
