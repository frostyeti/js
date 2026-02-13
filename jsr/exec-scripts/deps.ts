/**
 * @module
 * Internal dependency re-exports for this package.
 *
 * Note: This file is primarily used to keep dependency versions centralized.
 */
export { cmd, pathFinder, type CommandArgs, type CommandOptions, 
    type ShellCommandOptions, Command, convertCommandArgs, ShellCommand } from "jsr:@frostyeti/exec@0.0.0-alpha.0.1.0";
export { WINDOWS } from "jsr:@frostyeti/globals@^0.0.0-alpha.0.1.0";
export { isfile, mktempSync, renameSync, writeFileSync, writeTextFileSync, rm } from "jsr:@frostyeti/fs@^0.0.0-alpha.0.1.0";
export { isAbsolute, resolve } from "jsr:@frostyeti/path@^0.0.0-alpha.0.1.0";
