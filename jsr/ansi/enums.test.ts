import { test } from "node:test";
import { equal } from "@frostyeti/assert";
import { AnsiLogLevels, AnsiModes } from "./enums.ts";

test("ansi::AnsiModes.constants", () => {
    equal(AnsiModes.Auto, -1);
    equal(AnsiModes.None, 0);
    equal(AnsiModes.ThreeBit, 3);
    equal(AnsiModes.FourBit, 4);
    equal(AnsiModes.EightBit, 8);
    equal(AnsiModes.TwentyFourBit, 24);
});

test("ansi::AnsiModes.names", () => {
    const names = AnsiModes.names();
    equal(names, ["auto", "none", "3bit", "xterm-16color", "xterm-256color", "truecolor"]);
});

test("ansi::AnsiModes.values", () => {
    const values = AnsiModes.values();
    equal(values, [-1, 0, 3, 4, 8, 24]);
});

test("ansi::AnsiModes.toValue", () => {
    equal(AnsiModes.toValue("auto"), -1);
    equal(AnsiModes.toValue("Auto"), -1);
    equal(AnsiModes.toValue("none"), 0);
    equal(AnsiModes.toValue("3bit"), 3);
    equal(AnsiModes.toValue("4bit"), 4);
    equal(AnsiModes.toValue("8bit"), 8);
    equal(AnsiModes.toValue("24bit"), 24);
    equal(AnsiModes.toValue("truecolor"), 24);
    equal(AnsiModes.toValue("xterm-256color"), 8);
    equal(AnsiModes.toValue("xterm-16color"), 4);
    equal(AnsiModes.toValue("invalid"), -1);
});

test("ansi::AnsiModes.toString", () => {
    equal(AnsiModes.toString(-1), "auto");
    equal(AnsiModes.toString(0), "none");
    equal(AnsiModes.toString(3), "3bit");
    equal(AnsiModes.toString(4), "xterm-16color");
    equal(AnsiModes.toString(8), "xterm-256color");
    equal(AnsiModes.toString(24), "truecolor");
    equal(AnsiModes.toString(999), "auto");
});

test("ansi::AnsiLogLevels.constants", () => {
    equal(AnsiLogLevels.None, 0);
    equal(AnsiLogLevels.Critical, 2);
    equal(AnsiLogLevels.Error, 3);
    equal(AnsiLogLevels.Warning, 4);
    equal(AnsiLogLevels.Notice, 5);
    equal(AnsiLogLevels.Information, 6);
    equal(AnsiLogLevels.Debug, 7);
    equal(AnsiLogLevels.Trace, 8);
});

test("ansi::AnsiLogLevels.names", () => {
    const names = AnsiLogLevels.names();
    equal(names, [
        "none",
        "critical",
        "error",
        "warning",
        "notice",
        "information",
        "debug",
        "trace",
    ]);
});

test("ansi::AnsiLogLevels.values", () => {
    const values = AnsiLogLevels.values();
    equal(values, [0, 2, 3, 4, 5, 6, 7, 8]);
});

test("ansi::AnsiLogLevels.toValue", () => {
    equal(AnsiLogLevels.toValue("none"), 0);
    equal(AnsiLogLevels.toValue("critical"), 2);
    equal(AnsiLogLevels.toValue("error"), 3);
    equal(AnsiLogLevels.toValue("warning"), 4);
    equal(AnsiLogLevels.toValue("notice"), 5);
    equal(AnsiLogLevels.toValue("information"), 6);
    equal(AnsiLogLevels.toValue("debug"), 7);
    equal(AnsiLogLevels.toValue("trace"), 8);
    equal(AnsiLogLevels.toValue("invalid"), 4);
});

test("ansi::AnsiLogLevels.toString", () => {
    equal(AnsiLogLevels.toString(0), "none");
    equal(AnsiLogLevels.toString(2), "critical");
    equal(AnsiLogLevels.toString(3), "error");
    equal(AnsiLogLevels.toString(4), "warning");
    equal(AnsiLogLevels.toString(5), "notice");
    equal(AnsiLogLevels.toString(6), "information");
    equal(AnsiLogLevels.toString(7), "debug");
    equal(AnsiLogLevels.toString(8), "trace");
    equal(AnsiLogLevels.toString(-1), "");
});

// Additional AnsiModes tests
test("ansi::AnsiModes.toValue with terminal emulators", () => {
    equal(AnsiModes.toValue("kitty"), 24);
    equal(AnsiModes.toValue("alacritty"), 24);
    equal(AnsiModes.toValue("wezterm"), 24);
    equal(AnsiModes.toValue("iTerm2"), 24);
    equal(AnsiModes.toValue("ghostty"), 24);
    equal(AnsiModes.toValue("windows-terminal"), 24);
    equal(AnsiModes.toValue("hyper"), 24);
    equal(AnsiModes.toValue("terminology"), 24);
    equal(AnsiModes.toValue("mintty"), 24);
});

