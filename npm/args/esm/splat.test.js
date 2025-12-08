import { test } from "node:test";
import { equal } from "@frostyeti/assert";
import { splat, SplatSymbols } from "./splat.js";
import { getGlobal } from "@frostyeti/globals";
const DEBUG = getGlobal("process.env.DEBUG") === "true";
test("args::splat", () => {
  const args = splat({
    "version": true,
    splat: {
      prefix: "--",
    },
  });
  equal(args.length, 1);
  equal(args[0], "--version");
});
test("args::splat with assign", () => {
  const args = splat({
    "foo": "bar",
    splat: {
      assign: "=",
    },
  });
  equal(args.length, 1);
  equal(args[0], "--foo=bar");
});
test("args::splat with preserveCase", () => {
  const args = splat({
    "fooBar": "baz",
    splat: {
      preserveCase: true,
    },
  });
  equal(args.length, 2);
  equal(args[0], "--fooBar");
  equal(args[1], "baz");
});
test("args::splat with shortFlag", () => {
  const args = splat({
    "f": "bar",
    splat: {
      shortFlag: true,
    },
  });
  equal(args.length, 2);
  equal(args[0], "-f");
  equal(args[1], "bar");
});
test("args::splat with shortFlag and prefix", () => {
  const args = splat({
    "f": "bar",
    splat: {
      shortFlag: true,
    },
  });
  equal(args.length, 2);
  equal(args[0], "-f");
  equal(args[1], "bar");
});
test("args::splat with boolean short flag", () => {
  const args = splat({
    "f": true,
    splat: {
      shortFlag: true,
    },
  });
  equal(args.length, 1);
  equal(args[0], "-f");
});
test("args::splat with command array", () => {
  const args = splat({
    "foo": "bar",
    splat: {
      command: ["git", "clone"],
    },
  });
  if (DEBUG) {
    console.log(args);
  }
  equal(args.length, 4);
  equal(args[0], "git");
  equal(args[1], "clone");
  equal(args[2], "--foo");
  equal(args[3], "bar");
});
test("args::splat with command string", () => {
  const args = splat({
    "foo": "bar",
    splat: {
      command: "git clone",
    },
  });
  if (DEBUG) {
    console.log(args);
  }
  equal(args.length, 4);
  equal(args[0], "git");
  equal(args[1], "clone");
  equal(args[2], "--foo");
  equal(args[3], "bar");
});
test("args::splat with command symbol string", () => {
  const args = splat({
    "foo": "bar",
    [SplatSymbols.command]: "git clone",
  });
  if (DEBUG) {
    console.log(args);
  }
  equal(args.length, 4);
  equal(args[0], "git");
  equal(args[1], "clone");
  equal(args[2], "--foo");
  equal(args[3], "bar");
});
test("args::splat with command symbol array", () => {
  const args = splat({
    "foo": "bar",
    [SplatSymbols.command]: ["git", "clone"],
  });
  if (DEBUG) {
    console.log(args);
  }
  equal(args.length, 4);
  equal(args[0], "git");
  equal(args[1], "clone");
  equal(args[2], "--foo");
  equal(args[3], "bar");
});
test("args::splat with arguments", () => {
  const args = splat({
    "foo": "bar",
    splat: {
      argumentNames: ["foo"],
    },
  });
  equal(args.length, 1);
  equal(args[0], "bar");
});
test("args::splat with symbol argument names", () => {
  const args = splat({
    "foo": "bar",
    [SplatSymbols.argNames]: ["foo"],
  });
  equal(args.length, 1);
  equal(args[0], "bar");
});
test("args::splat with symbol arguments", () => {
  const args = splat({
    [SplatSymbols.args]: ["foo", "bar"],
    "foo": "bar",
  });
  equal(args.length, 4);
  equal(args[0], "foo");
  equal(args[1], "bar");
  equal(args[2], "--foo");
  equal(args[3], "bar");
});
test("args::splat with appended arguments", () => {
  const args = splat({
    "foo": "bar",
    "test": "baz",
    splat: {
      argumentNames: ["foo"],
      appendArguments: true,
    },
  });
  equal(args.length, 3);
  equal(args[0], "--test");
  equal(args[1], "baz");
  equal(args[2], "bar");
});
test("args::splat with symbol appended arguments", () => {
  const args = splat({
    [SplatSymbols.args]: ["bar"],
    "test": "baz",
    splat: {
      appendArguments: true,
    },
  });
  equal(args.length, 3);
  equal(args[0], "--test");
  equal(args[1], "baz");
  equal(args[2], "bar");
});
test("args::splat with symbol remaining args", () => {
  const args = splat({
    [SplatSymbols.remainingArgs]: ["bar"],
    "test": "baz",
  });
  equal(args.length, 3);
  equal(args[0], "--test");
  equal(args[1], "baz");
  equal(args[2], "bar");
});
test("args::splat with remaining args", () => {
  const args = splat({
    ["_"]: ["bar"],
    "test": "baz",
  });
  equal(args.length, 3);
  equal(args[0], "--test");
  equal(args[1], "baz");
  equal(args[2], "bar");
});
test("args::splat: noargs", () => {
  const args = splat({
    "force": true,
    "other": true,
    splat: {
      noargs: ["force"],
    },
  });
  equal(args.length, 3);
  equal(args[0], "--force");
  equal(args[1], "true");
  equal(args[2], "--other");
});
test("args::splat: noargsValues", () => {
  const args = splat({
    "force": false,
    "other": true,
    splat: {
      noargs: ["force"],
      noFlagValues: { t: "1", f: "2" },
    },
  });
  equal(args.length, 3);
  equal(args[0], "--force");
  equal(args[1], "2");
  equal(args[2], "--other");
});
test("args::splat with symbol extra args", () => {
  const args = splat({
    [SplatSymbols.extraArgs]: ["bar", "--flag"],
    "test": "baz",
  });
  equal(args.length, 5);
  equal(args[0], "--test");
  equal(args[1], "baz");
  equal(args[2], "--");
  equal(args[3], "bar");
  equal(args[4], "--flag");
});
test("args::splat with extra args", () => {
  const args = splat({
    ["--"]: ["bar", "--flag"],
    "test": "baz",
  });
  equal(args.length, 5);
  equal(args[0], "--test");
  equal(args[1], "baz");
  equal(args[2], "--");
  equal(args[3], "bar");
  equal(args[4], "--flag");
});
test("args::splat with positional args", () => {
  const args = splat({
    "*": ["one", "two"],
    "test": "baz",
  });
  equal(args.length, 4);
  equal(args[0], "one");
  equal(args[1], "two");
  equal(args[2], "--test");
  equal(args[3], "baz");
});
