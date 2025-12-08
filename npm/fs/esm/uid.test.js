import { test } from "node:test";
import { equal } from "@frostyeti/assert";
import { uid } from "./uid.js";
import { globals } from "./globals.js";
// deno-lint-ignore no-explicit-any
const g = globals;
test("fs::uid returns number when Deno.uid exists", () => {
  const { Deno: od, process: proc } = globals;
  delete g["Deno"];
  delete g["process"];
  try {
    g.Deno = {
      uid: () => 1000,
    };
    equal(uid(), 1000);
  } finally {
    g.Deno = od;
    g.process = proc;
  }
});
test("fs::uid returns number when process.getuid exists", () => {
  const { Deno: od, process: proc } = globals;
  delete g["Deno"];
  delete g["process"];
  try {
    g.process = {
      getuid: () => 1000,
    };
    equal(uid(), 1000);
  } finally {
    g.Deno = od;
    g.process = proc;
  }
});
test("fs::uid returns null when process.getuid returns -1", () => {
  const { Deno: od, process: proc } = globals;
  delete g["Deno"];
  delete g["process"];
  try {
    g.process = {
      getuid: () => -1,
    };
    equal(uid(), null);
  } finally {
    g.Deno = od;
    g.process = proc;
  }
});
test("fs::uid returns null when process.getuid returns undefined", () => {
  const { Deno: od, process: proc } = globals;
  delete g["Deno"];
  delete g["process"];
  try {
    g.process = {
      getuid: () => undefined,
    };
    equal(uid(), null);
  } finally {
    g.Deno = od;
    g.process = proc;
  }
});
test("fs::uid returns null when no runtime is available", () => {
  const { Deno: od, process: proc } = globals;
  delete g["Deno"];
  delete g["process"];
  try {
    equal(uid(), null);
  } finally {
    g.Deno = od;
    g.process = proc;
  }
});
