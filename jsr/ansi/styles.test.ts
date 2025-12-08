// Copyright 2018-2025 the Deno authors. MIT license.
import { test } from "node:test";
import { equal } from "@frostyeti/assert";
import * as c from "./styles.ts";

test("ansi::reset()", function () {
    equal(c.reset("foo bar"), "[0mfoo bar[0m");
});

test("ansi::red() single color", function () {
    equal(c.red("foo bar"), "[31mfoo bar[39m");
});

test("ansi::bgBlue() double color", function () {
    equal(c.bgBlue(c.red("foo bar")), "[44m[31mfoo bar[39m[49m");
});

test("ansi::red() replaces close characters", function () {
    equal(c.red("Hel[39mlo"), "[31mHel[31mlo[39m");
});

test("ansi::getColorEnabled() handles enabled colors", function () {
    equal(c.isColorEnabled(), true);
    c.setColorEnabled(false);
    equal(c.bgBlue(c.red("foo bar")), "foo bar");
    c.setColorEnabled(true);
    equal(c.red("foo bar"), "[31mfoo bar[39m");
});

test("ansi::bold()", function () {
    equal(c.bold("foo bar"), "[1mfoo bar[22m");
});

test("ansi::dim()", function () {
    equal(c.dim("foo bar"), "[2mfoo bar[22m");
});

test("ansi::italic()", function () {
    equal(c.italic("foo bar"), "[3mfoo bar[23m");
});

test("ansi::underline()", function () {
    equal(c.underline("foo bar"), "[4mfoo bar[24m");
});

test("ansi::inverse()", function () {
    equal(c.inverse("foo bar"), "[7mfoo bar[27m");
});

test("ansi::hidden()", function () {
    equal(c.hidden("foo bar"), "[8mfoo bar[28m");
});

test("ansi::strikethrough()", function () {
    equal(c.strikethrough("foo bar"), "[9mfoo bar[29m");
});

test("ansi::black()", function () {
    equal(c.black("foo bar"), "[30mfoo bar[39m");
});

test("ansi::red()", function () {
    equal(c.red("foo bar"), "[31mfoo bar[39m");
});

test("ansi::green()", function () {
    equal(c.green("foo bar"), "[32mfoo bar[39m");
});

test("ansi::yellow()", function () {
    equal(c.yellow("foo bar"), "[33mfoo bar[39m");
});

test("ansi::blue()", function () {
    equal(c.blue("foo bar"), "[34mfoo bar[39m");
});

test("ansi::magenta()", function () {
    equal(c.magenta("foo bar"), "[35mfoo bar[39m");
});

test("ansi::cyan()", function () {
    equal(c.cyan("foo bar"), "[36mfoo bar[39m");
});

test("ansi::white()", function () {
    equal(c.white("foo bar"), "[37mfoo bar[39m");
});

test("ansi::gray()", function () {
    equal(c.gray("foo bar"), "[90mfoo bar[39m");
});

test("ansi::brightBlack()", function () {
    equal(c.brightBlack("foo bar"), "[90mfoo bar[39m");
});

test("ansi::brightRed()", function () {
    equal(c.brightRed("foo bar"), "[91mfoo bar[39m");
});

test("ansi::brightGreen()", function () {
    equal(c.brightGreen("foo bar"), "[92mfoo bar[39m");
});

test("ansi::brightYellow()", function () {
    equal(c.brightYellow("foo bar"), "[93mfoo bar[39m");
});

test("ansi::brightBlue()", function () {
    equal(c.brightBlue("foo bar"), "[94mfoo bar[39m");
});

test("ansi::brightMagenta()", function () {
    equal(c.brightMagenta("foo bar"), "[95mfoo bar[39m");
});

test("ansi::brightCyan()", function () {
    equal(c.brightCyan("foo bar"), "[96mfoo bar[39m");
});

test("ansi::brightWhite()", function () {
    equal(c.brightWhite("foo bar"), "[97mfoo bar[39m");
});