test("ansi::AnsiModes.toValue with no-color variants", () => {
    equal(AnsiModes.toValue("no"), 0);
    equal(AnsiModes.toValue("false"), 0);
    equal(AnsiModes.toValue("off"), 0);
    equal(AnsiModes.toValue("no-color"), 0);
    equal(AnsiModes.toValue("nocolor"), 0);
    equal(AnsiModes.toValue("NONE"), 0);
    equal(AnsiModes.toValue("0"), 0);
});

test("ansi::AnsiModes.toValue with TERM values", () => {
    equal(AnsiModes.toValue("vt100"), 4);
    equal(AnsiModes.toValue("vt200"), 4);
    equal(AnsiModes.toValue("screen"), 4);
    equal(AnsiModes.toValue("linux"), 4);
    equal(AnsiModes.toValue("cygwin"), 4);
    equal(AnsiModes.toValue("ansi"), 4);
});

test("ansi::AnsiModes.toValue with 256 color variants", () => {
    equal(AnsiModes.toValue("256color"), 8);
    equal(AnsiModes.toValue("screen-256color"), 8);
    equal(AnsiModes.toValue("256"), 8);
});

test("ansi::AnsiModes.toValue with true color variants", () => {
    equal(AnsiModes.toValue("true"), 24);
    equal(AnsiModes.toValue("full"), 24);
    equal(AnsiModes.toValue("TrueColor"), 24);
    equal(AnsiModes.toValue("true-color"), 24);
    equal(AnsiModes.toValue("xterm-truecolor"), 24);
    equal(AnsiModes.toValue("gnome-terminal"), 24);
});

test("ansi::AnsiModes.equals with same values", () => {
    equal(AnsiModes.equals(AnsiModes.None, 0), true);
    equal(AnsiModes.equals(AnsiModes.FourBit, 4), true);
    equal(AnsiModes.equals(AnsiModes.EightBit, 8), true);
    equal(AnsiModes.equals(AnsiModes.TwentyFourBit, 24), true);
});

test("ansi::AnsiModes.equals with strings", () => {
    equal(AnsiModes.equals(AnsiModes.None, "none"), true);
    equal(AnsiModes.equals(AnsiModes.FourBit, "4bit"), true);
    equal(AnsiModes.equals(AnsiModes.EightBit, "8bit"), true);
    equal(AnsiModes.equals(AnsiModes.TwentyFourBit, "truecolor"), true);
});

test("ansi::AnsiModes.equals with different values", () => {
    equal(AnsiModes.equals(AnsiModes.None, 4), false);
    equal(AnsiModes.equals(AnsiModes.FourBit, 8), false);
    equal(AnsiModes.equals(AnsiModes.EightBit, 24), false);
});

test("ansi::AnsiModes.equals with AnsiMode values", () => {
    equal(AnsiModes.equals(AnsiModes.Auto, AnsiModes.Auto), true);
    equal(AnsiModes.equals(AnsiModes.None, AnsiModes.None), true);
    equal(AnsiModes.equals(AnsiModes.FourBit, AnsiModes.EightBit), false);
});

// Additional AnsiLogLevels tests
test("ansi::AnsiLogLevels.toValue with aliases", () => {
    equal(AnsiLogLevels.toValue("fatal"), 2);
    equal(AnsiLogLevels.toValue("Fatal"), 2);
    equal(AnsiLogLevels.toValue("warn"), 4);
    equal(AnsiLogLevels.toValue("Warn"), 4);
    equal(AnsiLogLevels.toValue("info"), 6);
    equal(AnsiLogLevels.toValue("Info"), 6);
});

test("ansi::AnsiLogLevels.toValue with capitalized names", () => {
    equal(AnsiLogLevels.toValue("None"), 0);
    equal(AnsiLogLevels.toValue("Critical"), 2);
    equal(AnsiLogLevels.toValue("Error"), 3);
    equal(AnsiLogLevels.toValue("Warning"), 4);
    equal(AnsiLogLevels.toValue("Notice"), 5);
    equal(AnsiLogLevels.toValue("Information"), 6);
    equal(AnsiLogLevels.toValue("Debug"), 7);
    equal(AnsiLogLevels.toValue("Trace"), 8);
});

test("ansi::AnsiLogLevels numeric comparison", () => {
    equal(AnsiLogLevels.None < AnsiLogLevels.Critical, true);
    equal(AnsiLogLevels.Critical < AnsiLogLevels.Error, true);
    equal(AnsiLogLevels.Error < AnsiLogLevels.Warning, true);
    equal(AnsiLogLevels.Warning < AnsiLogLevels.Notice, true);
    equal(AnsiLogLevels.Notice < AnsiLogLevels.Information, true);
    equal(AnsiLogLevels.Information < AnsiLogLevels.Debug, true);
    equal(AnsiLogLevels.Debug < AnsiLogLevels.Trace, true);
});
