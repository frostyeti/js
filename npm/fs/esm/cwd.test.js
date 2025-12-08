import { test } from "node:test";
import { ok } from "@frostyeti/assert";
import { cwd } from "./cwd.js";
test("fs::cwd is not empty", () => {
  ok(cwd() !== "");
});
