import { test } from "node:test";
import { ok } from "@frostyeti/assert";
import { endsWith, endsWithFold } from "./ends_with.js";
test("strings::endsWithFold", () => {
  ok(endsWithFold("sdfsdf Hello", "hello"));
  ok(endsWithFold("Hello", "HELLO"));
  ok(endsWithFold("Hello", "lo"));
  ok(!endsWithFold("Hello", "H"));
  ok(endsWithFold("Hello", "O"));
});
test("strings::endsWith", () => {
  ok(endsWith("sdfsdf Hello", "Hello"));
  ok(!endsWith("Hello", "HELLO"));
  ok(endsWith("Hello", "lo"));
  ok(!endsWith("Hello", "H"));
  ok(endsWith("Hello", "o"));
  ok(!endsWith("Hello", "e"));
});
