import { DARWIN, globals, WINDOWS } from "@frostyeti/globals";
export { DARWIN, globals, WINDOWS };
export declare const WIN: boolean;
export declare function loadChildProcess():
  | typeof import("node:child_process")
  | undefined;
