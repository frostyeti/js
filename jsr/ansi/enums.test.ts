import { test } from "node:test";
import { equal } from "@frostyeti/assert";
import { AnsiLogLevels, AnsiModes } from "./enums.ts";

test("ansi::AnsiModes.constants", () => {
    equal(AnsiModes.Auto, -1);
    equal(AnsiModes.None, 0);
    equal(AnsiModes.ThreeBit, 1);
    equal(AnsiModes.FourBit, 2);
    equal(AnsiModes.EightBit, 4);
    equal(AnsiModes.TwentyFourBit, 8);
});

test("ansi::AnsiModes.names", () => {
    const names = AnsiModes.names();
    equal(names, ["auto", "none", "3bit", "4bit", "8bit", "24bit"]);
});

test("ansi::AnsiModes.values", () => {
    const values = AnsiModes.values();
    equal(values, [-1, 0, 1, 2, 4, 8]);
});

test("ansi::AnsiModes.toValue", () => {
    equal(AnsiModes.toValue("auto"), -1);
    equal(AnsiModes.toValue("Auto"), -1);
    equal(AnsiModes.toValue("none"), 0);
    equal(AnsiModes.toValue("3bit"), 1);
    equal(AnsiModes.toValue("4bit"), 2);
    equal(AnsiModes.toValue("8bit"), 4);
    equal(AnsiModes.toValue("24bit"), 8);
    equal(AnsiModes.toValue("invalid"), -1);
});

test("ansi::AnsiModes.toString", () => {
    equal(AnsiModes.toString(-1), "auto");
    equal(AnsiModes.toString(0), "none");
    equal(AnsiModes.toString(1), "3bit");
    equal(AnsiModes.toString(2), "4bit");
    equal(AnsiModes.toString(4), "8bit");
    equal(AnsiModes.toString(8), "24bit");
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
