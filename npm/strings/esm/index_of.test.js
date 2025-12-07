import { test } from "node:test";
import { equal } from "@frostyeti/assert";
import { indexOf, indexOfFold } from "./index_of.js";
test("strings::indexOfFold", () => {
  equal(indexOfFold("Hello sdf", "hello"), 0);
  equal(0, indexOfFold("Hello", "HELLO"));
  equal(7, indexOfFold("sdfsdf Hello", "hello"));
});
test("strings::indexOf", () => {
  equal(-1, indexOf("Hello sdf", "hello"));
  equal(-1, indexOf("Hello", "HELLO"));
  equal(1, indexOf(" HELLO ", "HELLO"));
  equal(7, indexOf("sdfsdf Hello", "Hello"));
  equal(-1, indexOf("Hello", "e", 5));
  equal(1, indexOf("Hello", "e", 1));
});
