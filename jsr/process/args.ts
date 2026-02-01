import { globals } from "@frostyeti/globals/globals";

let a: Array<string> = [];

if (globals.Deno) {
    a = globals.Deno.args;
} else if (globals.process) {
    a = globals.process.argv.slice(2);
}

/**
 * The current process arguments. The arguments do not include the
 * executable path or the script path.
 * @example
 * ```typescript
 * import { args } from '@frostyeti/process/args';
 *
 * console.log(args);
 * ```
 */
export const args: ReadonlyArray<string> = a;
