import { globals } from "@frostyeti/globals/globals";
let a = [];
if (globals.Deno) {
  a = globals.Deno.args;
} else if (globals.process) {
  a = globals.process.argv.slice(2);
}
/**
 * The current process arguments. The arguments do not include the
 * executable path or the script path.
 */
export const args = a;
