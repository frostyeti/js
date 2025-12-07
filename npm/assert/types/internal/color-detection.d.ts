/**
 * The ANSI mode of the terminal.
 */
export declare enum AnsiMode {
  /**
   * Automatically detect the ANSI mode.
   */
  Auto = -1,
  /**
   * No ANSI support.
   */
  None = 0,
  /**
   * 3-bit ANSI support.
   */
  ThreeBit = 1,
  /**
   * 4-bit ANSI support.
   */
  FourBit = 2,
  /**
   * 8-bit ANSI support.
   */
  EightBit = 4,
  /**
   * 24-bit ANSI support.
   */
  TwentyFourBit = 8,
}
/**
 * Detects the ANSI mode of the terminal.
 * @returns The ANSI mode of the terminal.
 */
export declare function detectMode(): AnsiMode;
export declare const enabled: boolean;
