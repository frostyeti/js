import { test } from "node:test";
import { ok } from "@frostyeti/assert";
import { gid } from "./gid.ts";
import { WIN } from "./globals.ts";

test("fs::gid returns number when not on windows", { skip: WIN }, () => {
    const g = gid();
    ok(g !== undefined && g !== null && g > -1);
});
