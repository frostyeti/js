import { test } from "node:test";
import { ok } from "@frostyeti/assert";
import { pid } from "./pid.ts";
import { globals } from "@frostyeti/globals";

test("process::pid", () => {
    if (globals.Deno || globals.process) {
        ok(pid > 0);
    } else {
        ok(pid === 0);
    }
});
