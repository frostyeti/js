/**
 * The `camelize` module provides a function to convert strings to camelCase.
 * Handles snake_case, kebab-case, and space-separated words.
 *
 * @example Basic usage
 * ```ts
 * import { camelize } from "@frostyeti/slices/camelize";
 *
 * String.fromCodePoint(...camelize("hello_world"));  // "helloWorld"
 * String.fromCodePoint(...camelize("hello-world"));  // "helloWorld"
 * String.fromCodePoint(...camelize("hello world"));  // "helloWorld"
 * ```
 *
 * @module
 */

import { CharArrayBuilder } from "./char_array_builder.ts";
import { CHAR_HYPHEN_MINUS, CHAR_UNDERSCORE } from "@frostyeti/chars/constants";
import { isDigit } from "@frostyeti/chars/is-digit";
import { isLetter } from "@frostyeti/chars/is-letter";
import { isSpace } from "@frostyeti/chars/is-space";
import { toLower } from "@frostyeti/chars/to-lower";
import { toUpper } from "@frostyeti/chars/to-upper";
import { type CharBuffer, toCharSliceLike } from "./utils.ts";

/**
 * Options for the `camelize` function.
 */
export interface CamelizeOptions {
    /**
     * If true, preserves the case of characters that are not the first character
     * or immediately after a separator. If false (default), the function preserves
     * existing case but lowercases the first character.
     */
    preserveCase?: boolean;
}

/**
 * Converts a string to camelCase. Handles snake_case, kebab-case, and
 * space-separated words by removing separators and capitalizing the
 * following character.
 *
 * The first character is always lowercased. Characters after separators
 * (`_`, `-`, or space) are uppercased.
 *
 * @param value - The string to convert to camelCase.
 * @param options - Options to control case handling.
 * @returns The camelCase string as a Uint32Array.
 *
 * @example Basic conversions
 * ```ts
 * String.fromCodePoint(...camelize("hello_world"));  // "helloWorld"
 * String.fromCodePoint(...camelize("hello-world"));  // "helloWorld"
 * String.fromCodePoint(...camelize("hello world"));  // "helloWorld"
 * String.fromCodePoint(...camelize("HelloWorld"));   // "helloWorld"
 * ```
 *
 * @example Multiple separators
 * ```ts
 * String.fromCodePoint(...camelize("hello__world"));  // "helloWorld"
 * String.fromCodePoint(...camelize("hello--world"));  // "helloWorld"
 * ```
 *
 * @example With numbers
 * ```ts
 * String.fromCodePoint(...camelize("hello_world_123"));  // "helloWorld123"
 * String.fromCodePoint(...camelize("version_2_0"));  // "version20"
 * ```
 *
 * @example With Unicode
 * ```ts
 * String.fromCodePoint(...camelize("café_latte"));  // "caféLatte"
 * String.fromCodePoint(...camelize("über_mensch"));  // "überMensch"
 * ```
 */
export function camelize(value: CharBuffer | string, options?: CamelizeOptions): Uint32Array {
    options ??= {};
    const v = toCharSliceLike(value);

    const sb = new CharArrayBuilder();

    let last = 0;
    for (let i = 0; i < value.length; i++) {
        const c = v.at(i) ?? -1;
        if (c === -1) {
            continue;
        }

        if (i === 0 && isLetter(c)) {
            sb.appendChar(toLower(c));
            last = c;
            continue;
        }

        if (isLetter(c)) {
            if (last === CHAR_UNDERSCORE) {
                sb.appendChar(toUpper(c));
                last = c;
                continue;
            }

            sb.appendChar(c);
            last = c;
            continue;
        }

        if (c === CHAR_HYPHEN_MINUS || c === CHAR_UNDERSCORE || isSpace(c)) {
            last = CHAR_UNDERSCORE;
            continue;
        }

        if (isDigit(c)) {
            last = c;
            sb.appendChar(c);
            continue;
        }

        sb.appendChar(c);
        last = c;
    }

    const r = sb.toArray();
    sb.clear();
    return r;
}
