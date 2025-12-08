import { parseDocument } from "./parse_document.js";
/**
 * Parses a given string source and returns a record of key-value pairs.
 *
 * @param source - The string containing the environment variables to parse.
 * @returns A record where each key is an environment variable name and each value is the corresponding environment variable value.
 */
export function parse(source) {
  const document = parseDocument(source);
  return document.toObject();
}
