import { test } from "node:test";
import { equal, ok } from "@frostyeti/assert";
import { equalFold, simpleFold } from "./simple_fold.js";
test("chars::simpleFold", () => {
  equal(simpleFold(0x0041), 0x0061);
  equal(simpleFold(0x0061), 0x0041);
  equal(simpleFold(0x00B5), 0x039C);
  equal(simpleFold(0x039C), 0x03BC);
  equal(simpleFold(0x03BC), 0x00B5);
  equal(simpleFold(0x1F600), 0x1F600);
  equal(simpleFold(0x1F600), 0x1F600);
  equal(simpleFold(0x1F600), 0x1F600);
  equal(simpleFold(0x1F600), 0x1F600);
  equal(simpleFold(0x1F600), 0x1F600);
  equal(simpleFold(0x1F600), 0x1F600);
  equal(simpleFold(0x1F600), 0x1F600);
  equal(simpleFold(0x1F600), 0x1F600);
  equal(simpleFold(0x1F600), 0x1F600);
  equal(simpleFold(0x1F600), 0x1F600);
  equal(simpleFold(0x1F600), 0x1F600);
});
test("chars::equalFold", () => {
  ok(equalFold(0x0041, 0x0061));
  ok(equalFold(0x0061, 0x0041));
  ok(equalFold(0x00B5, 0x039C));
  ok(equalFold(0x039C, 0x03BC));
  ok(equalFold(0x03BC, 0x00B5));
});
