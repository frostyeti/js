// Copyright 2018-2026 the Deno authors. MIT license.
import { test } from "node:test";
import { equal, notEqual } from "@frostyeti/assert";
import { umask } from "./umask.ts";
import { platform } from "node:os";

test("umask() changes current mask", { skip: platform() === "win32" }, () => {
    const initialMask = umask(0o77);
    const updatedMask0 = umask(0o22);
    const updatedMask1 = umask();

    notEqual(updatedMask0, initialMask);
    equal(updatedMask0, 0o77);
    equal(updatedMask1, 0o22);
});
