/**
 * Returns true if the runtime is `bun`, otherwise, `false`.
 */
export declare const BUN: boolean;
/**
 * Returns true if the runtime is `deno`, otherwise, `false`.
 */
export declare const DENO: boolean;
/**
 * Returns true if the runtime is node-like like `node` or `bun`, otherwise, `false`.
 */
export declare const NODELIKE: boolean;
/**
 * Returns true if the runtime is `node`, otherwise, `false`.
 */
export declare const NODE: boolean;
/**
 * Returns `true` if the runtime is `cloudflare`, otherwise, `false`.
 */
export declare const CLOUDFLARE: boolean;
/**
 * Returns `true` if the runtime is a  `browser`, otherwise, `false`.
 */
export declare const BROWSER: boolean;
export type Runtimes =
  | "bun"
  | "deno"
  | "node"
  | "browser"
  | "cloudflare"
  | "unknown";
/**
 * The runtime version.
 */
export declare const VERSION: string;
/**
 * The node version if the runtime is `node`, otherwise, an empty string.
 */
export declare const NODE_VERSION: string;
/**
 * The runtime name: `bun`, `deno`, `node`, `browser`, `cloudflare`, or `unknown`.
 */
export declare const RUNTIME: Runtimes;
