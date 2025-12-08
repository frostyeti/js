/**
 * The `stringify` module provides functionality to convert an object of environment variables
 * into a string representation.
 *
 * @module
 */
/**
 * Options for stringifying environment variables.
 */
export interface StringifyOptions {
  /**
   * If set to true, only line feed (`\n`) will be used as the newline character.
   * Otherwise, the default newline character for the environment will be used.
   */
  onlyLineFeed?: boolean;
}
/**
 * Converts an environment variables object into a string representation.
 *
 * @param env - An object containing environment variables as key-value pairs.
 * @param options - Optional settings for stringifying.
 * @param options.onlyLineFeed - If true, use only line feed (`\n`) for new lines instead of the default end-of-line sequence.
 * @returns The stringified representation of the environment variables.
 */
export declare function stringify(
  env: Record<string, string>,
  options?: StringifyOptions,
): string;
