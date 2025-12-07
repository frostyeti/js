import { test } from "node:test";
import { ok } from "@frostyeti/assert";
import { equal, equalFold } from "./equal.js";
test("strings::equalFold", () => {
  ok(equalFold("Hello", "hello"));
  ok(equalFold("Hello", "HELLO"));
});
test("strings::equal", () => {
  ok(equal("Hello", "Hello"));
  ok(!equal("Hello", "HELLO"));
});
