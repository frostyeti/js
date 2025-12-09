/**
 * Provides the inspect function for inspecting objects which
 * abstracts over the Deno and NodeJS inspect functions and then
 * falls back to JSON.stringify.
 *
 * @module
 */
import { DENO, globals } from "./globals.js";
// deno-lint-ignore no-explicit-any
function getNodeUtil() {
  if (globals.process && globals.process.getBuiltinModule) {
    return globals.process.getBuiltinModule("node:util");
  }
  if (globals.Bun) {
    try {
      // @ts-ignore ignore
      const utils = require("node:util");
      return utils;
    } catch (_) {
      console.log("require failed, falling back to JSON.stringify");
      // ignore
    }
  }
  return {
    // deno-lint-ignore no-unused-vars
    inspect: (value, options) => {
      console.log("NodeJS environment detected, using JSON.stringify");
      return JSON.stringify(value, null, 2);
    },
  };
}
/**
 * Returns a string representation of the given value.
 *
 * @description
 * When inspect is called in a browser environment, it will return a JSON.stringify
 * representation of the value. In a NodeJS like environment, it will return a string
 * representation of the value using the util.inspect function. In a Deno environment,
 * it will return a string representation of the value using the Deno.inspect function.
 *
 * @param value The value to inspect.
 * @param options The options for the function.
 * @returns A string representation of the given value.
 */
export function inspect(value, options) {
  options ??= {};
  if (DENO) {
    return globals.Deno.inspect(value, options);
  }
  if (globals.process) {
    let compact = 3;
    if (options.compact === false) {
      compact = false;
    } else if (options.compact === true) {
      compact = true;
    }
    let depth = 4;
    if (options.depth !== undefined) {
      depth = options.depth;
    }
    const o = {
      colors: options.colors ?? false,
      showHidden: options.showHidden,
      depth: depth,
      breakLength: options.breakLength,
      compact: compact,
      sorted: options.sorted,
      getters: options.getters,
      showProxy: options.showProxy,
      trailingComma: options.trailingComma,
      escapeSequences: options.escapeSequences,
      maxArrayLength: options.iterableLimit,
      maxStringLength: options.strAbbreviateSize,
      numericSeparator: options.escapeSequences,
      customInspect: true,
    };
    return getNodeUtil().inspect(value, o);
  }
  return JSON.stringify(value, null, 2);
}
