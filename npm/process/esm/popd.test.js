import { test } from "node:test";
import { equal, ok } from "@frostyeti/assert";
import { popd } from "./popd.js";
import { pushd } from "./pushd.js";
import { cwd } from "./cwd.js";
import { chdir } from "./chdir.js";
import { history } from "./history.js";
// =============================================================================
// Basic functionality tests
// =============================================================================
test("process::pushd adds to history and changes directory", () => {
  const original = cwd();
  pushd("..");
  ok(history.length > 0);
  // Restore
  popd();
  chdir(original);
});
test("process::popd returns undefined on empty history", () => {
  // Clear history first
  while (history.length > 0) {
    history.pop();
  }
  const result = popd();
  equal(result, undefined);
});
test("process::pushd and popd work together", () => {
  const original = cwd();
  // Clear history
  while (history.length > 0) {
    history.pop();
  }
  pushd("..");
  const dir = popd();
  ok(dir);
  equal(dir, "..");
  // Restore
  chdir(original);
});
// =============================================================================
// Stack behavior tests
// =============================================================================
test("process::pushd maintains LIFO order", () => {
  const original = cwd();
  // Clear history
  while (history.length > 0) {
    history.pop();
  }
  pushd("..");
  pushd(".");
  const second = popd();
  const first = popd();
  equal(second, ".");
  equal(first, "..");
  // Restore
  chdir(original);
});
test("process::multiple pushd increases history length", () => {
  // Clear history
  while (history.length > 0) {
    history.pop();
  }
  const initialLength = history.length;
  pushd(".");
  pushd(".");
  pushd(".");
  equal(history.length, initialLength + 3);
  // Clean up
  popd();
  popd();
  popd();
});
// =============================================================================
// Edge case tests
// =============================================================================
test("process::popd on empty stack returns undefined", () => {
  // Clear history
  while (history.length > 0) {
    history.pop();
  }
  equal(popd(), undefined);
  equal(popd(), undefined);
});
test("process::pushd with current directory", () => {
  const original = cwd();
  pushd(".");
  const dir = popd();
  equal(dir, ".");
  // Should still be in original directory
  chdir(original);
});
