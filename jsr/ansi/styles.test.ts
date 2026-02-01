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

// Unicode and emoji tests
test("ansi::red() with accented characters", function () {
    equal(c.red("café naïve"), "\x1b[31mcafé naïve\x1b[39m");
});

test("ansi::red() with German umlauts", function () {
    equal(c.red("Größe über"), "\x1b[31mGröße über\x1b[39m");
});

test("ansi::red() with Greek letters", function () {
    equal(c.red("αβγδ"), "\x1b[31mαβγδ\x1b[39m");
});

test("ansi::red() with Cyrillic letters", function () {
    equal(c.red("привет мир"), "\x1b[31mпривет мир\x1b[39m");
});

test("ansi::red() with emoji", function () {
    equal(c.red("🎉🚀🌟"), "\x1b[31m🎉🚀🌟\x1b[39m");
});

test("ansi::red() with CJK characters", function () {
    equal(c.red("你好世界"), "\x1b[31m你好世界\x1b[39m");
});

test("ansi::bold() with emoji", function () {
    equal(c.bold("Hello 🌍 World"), "\x1b[1mHello 🌍 World\x1b[22m");
});

test("ansi::italic() with unicode", function () {
    equal(c.italic("Ñoño café"), "\x1b[3mÑoño café\x1b[23m");
});

test("ansi::underline() with emoji", function () {
    equal(c.underline("⚡ Lightning"), "\x1b[4m⚡ Lightning\x1b[24m");
});

test("ansi::strikethrough() with CJK", function () {
    equal(c.strikethrough("日本語テスト"), "\x1b[9m日本語テスト\x1b[29m");
});

test("ansi::bgRed() with emoji", function () {
    equal(c.bgRed("🔥 Fire"), "\x1b[41m🔥 Fire\x1b[49m");
});

test("ansi::apply() with multiple styles", function () {
    equal(c.apply("test", c.bold, c.red, c.bgBlue), "\x1b[44m\x1b[31m\x1b[1mtest\x1b[22m\x1b[39m\x1b[49m");
});

test("ansi::apply() with unicode", function () {
    equal(c.apply("🎨 Art", c.bold, c.cyan), "\x1b[36m\x1b[1m🎨 Art\x1b[22m\x1b[39m");
});

test("ansi::apply() with empty styles array", function () {
    equal(c.apply("test"), "test");
});

test("ansi::rgb8() with unicode", function () {
    equal(c.rgb8("🌈 Rainbow", 42), "\x1b[38;5;42m🌈 Rainbow\x1b[39m");
});

test("ansi::rgb8() boundary values", function () {
    equal(c.rgb8("test", 0), "\x1b[38;5;0mtest\x1b[39m");
    equal(c.rgb8("test", 255), "\x1b[38;5;255mtest\x1b[39m");
    equal(c.rgb8("test", 256), "\x1b[38;5;255mtest\x1b[39m");
    equal(c.rgb8("test", -1), "\x1b[38;5;0mtest\x1b[39m");
});

test("ansi::bgRgb8() boundary values", function () {
    equal(c.bgRgb8("test", 0), "\x1b[48;5;0mtest\x1b[49m");
    equal(c.bgRgb8("test", 255), "\x1b[48;5;255mtest\x1b[49m");
});

test("ansi::rgb24() with unicode", function () {
    equal(
        c.rgb24("🔵 Blue", { r: 0, g: 100, b: 255 }),
        "\x1b[38;2;0;100;255m🔵 Blue\x1b[39m",
    );
});

test("ansi::rgb24() boundary RGB values", function () {
    equal(c.rgb24("test", { r: 0, g: 0, b: 0 }), "\x1b[38;2;0;0;0mtest\x1b[39m");
    equal(c.rgb24("test", { r: 255, g: 255, b: 255 }), "\x1b[38;2;255;255;255mtest\x1b[39m");
});

test("ansi::rgb24() clamps out of range values", function () {
    equal(c.rgb24("test", { r: -10, g: 300, b: 128 }), "\x1b[38;2;0;255;128mtest\x1b[39m");
});

