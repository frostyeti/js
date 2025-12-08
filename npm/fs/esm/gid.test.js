import { test } from "node:test";
import { ok } from "@frostyeti/assert";
import { gid } from "./gid.js";
import { WIN } from "./globals.js";
const gb = globalThis;
test("fs::gid returns number when not on windows", (t) => {
  if (WIN) {
    if (gb.Bun) {
      ok(
        true,
        "Skipping test: Bun does not support nested tests using node:test, including the skip",
      );
      return;
    }
    t.skip("Skipping test: gid is not supported on Windows");
    return;
  }
  const g = gid();
  ok(g !== undefined && g !== null && g > -1);
});