test("ansi::bgBlack()", function () {
    equal(c.bgBlack("foo bar"), "[40mfoo bar[49m");
});

test("ansi::bgRed()", function () {
    equal(c.bgRed("foo bar"), "[41mfoo bar[49m");
});

test("ansi::bgGreen()", function () {
    equal(c.bgGreen("foo bar"), "[42mfoo bar[49m");
});

test("ansi::bgYellow()", function () {
    equal(c.bgYellow("foo bar"), "[43mfoo bar[49m");
});

test("ansi::bgBlue()", function () {
    equal(c.bgBlue("foo bar"), "[44mfoo bar[49m");
});

test("ansi::bgMagenta()", function () {
    equal(c.bgMagenta("foo bar"), "[45mfoo bar[49m");
});

test("ansi::bgCyan()", function () {
    equal(c.bgCyan("foo bar"), "[46mfoo bar[49m");
});

test("ansi::bgWhite()", function () {
    equal(c.bgWhite("foo bar"), "[47mfoo bar[49m");
});

test("ansi::bgBrightBlack()", function () {
    equal(c.bgBrightBlack("foo bar"), "[100mfoo bar[49m");
});

test("ansi::bgBrightRed()", function () {
    equal(c.bgBrightRed("foo bar"), "[101mfoo bar[49m");
});

test("ansi::bgBrightGreen()", function () {
    equal(c.bgBrightGreen("foo bar"), "[102mfoo bar[49m");
});

test("ansi::bgBrightYellow()", function () {
    equal(c.bgBrightYellow("foo bar"), "[103mfoo bar[49m");
});

test("ansi::bgBrightBlue()", function () {
    equal(c.bgBrightBlue("foo bar"), "[104mfoo bar[49m");
});

test("ansi::bgBrightMagenta()", function () {
    equal(c.bgBrightMagenta("foo bar"), "[105mfoo bar[49m");
});

test("ansi::bgBrightCyan()", function () {
    equal(c.bgBrightCyan("foo bar"), "[106mfoo bar[49m");
});

test("ansi::bgBrightWhite()", function () {
    equal(c.bgBrightWhite("foo bar"), "[107mfoo bar[49m");
});

test("ansi::rgb8() handles clamp", function () {
    equal(c.rgb8("foo bar", -10), "[38;5;0mfoo bar[39m");
});

test("ansi::rgb8() handles truncate", function () {
    equal(c.rgb8("foo bar", 42.5), "[38;5;42mfoo bar[39m");
});

test("ansi::test rgb8", function () {
    equal(c.rgb8("foo bar", 42), "[38;5;42mfoo bar[39m");
});

test("ansi::bgRgb8()", function () {
    equal(c.bgRgb8("foo bar", 42), "[48;5;42mfoo bar[49m");
});

test("ansi::rgb24()", function () {
    equal(
        c.rgb24("foo bar", {
            r: 41,
            g: 42,
            b: 43,
        }),
        "[38;2;41;42;43mfoo bar[39m",
    );
});

test("ansi::rgb24() handles number", function () {
    equal(c.rgb24("foo bar", 0x070809), "[38;2;7;8;9mfoo bar[39m");
});

test("ansi::bgRgb24()", function () {
    equal(
        c.bgRgb24("foo bar", {
            r: 41,
            g: 42,
            b: 43,
        }),
        "[48;2;41;42;43mfoo bar[49m",
    );
});

test("ansi::bgRgb24() handles number", function () {
    equal(c.bgRgb24("foo bar", 0x070809), "[48;2;7;8;9mfoo bar[49m");
});

// https://github.com/chalk/strip-ansi/blob/2b8c961e75760059699373f9a69101065c3ded3a/test.js#L4-L6
test("ansi::stripAnsiCode()", function () {
    equal(
        c.stripAnsiCode(
            "\u001B[0m\u001B[4m\u001B[42m\u001B[31mfoo\u001B[39m\u001B[49m\u001B[24mfoo\u001B[0m",
        ),
        "foofoo",
    );
});