test("ansi::bgRgb24() with unicode", function () {
    equal(
        c.bgRgb24("🟢 Green", { r: 0, g: 255, b: 0 }),
        "\x1b[48;2;0;255;0m🟢 Green\x1b[49m",
    );
});

test("ansi::rgb24To8() with number", function () {
    const result = c.rgb24To8("test", 0xff0000);
    equal(result.includes("\x1b[38;5;"), true);
});

test("ansi::rgb24To8() with low color number", function () {
    equal(c.rgb24To8("test", 42), "\x1b[38;5;42mtest\x1b[39m");
});

test("ansi::rgb24To8() with RGB object", function () {
    const result = c.rgb24To8("test", { r: 255, g: 0, b: 0 });
    equal(result.includes("\x1b[38;5;"), true);
});

test("ansi::stripAnsiCode() with complex sequences", function () {
    const styled = c.bold(c.red(c.bgBlue("test")));
    equal(c.stripAnsiCode(styled), "test");
});

test("ansi::stripAnsiCode() with unicode", function () {
    const styled = c.red("🎉 Hello 世界");
    equal(c.stripAnsiCode(styled), "🎉 Hello 世界");
});

test("ansi::stripAnsiCode() with plain text", function () {
    equal(c.stripAnsiCode("no codes here"), "no codes here");
});

test("ansi::stripAnsiCode() with empty string", function () {
    equal(c.stripAnsiCode(""), "");
});

test("ansi::nested styles", function () {
    const nested = c.red(c.bold(c.underline("nested")));
    equal(nested, "\x1b[31m\x1b[1m\x1b[4mnested\x1b[24m\x1b[22m\x1b[39m");
});

test("ansi::deeply nested styles with unicode", function () {
    const nested = c.bgBlue(c.bold(c.italic(c.yellow("🌟 Star"))));
    equal(nested, "\x1b[44m\x1b[1m\x1b[3m\x1b[33m🌟 Star\x1b[39m\x1b[23m\x1b[22m\x1b[49m");
});

test("ansi::color disabled returns plain text", function () {
    c.setColorEnabled(false);
    equal(c.red("test"), "test");
    equal(c.bold("test"), "test");
    equal(c.bgBlue("test"), "test");
    equal(c.rgb8("test", 42), "test");
    equal(c.rgb24("test", 0xff0000), "test");
    c.setColorEnabled(true);
});

test("ansi::color disabled with unicode", function () {
    c.setColorEnabled(false);
    equal(c.red("🎉 Party"), "🎉 Party");
    equal(c.bold("日本語"), "日本語");
    c.setColorEnabled(true);
});

test("ansi::empty string handling", function () {
    equal(c.red(""), "\x1b[31m\x1b[39m");
    equal(c.bold(""), "\x1b[1m\x1b[22m");
});

test("ansi::special characters in string", function () {
    equal(c.red("hello\nworld"), "\x1b[31mhello\nworld\x1b[39m");
    equal(c.red("hello\tworld"), "\x1b[31mhello\tworld\x1b[39m");
});

test("ansi::reset() with unicode", function () {
    equal(c.reset("日本語"), "\x1b[0m日本語\x1b[0m");
});

test("ansi::all bright colors with short text", function () {
    equal(c.brightBlack("t"), "\x1b[90mt\x1b[39m");
    equal(c.brightRed("t"), "\x1b[91mt\x1b[39m");
    equal(c.brightGreen("t"), "\x1b[92mt\x1b[39m");
    equal(c.brightYellow("t"), "\x1b[93mt\x1b[39m");
    equal(c.brightBlue("t"), "\x1b[94mt\x1b[39m");
    equal(c.brightMagenta("t"), "\x1b[95mt\x1b[39m");
    equal(c.brightCyan("t"), "\x1b[96mt\x1b[39m");
    equal(c.brightWhite("t"), "\x1b[97mt\x1b[39m");
});

