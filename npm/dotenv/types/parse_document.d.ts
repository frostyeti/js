/**
 * The `parse-document` module provides functionality to parse a dotenv-style
 * document string into a structured representation. It handles comments,
 * key-value pairs, and quoted values, allowing for a flexible and robust
 * parsing of environment variable definitions.
 *
 * @module
 */
import { DotEnvDocument } from "./document.js";
/**
 * Parses the given content string as a dotenv document.
 *
 * This function processes the content line by line, handling comments,
 * key-value pairs, and quoted values. It supports different types of quotes
 * (single, double, and backtick) and allows for escaped characters within
 * quoted values.
 *
 * @param content - The content string to be parsed.
 * @returns A DotEnvDocument object representing the parsed content.
 * @throws Will throw an error if an invalid character is encountered in a key
 *         or if an empty key is found.
 */
export declare function parseDocument(content: string): DotEnvDocument;
