/**
 * ## Overview
 *
 * The runtime-constants module is helpful for JavaScript runtime detection
 * which is useful for writing compatability layers in modules for
 * different runtimes.
 *
 * ## Basic Usage
 *
 * ```typescript
 * import { RUNTIME, BUN, DENO, NODE, BROWSER, CLOUDFLARE } from "@frostyeti/globals/js";
 *
 * console.log(RUNTIME);
 * console.log("bun", BUN);
 * console.log("deno", DENO);
 * console.log("node", NODE);
 * console.log("browser", BROWSER);
 * console.log("cloudflare", CLOUDFLARE);
 * ```
 *
 * [MIT License](./LICENSE.md)
 */
import { globals } from "./globals.ts";

/**
 * Returns true if the runtime is `bun`, otherwise, `false`.
 */
export const BUN = globals.Bun !== undefined;

/**
 * Returns true if the runtime is `deno`, otherwise, `false`.
 */
export const DENO = globals.Deno !== undefined;
/**
 * Returns true if the runtime is node-like like `node` or `bun`, otherwise, `false`.
 */
export const NODELIKE = globals.process !== undefined;
/**
 * Returns true if the runtime is `node`, otherwise, `false`.
 */
export const NODE = !BUN && !DENO;

const nav = globals.navigator as unknown as Record<string, unknown> | undefined;
const userAgent = nav?.userAgent as string | undefined;

/**
 * Returns `true` if the runtime is `cloudflare`, otherwise, `false`.
 */
export const CLOUDFLARE: boolean = (userAgent?.includes("Cloudflare-Workers")) || false;

/**
 * Returns `true` if the runtime is a  `browser`, otherwise, `false`.
 */
export const BROWSER = globals.window !== undefined && !NODELIKE && !DENO && !CLOUDFLARE;
export type Runtimes = "bun" | "deno" | "node" | "browser" | "cloudflare" | "unknown";

let runtimeName: Runtimes = "unknown";
let version = "";
let nodeVersion = "";
if (BUN) {
    const bun = globals.Bun as Record<string, unknown>;
    const process = globals.process as unknown as Record<string, unknown>;
    const versions = process.versions as Record<string, unknown>;
    runtimeName = "bun";
    version = bun.version as string;
    nodeVersion = versions.node as string;
} else if (DENO) {
    runtimeName = "deno";
    const deno = globals.Deno as Record<string, unknown>;
    const v = deno.version as Record<string, unknown>;
    version = v.deno as string;
} else if (CLOUDFLARE) {
    runtimeName = "cloudflare";
} else if (NODE) {
    runtimeName = "node";
    const process = globals.process as unknown as Record<string, unknown>;
    const versions = process.versions as Record<string, unknown>;
    nodeVersion = versions.node as string;
    version = nodeVersion;
} else if (BROWSER) {
    runtimeName = "browser";
} else {
    runtimeName = "unknown";
}

/**
 * The runtime version.
 */
export const VERSION = version;
/**
 * The node version if the runtime is `node`, otherwise, an empty string.
 */
export const NODE_VERSION = nodeVersion;
/**
 * The runtime name: `bun`, `deno`, `node`, `browser`, `cloudflare`, or `unknown`.
 */
export const RUNTIME: Runtimes = runtimeName;
