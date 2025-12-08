import type { SubstitutionOptions } from "@frostyeti/env/expand";
/**
 * Expands environment variables within a given source object.
 *
 * @param source - A record containing key-value pairs where the values may contain environment variable references.
 * @param options - Optional substitution options to customize the expansion behavior.
 * @returns A new record with the expanded values.
 */
export declare function expand(
  source: Record<string, string>,
  options?: SubstitutionOptions,
): Record<string, string>;