test("ansi::all bright background colors with short text", function () {
    equal(c.bgBrightBlack("t"), "\x1b[100mt\x1b[49m");
    equal(c.bgBrightRed("t"), "\x1b[101mt\x1b[49m");
    equal(c.bgBrightGreen("t"), "\x1b[102mt\x1b[49m");
    equal(c.bgBrightYellow("t"), "\x1b[103mt\x1b[49m");
    equal(c.bgBrightBlue("t"), "\x1b[104mt\x1b[49m");
    equal(c.bgBrightMagenta("t"), "\x1b[105mt\x1b[49m");
    equal(c.bgBrightCyan("t"), "\x1b[106mt\x1b[49m");
    equal(c.bgBrightWhite("t"), "\x1b[107mt\x1b[49m");
});

// defineColor and defineBgColor tests
// Orange: 24bit = 0xFF8C00 (255, 140, 0), 256-color = 208, 16-color fallback = yellow
// Purple: 24bit = 0x800080 (128, 0, 128), 256-color = 129, 16-color fallback = magenta

import { AnsiSettings } from "./settings.ts";
import { AnsiModes } from "./enums.ts";

test("ansi::defineColor() returns function", function () {
    const orange = c.defineColor(0xFF8C00, 208, c.yellow);
    equal(typeof orange, "function");
});

test("ansi::defineColor() with truecolor mode", function () {
    const originalMode = AnsiSettings.current.mode;
    AnsiSettings.current.mode = AnsiModes.TwentyFourBit;
    
    const orange = c.defineColor(0xFF8C00, 208, c.yellow);
    equal(orange("test"), "\x1b[38;2;255;140;0mtest\x1b[39m");
    
    AnsiSettings.current.mode = originalMode;
});

test("ansi::defineColor() with 256-color mode", function () {
    const originalMode = AnsiSettings.current.mode;
    AnsiSettings.current.mode = AnsiModes.EightBit;
    
    const orange = c.defineColor(0xFF8C00, 208, c.yellow);
    equal(orange("test"), "\x1b[38;5;208mtest\x1b[39m");
    
    AnsiSettings.current.mode = originalMode;
});

test("ansi::defineColor() with 16-color mode", function () {
    const originalMode = AnsiSettings.current.mode;
    AnsiSettings.current.mode = AnsiModes.FourBit;
    
    const orange = c.defineColor(0xFF8C00, 208, c.yellow);
    equal(orange("test"), "\x1b[33mtest\x1b[39m"); // yellow fallback
    
    AnsiSettings.current.mode = originalMode;
});

test("ansi::defineColor() with no-color mode", function () {
    const originalMode = AnsiSettings.current.mode;
    AnsiSettings.current.mode = AnsiModes.None;
    
    const orange = c.defineColor(0xFF8C00, 208, c.yellow);
    equal(orange("test"), "test");
    
    AnsiSettings.current.mode = originalMode;
});

test("ansi::defineColor() with RGB object", function () {
    const originalMode = AnsiSettings.current.mode;
    AnsiSettings.current.mode = AnsiModes.TwentyFourBit;
    
    const purple = c.defineColor({ r: 128, g: 0, b: 128 }, 129, c.magenta);
    equal(purple("test"), "\x1b[38;2;128;0;128mtest\x1b[39m");
    
    AnsiSettings.current.mode = originalMode;
});

test("ansi::defineColor() with unicode", function () {
    const originalMode = AnsiSettings.current.mode;
    AnsiSettings.current.mode = AnsiModes.TwentyFourBit;
    
    const orange = c.defineColor(0xFF8C00, 208, c.yellow);
    equal(orange("🍊 Orange"), "\x1b[38;2;255;140;0m🍊 Orange\x1b[39m");
    
    AnsiSettings.current.mode = originalMode;
});

test("ansi::defineColor() respects color disabled", function () {
    const originalMode = AnsiSettings.current.mode;
    AnsiSettings.current.mode = AnsiModes.TwentyFourBit;
    c.setColorEnabled(false);
    
    const orange = c.defineColor(0xFF8C00, 208, c.yellow);
    equal(orange("test"), "test");
    
    c.setColorEnabled(true);
    AnsiSettings.current.mode = originalMode;
});

