import { test } from "node:test";
import { exists, ok } from "@frostyeti/assert";
import { NODELIKE } from "@frostyeti/globals";
import { execPath } from "./exec_path.js";
test("process::execPath", () => {
  const p = execPath();
  exists(p);
  if (NODELIKE) {
    ok(p.length > 0);
  } else {
    ok(p.length === 0);
  }
});
