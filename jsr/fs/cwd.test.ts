import { test } from "node:test";
import { ok } from "@frostyeti/assert";
import { cwd } from "./cwd.ts";

test("fs::cwd is not empty", () => {
    ok(cwd() !== "");
});
