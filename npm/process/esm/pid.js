import { globals } from "@frostyeti/globals/globals";
let id = 0;
if (globals.Deno) {
  id = globals.Deno.pid;
} else if (globals.process) {
  id = globals.process.pid;
}
/**
 * The current process ID. The process ID is a unique identifier for the
 * current process. In a browser environment, the process ID is always 0.
 */
export const pid = id;
