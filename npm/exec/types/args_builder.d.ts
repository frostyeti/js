/**
 * The `args-builder` module provides a class for building command line arguments.
 *
 * @module
 */
export interface ArgsBuilderOptions {
  prefix?: string;
  shortPrefix?: string;
  assign?: string;
  flags?: string[];
  appendArgs?: boolean;
}
/** */
export declare class ArgsBuilder {
  #private;
  constructor(options?: ArgsBuilderOptions);
  /**
   * The arguments to add.
   *
   * @param arg The arguments to add.
   * @returns The builder.
   */
  args(...arg: string[]): this;
  /**
   * Adds subcommands to the command.
   * @param command The command to add.
   * @returns The builder.
   */
  subcommand(...command: string[]): this;
  /**
   * Adds a flag to the command.
   * @param flags The flags to add.
   * @returns The builder.
   */
  flag(...flags: string[]): this;
  /**
   * Adds an option to the command.
   * @param name The name of the option.
   * @param value The value of the option.
   * @param singleQuote Whether to wrap the value in single quotes.
   * @returns The builder.
   */
  option(name: string, value: unknown, singleQuote?: boolean): this;
  /**
   * Appends arguments that should be placed after the command
   * using the `--` separator.
   * @param arg The arguments to append.
   * @returns The builder.
   */
  postArgs(...args: string[]): this;
  /**
   * Builds the arguments.
   * @returns The built arguments.
   */
  build(): string[];
}
