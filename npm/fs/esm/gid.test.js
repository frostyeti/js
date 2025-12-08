import { test } from "node:test";
import { ok } from "@frostyeti/assert";
import { gid } from "./gid.js";
import { WIN } from "./globals.js";
test("fs::gid returns number when not on windows", { skip: WIN }, () => {
  const g = gid();
  ok(g !== undefined && g !== null && g > -1);
});
