/**
 * The `stringify-document` module provides functionality to convert a `DotEnvDocument`.
 *
 * @module
 */
import type { DotEnvDocument } from "./document.js";
/**
 * Options for {@linkcode stringifyDocument} a document.
 */
export interface StringifyDocumentOptions {
  /**
   * If true, only line feeds will be used as newlines `\n`.
   */
  onlyLineFeed?: boolean;
}
/**
 * Converts a DotEnvDocument into a string representation.
 *
 * @param document - The DotEnvDocument to be converted.
 * @param options - Optional settings to customize the stringification process.
 * @returns The string representation of the DotEnvDocument.
 */
export declare function stringifyDocument(
  document: DotEnvDocument,
  options?: StringifyDocumentOptions,
): string;
