import { test } from "node:test";
import { equal } from "@frostyeti/assert";
import { join, resolve } from "@frostyeti/path";
import { chdir } from "./chdir.ts";
import { cwd } from "./cwd.ts";

test("process::chdir and cwd", () => {
    const pwd = cwd();
    const dir = resolve(join(pwd, ".."));
    equal(pwd, cwd());
    equal(chdir(dir), undefined);
    equal(cwd(), dir);
    chdir(pwd);
});
