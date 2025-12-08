/**
 * The `load` module provides functionality to load environment variables from a source object
 * into the environment, with options for variable expansion and existing variable handling.
 *
 * @module
 */
import { expand } from "./expand.js";
import { has, set } from "@frostyeti/env";
/**
 * Loads environment variables from the given source object into the environment.
 *
 * @param source - A record containing key-value pairs of environment variables.
 * @param options - Optional settings for loading the environment variables.
 * @param options.skipExpansion - If true, skips the expansion of variables.
 * @param options.skipExisiting - If true, skips setting variables that already exist in the environment.
 */
export function load(source, options) {
  if (!options?.skipExpansion) {
    source = expand(source);
  }
  for (const key in source) {
    if (options?.skipExisiting && has(key)) {
      continue;
    }
    set(key, source[key]);
  }
}
