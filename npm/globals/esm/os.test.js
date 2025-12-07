import { test } from "node:test";
import { globals } from "./globals.js";
import { equal, exists } from "@frostyeti/assert";
import { RUNTIME } from "./runtime_info.js";
import {
  ARCH,
  DARWIN,
  DEV_NULL,
  DIR_SEP,
  DIR_SEP_RE,
  EOL,
  IS_64BIT,
  LINUX,
  PATH_SEP,
  PLATFORM,
  WINDOWS,
} from "./os.js";
test("globals::os", () => {
  exists(PLATFORM);
  exists(ARCH);
  exists(IS_64BIT);
  switch (RUNTIME) {
    case "bun":
    case "node":
      {
        const process = globals.process;
        let platform = process.platform;
        if (platform === "win32") {
          platform = "windows";
        }
        equal(PLATFORM, platform);
      }
      return;
    case "deno":
      {
        const deno = globals.Deno;
        const build = deno.build;
        const platform = build.os;
        equal(PLATFORM, platform);
      }
      break;
    case "browser":
      exists(PLATFORM);
      return;
    case "cloudflare":
      equal(PLATFORM, "linux");
      return;
    default:
      equal(PLATFORM, "unknown");
      return;
  }
  switch (PLATFORM) {
    case "windows":
      equal(WINDOWS, true);
      equal(PATH_SEP, ";");
      equal(DIR_SEP, "\\");
      equal(DIR_SEP_RE, /[\\/]+/);
      equal(EOL, "\r\n");
      equal(DEV_NULL, "NUL");
      break;
    case "linux":
      equal(LINUX, true);
      equal(PATH_SEP, ":");
      equal(DIR_SEP, "/");
      equal(DIR_SEP_RE, /\/+/);
      equal(EOL, "\n");
      equal(DEV_NULL, "/dev/null");
      break;
    case "darwin":
      equal(DARWIN, true);
      equal(PATH_SEP, ":");
      equal(DIR_SEP, "/");
      equal(DIR_SEP_RE, /\/+/);
      equal(EOL, "\n");
      equal(DEV_NULL, "/dev/null");
      break;
    default:
      equal(PATH_SEP, ":");
      equal(DIR_SEP, "/");
      equal(DIR_SEP_RE, /\/+/);
      equal(EOL, "\n");
      equal(DEV_NULL, "/dev/null");
      break;
  }
});
