import { test } from "node:test";
import { ok } from "@frostyeti/assert";
import { CI, CI_DRIVER } from "./driver.js";
import {
  command,
  endGroup,
  // error,
  ok as k,
  registerSecret,
  startGroup,
  // warn,
  writeLine,
} from "./log.js";
test("Test", () => {
  const myValue = "tes";
  registerSecret(myValue);
  startGroup("Test Group");
  writeLine("This is a test log message with a secret: " + myValue);
  // error("This is an error message with a secret: " + myValue);
  // warn("This is a warning message with a secret: " + myValue);
  k(`This is an ok message with a secret: ${myValue}`);
  command("my-command", [" test ", "example", "two", "my test value"]);
  endGroup();
});
test("ci-env:: CI_DRIVER and CI is set", () => {
  ok(CI_DRIVER !== undefined, "CI_DRIVER is undefined");
  ok(CI !== undefined, "CI is undefined");
});
