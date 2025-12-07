# @frostyeti/strings

## Overview

A collection of string utilities for comparisons and transforms, including case
insensitive comparisons.

The comparions are functions like `equal`, `startsWith`, `indexOf`, etc. Each of
those have both a normal version like `equal` and a case insensitive version
like `equalFold`. which does a comparison without creating new string
allocations using something like toLowerCase().

The case insensity should handle most of utf8 and more than just ascii or latin1
characters. e.g. `equalFold("hello WÖrLD", "Hello wörld")` returns true.

The string tranformations includes functions like `singularize`, `dasherize`,
`camelize`, `titleize`, etc.

The basic checks functions include `isNull`, `isEmpty`, `isSpace`,
`isNullOrEmpty`, and `isNullOrSpace`.

The trim methods can trim characters other than whitespace characters.

![logo](https://raw.githubusercontent.com/frostyeti/js/refs/heads/master/eng/assets/logo.png)

[![JSR](https://jsr.io/badges/@frostyeti/strings)](https://jsr.io/@frostyeti/strings)
[![npm version](https://badge.fury.io/js/@frostyeti%2Fstrings.svg)](https://badge.fury.io/js/@frostyeti%2Fstrings)
[![GitHub version](https://badge.fury.io/gh/frostyeti%2Fjs.svg)](https://badge.fury.io/gh/frostyeti%2Fjs)

## Documentation

Documentation is available on [jsr.io](https://jsr.io/@frostyeti/strings/doc)

A list of other modules can be found at
[github.com/frostyeti/js](https://github.com/frostyeti/js)

## Usage

```typescript
import * from str from '@frostyeti/strings'

console.log(str.equalFold("left", "LeFT")); // true
console.log(str.equalFold("hello WÖrLD", "Hello wörld")); // true
console.log(str.equalFold("hello WÖrLD", "rld")); // false
console.log(str.trimEnd("my random text...", ".")); // my random text
console.log(str.underscore(" first-place")); // first_place
console.log(str.underscore(" first-place", { screaming: true })); // FIRST_PLACE

// useful for FFI
var sb = new str.StringBuilder()
sb.append("test \n")
   .append(new TextEncoder().encode(": another test \n"));
   .appendChar(33);

console.log(sb.toString())
```

## Classes

- `StringBuilder` - A builder for strings which does not use string
  concatination and instead uses numbers as runes and only builds the string
  when toString() is called.

## Functions

- `camelize` - converts a word to camel case.
- `capitalize` - capitalizes a word.
- `dasherize` - converts a word to hyphen/dash case.
- `endsWith` - determines if a string or char array ends with characters.
- `endsWithFold` - determines if a string or char array ends with characters
  using case insensitivity.
- `equalFold` - determines if a string or char array with characeters.
- `equal` - determines if a string or char array with characters.
- `indexOfFold` - determines the index of a character or char array using case
  insensitivity.
- `indexOf` - determines the index of of a character or char array.
- `lastIndexOfFolder` - determines the last index of a character or char array
  using case insensitivity.
- `lastIndex` - determines the last index of a character or char array.
- `ordinalize` - converts word/number to the ordinal case.
- `pluralize` - converts singular words to their plural counterpart.
- `pascalize` - converts a word to pascal case.
- `singularize` - converts pluralized words to their singular counterpart.
- `startsWith` - determines if a string or char array starts with another char
  array.
- `startsWithFold` - determines if a string or char array starts with another
  char array using case insensitivity.
- `titleize` - converts characters into title case.
- `trim` - trims the specified characters from the start and end of a char
  array. defaults to whitespace.
- `trimStart` - trims the specified characters from the start of a char array.
  defaults to whitespace.
- `trimEnd` - trims the specified characters from the end of a char array.
  defaults to whitespace.
- `toCharArray` - converts a string to in array of characters/runes represented
  by a number.
- `toString` - converts an array of characters into a string.
- `undercore` - converts a word to use underscores. if the screaming option is
  set to true, then all letters are capitializeds.

## LICENSE

[MIT License](./LICENSE.md)

Pluralize and singularize comes from <github.com/dreamerslab/node.inflection>
which is under the
[MIT LICENSE](https://github.com/dreamerslab/node.inflection/blob/master/LICENSE)
