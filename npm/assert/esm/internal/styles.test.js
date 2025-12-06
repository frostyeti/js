// Copyright 2018-2025 the Deno authors. MIT license.
import "../_dnt.test_polyfills.js";
import * as dntShim from "../_dnt.test_shims.js";
import { test } from "node:test";
import { equal } from "../equal.js";
import * as c from "./styles.js";
test("assert::red() single color", function () {
    equal(c.red("foo bar"), "[31mfoo bar[39m");
});
test("assert::red() replaces close characters", function () {
    equal(c.red("Hel[39mlo"), "[31mHel[31mlo[39m");
});
test("assert::getColorEnabled() handles enabled colors", function () {
    equal(c.red("foo bar"), "[31mfoo bar[39m");
});
test("assert::bold()", function () {
    equal(c.bold("foo bar"), "[1mfoo bar[22m");
});
test("assert::red()", function () {
    equal(c.red("foo bar"), "[31mfoo bar[39m");
});
test("assert::green()", function () {
    equal(c.green("foo bar"), "[32mfoo bar[39m");
});
test("assert::white()", function () {
    equal(c.white("foo bar"), "[37mfoo bar[39m");
});
test("assert::gray()", function () {
    equal(c.gray("foo bar"), "[90mfoo bar[39m");
});
test("assert::bgRed()", function () {
    equal(c.bgRed("foo bar"), "[41mfoo bar[49m");
});
test("assert::bgGreen()", function () {
    equal(c.bgGreen("foo bar"), "[42mfoo bar[49m");
});
// https://github.com/chalk/strip-ansi/blob/2b8c961e75760059699373f9a69101065c3ded3a/test.js#L4-L6
test("assert::stripAnsiCode()", function () {
    equal(c.stripAnsiCode("\u001B[0m\u001B[4m\u001B[42m\u001B[31mfoo\u001B[39m\u001B[49m\u001B[24mfoo\u001B[0m"), "foofoo");
});
// deno-lint-ignore no-explicit-any
const globals = dntShim.dntGlobalThis;
test("assert::noColor", async function () {
    const fixtures = [
        ["true", "foo bar\n"],
        ["1", "foo bar\n"],
        ["", "[31mfoo bar[39m\n"],
    ];
    const code = `
    import * as c from "${globalThis[Symbol.for("import-meta-ponyfill-esmodule")](import.meta).resolve("./styles.ts")}";
    console.log(c.red("foo bar"));
  `;
    if (globals.Deno) {
        for await (const [fixture, expected] of fixtures) {
            const Deno = globals.Deno;
            const command = new Deno.Command(Deno.execPath(), {
                args: ["eval", "--no-lock", code],
                clearEnv: true,
                env: {
                    NO_COLOR: fixture,
                    TERM: "xterm-256color",
                },
            });
            const { stdout } = await command.output();
            const decoder = new TextDecoder();
            const output = decoder.decode(stdout);
            equal(output, expected);
        }
    }
    else {
        // TODO: Implement this for Node.js/BUN
    }
});
