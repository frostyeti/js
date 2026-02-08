import process from "node:process";
import { spawnSync } from "node:child_process";
import { WINDOWS } from "@frostyeti/globals";
let elevated;
let evalIsProcessElevated = function (cache = true) {
  if (cache && elevated !== undefined) {
    return elevated;
  }
  elevated = process.getuid && process.getuid() === 0;
  return elevated === true;
};
if (WINDOWS) {
  // TODO: use koffi or something else
  evalIsProcessElevated = function (cache = true) {
    if (cache && elevated !== undefined) {
      return elevated;
    }
    try {
      spawnSync("net", ["session"], {
        stdio: "ignore",
        shell: true,
        windowsHide: true,
      });
      elevated = process.exitCode === 0;
    } catch (_) {
      // If an error occurs, we can assume the process is not elevated
      return false;
    }
    return elevated;
  };
}
export { evalIsProcessElevated };