test("ansi::defineBgColor() returns function", function () {
    const bgOrange = c.defineBgColor(0xFF8C00, 208, c.bgYellow);
    equal(typeof bgOrange, "function");
});

test("ansi::defineBgColor() with truecolor mode", function () {
    const originalMode = AnsiSettings.current.mode;
    AnsiSettings.current.mode = AnsiModes.TwentyFourBit;
    
    const bgOrange = c.defineBgColor(0xFF8C00, 208, c.bgYellow);
    equal(bgOrange("test"), "\x1b[48;2;255;140;0mtest\x1b[49m");
    
    AnsiSettings.current.mode = originalMode;
});

test("ansi::defineBgColor() with 256-color mode", function () {
    const originalMode = AnsiSettings.current.mode;
    AnsiSettings.current.mode = AnsiModes.EightBit;
    
    const bgOrange = c.defineBgColor(0xFF8C00, 208, c.bgYellow);
    equal(bgOrange("test"), "\x1b[48;5;208mtest\x1b[49m");
    
    AnsiSettings.current.mode = originalMode;
});

test("ansi::defineBgColor() with 16-color mode", function () {
    const originalMode = AnsiSettings.current.mode;
    AnsiSettings.current.mode = AnsiModes.FourBit;
    
    const bgOrange = c.defineBgColor(0xFF8C00, 208, c.bgYellow);
    equal(bgOrange("test"), "\x1b[43mtest\x1b[49m"); // bgYellow fallback
    
    AnsiSettings.current.mode = originalMode;
});

test("ansi::defineBgColor() with no-color mode", function () {
    const originalMode = AnsiSettings.current.mode;
    AnsiSettings.current.mode = AnsiModes.None;
    
    const bgPurple = c.defineBgColor(0x800080, 129, c.bgMagenta);
    equal(bgPurple("test"), "test");
    
    AnsiSettings.current.mode = originalMode;
});

test("ansi::defineBgColor() with RGB object", function () {
    const originalMode = AnsiSettings.current.mode;
    AnsiSettings.current.mode = AnsiModes.TwentyFourBit;
    
    const bgPurple = c.defineBgColor({ r: 128, g: 0, b: 128 }, 129, c.bgMagenta);
    equal(bgPurple("test"), "\x1b[48;2;128;0;128mtest\x1b[49m");
    
    AnsiSettings.current.mode = originalMode;
});

test("ansi::defineBgColor() with unicode", function () {
    const originalMode = AnsiSettings.current.mode;
    AnsiSettings.current.mode = AnsiModes.TwentyFourBit;
    
    const bgPurple = c.defineBgColor(0x800080, 129, c.bgMagenta);
    equal(bgPurple("test 🍇"), "\x1b[48;2;128;0;128mtest 🍇\x1b[49m");
    
    AnsiSettings.current.mode = originalMode;
});

test("ansi::defineBgColor() respects color disabled", function () {
    const originalMode = AnsiSettings.current.mode;
    AnsiSettings.current.mode = AnsiModes.TwentyFourBit;
    c.setColorEnabled(false);
    
    const bgPurple = c.defineBgColor(0x800080, 129, c.bgMagenta);
    equal(bgPurple("test"), "test");
    
    c.setColorEnabled(true);
    AnsiSettings.current.mode = originalMode;
});

test("ansi::defineColor() and defineBgColor() combined", function () {
    const originalMode = AnsiSettings.current.mode;
    AnsiSettings.current.mode = AnsiModes.TwentyFourBit;
    
    const orange = c.defineColor(0xFF8C00, 208, c.yellow);
    const bgPurple = c.defineBgColor(0x800080, 129, c.bgMagenta);
    
    const styled = bgPurple(orange("Halloween"));
    equal(styled, "\x1b[48;2;128;0;128m\x1b[38;2;255;140;0mHalloween\x1b[39m\x1b[49m");
    
    AnsiSettings.current.mode = originalMode;
});
