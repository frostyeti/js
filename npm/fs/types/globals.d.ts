import { globals, WINDOWS } from "@frostyeti/globals";
export { globals, WINDOWS };
/**
 * @internal
 */
export declare const WIN: boolean;
export declare const IS_DENO: boolean;
export declare function loadFs(): typeof import("node:fs") | undefined;
export declare function getNodeFs(): any;
export declare function loadFsAsync():
  | typeof import("node:fs/promises")
  | undefined;
