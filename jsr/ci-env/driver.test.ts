import { test } from "node:test";
import { ok } from "@frostyeti/assert";
import { CI, CI_DRIVER } from "./driver.ts";

test("ci-env:: CI_DRIVER and CI is set", () => {
    ok(CI_DRIVER !== undefined, "CI_DRIVER is undefined");
    ok(CI !== undefined, "CI is undefined");
});
