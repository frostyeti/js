import { test } from "node:test";
import { BUN, DENO, globals, NODE } from "@frostyeti/globals";
import { fail } from "@frostyeti/assert";
import { dirname, fromFileUrl } from "@frostyeti/path";
import { spawnSync } from "node:child_process";
const dir = dirname(fromFileUrl(import.meta.url));
const WINDOWS = (globals.Deno && globals.Deno.build.os === "windows") ||
  (globals.process && globals.process.platform === "win32");
const deno = WINDOWS ? "deno.exe" : "deno";
const node = WINDOWS ? "node.exe" : "node";
const bun = WINDOWS ? "bun.exe" : "bun";
test("process::exit 0", () => {
  if (DENO) {
    const o = spawnSync(deno, ["run", "-A", `${dir}/internal/exit_0.ts`], {
      encoding: "utf-8",
      stdio: "pipe",
    });
    const code = o.status;
    if (code !== 0) {
      fail(`_exit_0.ts run failed exit code ${code}`);
    }
    return;
  }
  if (BUN) {
    const o = spawnSync(bun, [`${dir}/internal/exit_0.js`], {
      encoding: "utf-8",
      stdio: "pipe",
    });
    const code = o.status;
    if (code !== 0) {
      fail(`_exit_0.ts run failed exit code ${code}`);
    }
    return;
  }
  if (NODE) {
    const o = spawnSync(node, [`${dir}/internal/exit_0.js`], {
      encoding: "utf-8",
      stdio: "pipe",
    });
    const code = o.status;
    if (code !== 0) {
      fail(`_exit_0.js run failed exit code ${code}`);
    }
    return;
  }
});
test("process::exit 1", () => {
  if (DENO) {
    const o = spawnSync("deno", ["run", "-A", `${dir}/internal/exit_1.ts`], {
      encoding: "utf-8",
      stdio: "pipe",
    });
    const code = o.status;
    if (code !== 1) {
      fail(`_exit_1.ts run failed exit code ${code}`);
    }
    return;
  }
  if (BUN) {
    const o = spawnSync("bun", [`${dir}/internal/exit_1.js`], {
      encoding: "utf-8",
      stdio: "pipe",
    });
    const code = o.status;
    if (code !== 1) {
      fail(`_exit_1.ts run failed exit code ${code}`);
    }
    return;
  }
  if (NODE) {
    const o = spawnSync("node", [`${dir}/internal/exit_0.js`], {
      encoding: "utf-8",
      stdio: "pipe",
    });
    const code = o.status;
    if (code !== 0) {
      fail(`_exit_1.js run failed exit code ${code}`);
    }
    return;
  }
});
