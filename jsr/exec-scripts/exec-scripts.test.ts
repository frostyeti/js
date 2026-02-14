import { test } from "node:test";
import { equal, ok } from "@frostyeti/assert";
import { pathFinder } from "@frostyeti/exec";
import { WINDOWS } from "@frostyeti/globals/os";

import { bash, BASH_SHELL_ARGS } from "./bash.ts";
import { bun } from "./bun.ts";
import { deno } from "./deno.ts";
import { dotnet, DotnetScriptCommand } from "./dotnet.ts";
import { go, GoScriptCommand } from "./go.ts";
import { node } from "./node.ts";
import { powershell, POWERSHELL_SHELL_ARGS } from "./powershell.ts";
import { pwsh, PWSH_SHELL_ARGS } from "./pwsh.ts";
import { python } from "./python.ts";
import { ruby } from "./ruby.ts";
import { sh, SH_SHELL_ARGS } from "./sh.ts";
import { CmdScriptCommand } from "./wincmd.ts";

const globals = globalThis as unknown as { Deno?: unknown; Bun?: unknown };
const RUNTIME = globals.Deno ? "deno" : globals.Bun ? "bun" : "node";

function requireExe(t: { skip: (message?: string) => void }, name: string): boolean {
    const exe = pathFinder.findExeSync(name);
    if (exe) {
        return true;
    }

    if (RUNTIME === "bun") {
        ok(true, `Skipping test: ${name} command not found`);
        return false;
    }

    t.skip(`Skipping test: ${name} command not found`);
    return false;
}

test("exec-scripts::node.script builds -e for inline code", (t) => {
    if (!requireExe(t, "node")) return;

    const c = node.script("console.log('hi')");
    equal(c.toArgs(), ["node", "-e", "console.log('hi')"]);
    equal(c.script, "console.log('hi')");
});

test("exec-scripts::node.script treats extension as file", (t) => {
    if (!requireExe(t, "node")) return;

    const c = node.script("./example.ts");
    equal(c.toArgs(), ["node", "./example.ts"]);
});

test("exec-scripts::deno.script builds eval by default", (t) => {
    if (!requireExe(t, "deno")) return;

    const c = deno.script("console.log('hi')");
    equal(c.toArgs(), ["deno", "eval", "console.log('hi')"]);
    equal(c.script, "console.log('hi')");
});

test("exec-scripts::deno.script treats extension as file", (t) => {
    if (!requireExe(t, "deno")) return;

    const c = deno.script("./example.ts");
    equal(c.toArgs(), ["deno", "run", "-A", "./example.ts"]);
});

test("exec-scripts::bun.script builds -e for inline code", (t) => {
    if (!requireExe(t, "bun")) return;

    const c = bun.script("console.log('hi')");
    equal(c.toArgs(), ["bun", "-e", "console.log('hi')"]);
});

test("exec-scripts::bash.script uses -c for inline code", (t) => {
    if (!requireExe(t, "bash")) return;

    const c = bash.script("echo hi");
    equal(c.toArgs(), ["bash", ...BASH_SHELL_ARGS, "-c", "echo hi"]);
});

test("exec-scripts::sh.script uses -c for inline code", (t) => {
    if (!requireExe(t, "sh")) return;

    const c = sh.script("echo hi");
    equal(c.toArgs(), ["sh", ...SH_SHELL_ARGS, "-c", "echo hi"]);
});

test("exec-scripts::python.script uses -c for inline code", (t) => {
    if (!requireExe(t, "python")) return;

    const c = python.script("print('hi')");
    const args = c.toArgs();
    equal(args[0], "python");
    equal(args[args.length - 1], "print('hi')");
});

test("exec-scripts::ruby.script uses -e for inline code", (t) => {
    if (!requireExe(t, "ruby")) return;

    const c = ruby.script("puts 'hi'");
    equal(c.toArgs(), ["ruby", "-e", "puts 'hi'"]);
});

test("exec-scripts::powershell.script uses -Command for inline code", (t) => {
    if (!requireExe(t, "powershell")) return;

    const c = powershell.script("Write-Output 'hi'");
    equal(c.toArgs(), ["powershell", ...POWERSHELL_SHELL_ARGS, "-Command", "Write-Output 'hi'"]);
});

test("exec-scripts::pwsh.script uses -Command for inline code", (t) => {
    if (!requireExe(t, "pwsh")) return;

    const c = pwsh.script("Write-Output 'hi'");
    equal(c.toArgs(), ["pwsh", ...PWSH_SHELL_ARGS, "-Command", "Write-Output 'hi'"]);
});

test("exec-scripts::DotnetScriptCommand.getShellArgs selects mode by extension", (t) => {
    if (!requireExe(t, "dotnet")) return;

    const cmd = new DotnetScriptCommand("ignored");
    equal(cmd.getShellArgs("./test.cs", true), ["run", "--file", "./test.cs"]);
    equal(cmd.getShellArgs("./test.dll", true), ["./test.dll"]);
    equal(cmd.getShellArgs("./proj.csproj", true), ["run", "--project", "./proj.csproj", "--"]);
});

test("exec-scripts::GoScriptCommand.getShellArgs includes go run", (t) => {
    if (!requireExe(t, "go")) return;

    const cmd = new GoScriptCommand("ignored");
    equal(cmd.getShellArgs("./test.go", true), ["run", "./test.go"]);
});

