import { test } from "node:test";
import { ok, equal } from "@frostyeti/assert";
import { pid } from "./pid.ts";
import { globals } from "@frostyeti/globals";

// =============================================================================
// Basic functionality tests
// =============================================================================

test("process::pid is a number", () => {
    equal(typeof pid, "number");
});

test("process::pid is positive in runtime environments", () => {
    if (globals.Deno || globals.process) {
        ok(pid > 0, `Expected positive pid but got ${pid}`);
    } else {
        ok(pid === 0, "Browser environment should have pid 0");
    }
});

test("process::pid is an integer", () => {
    ok(Number.isInteger(pid), `Expected integer pid but got ${pid}`);
});

test("process::pid is consistent across reads", () => {
    const pid1 = pid;
    const pid2 = pid;
    equal(pid1, pid2);
});

test("process::pid is not NaN", () => {
    ok(!Number.isNaN(pid), "pid should not be NaN");
});

test("process::pid is finite", () => {
    ok(Number.isFinite(pid), "pid should be finite");
});
