import { test } from "node:test";
import { equal, ok } from "@frostyeti/assert";
import { popd } from "./popd.ts";
import { pushd } from "./pushd.ts";

test("process::popd and pushd", () => {
    const dir = "..";
    pushd(dir);
    const dir2 = popd();
    ok(dir2);
    equal(dir, dir2);
    equal(dir, "..");
    equal(popd(), undefined);
});