test("exec-scripts::CmdScriptCommand exists (skips on non-Windows)", (t) => {
    if (!requireExe(t, "cmd")) return;

    const cmd = new CmdScriptCommand("echo hi");
    equal(typeof cmd.getShellArgs, "function");
});

// =============================================================================
// Integration tests - run scripts and verify output
// =============================================================================

test("exec-scripts::node.script runs and captures output", async (t) => {
    if (!requireExe(t, "node")) return;

    const cmd = node.script("console.log('hello from node')");
    equal(cmd.script, "console.log('hello from node')");
    equal(cmd.toArgs(), ["node", "-e", "console.log('hello from node')"]);
    const output = await cmd.output();
    equal(output.code, 0);
    equal(output.text(), "hello from node\n");
});

test("exec-scripts::deno.script runs and captures output", async (t) => {
    if (!requireExe(t, "deno")) return;

    const testCmd = deno.script("console.log('hello from deno')");
    const output = await testCmd.output();
    
    equal(output.code, 0);
    ok(output.text().length > 0, "deno should produce some output");
});

test("exec-scripts::bun.script runs and captures output", async (t) => {
    if (!requireExe(t, "bun")) return;

    const output = await bun.script("console.log('hello from bun')").output();
    equal(output.code, 0);
    equal(output.text(), "hello from bun\n");
});

test("exec-scripts::bash.script runs and captures output", async (t) => {
    if (!requireExe(t, "bash")) return;

    const output = await bash.script("echo 'hello from bash'").output();
    // equal(output.code, 0);
    equal(output.text().trim(), "hello from bash");
});

test("exec-scripts::sh.script runs and captures output", async (t) => {
    if (!requireExe(t, "sh")) return;

    const output = await sh.script("echo 'hello from sh'").output();
    equal(output.code, 0);
    equal(output.text().trim(), "hello from sh");
});

test("exec-scripts::python.script runs and captures output", async (t) => {
    if (!requireExe(t, "python")) return;

    const testCmd = python.script("print('hello from python')");
    const output = await testCmd.output();
    
    if (WINDOWS) {
        if (output.code === 9009) {
            t.skip("Python not available on this Windows system");
            return;
        }
    }
    
    equal(output.code, 0);
    equal(output.text(), WINDOWS ? "hello from python\r\n" : "hello from python\n");
});

test("exec-scripts::ruby.script runs and captures output", async (t) => {
    if (!requireExe(t, "ruby")) return;

    const output = await ruby.script("puts 'hello from ruby'").output();
    equal(output.code, 0);
    equal(output.text(), WINDOWS ? "hello from ruby\r\n" : "hello from ruby\n");
});

test("exec-scripts::powershell.script runs and captures output", async (t) => {
    if (!requireExe(t, "powershell")) return;

    const output = await powershell.script("Write-Output 'hello from powershell'").output();
    equal(output.code, 0);
    equal(output.text().trim(), "hello from powershell");
});

test("exec-scripts::pwsh.script runs and captures output", async (t) => {
    if (!requireExe(t, "pwsh")) return;

    const output = await pwsh.script("Write-Output 'hello from pwsh'").output();
    equal(output.code, 0);
    equal(output.text().trim(), "hello from pwsh");
});

test("exec-scripts::node.script captures exit code on failure", async (t) => {
    if (!requireExe(t, "node")) return;

    const output = await node.script("process.exit(42)").run();
    equal(output.code, 42);
});

test("exec-scripts::python.script captures exit code on failure", async (t) => {
    if (!requireExe(t, "python")) return;

    const testCmd = python.script("import sys; sys.exit(5)");
    const output = await testCmd.output();
    
    if (WINDOWS) {
        if (output.code === 9009) {
            t.skip("Python not available on this Windows system");
            return;
        }
    }
    
    equal(output.code, 5);
});

// =============================================================================
// Dotnet and Go integration tests - require temp script files
// =============================================================================

test("exec-scripts::dotnet.script runs and captures output", async (t) => {
    if (!requireExe(t, "dotnet")) return;

    const testCmd = dotnet.script('Console.WriteLine("hello from dotnet");');
    const output = await testCmd.output();
    
    equal(output.code, 0, `Exit code should be 0. Output: ${output.text()} Error: ${output.errorText()}`);
    if (WINDOWS) {
        ok(output.text().includes("hello from dotnet"), `Output: ${output.text()}`);
    } else {
        equal(output.text().trim(), "hello from dotnet");
    }
});

test("exec-scripts::go.script runs and captures output", async (t) => {
    if (!requireExe(t, "go")) return;

    const testCmd = go.script(`
package main

import "fmt"

func main() {
    fmt.Println("hello from go")
}
`);
    const output = await testCmd.output();
    
    equal(output.code, 0, `Exit code should be 0. Output: ${output.text()} Error: ${output.errorText()}`);
    equal(output.text().trim(), "hello from go");
});

test("exec-scripts::go.script captures exit code on failure", async (t) => {
    if (!requireExe(t, "go")) return;

    const testCmd = go.script(`
package main

import "os"

func main() {
    os.Exit(7)
}
`);
    const output = await testCmd.output();
    const text = output.errorText();
    
    equal(output.code, 1, `Exit code should be 1. Output: ${output.text()} Error: ${text}`);
    ok(text.includes("exit status 7"), `Output should include "exit status 7". Output: ${text}`);
});
