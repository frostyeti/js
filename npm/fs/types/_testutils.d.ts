export type stdio = "inherit" | "pipe" | "null";
export interface ExecOptions {
  stdin?: stdio;
  stdout?: stdio;
  stderr?: stdio;
  env?: {
    [key: string]: string | undefined;
  };
  cwd?: string;
}
export interface output {
  stdout: string;
  stderr: string;
  code: number;
}
export declare function output(
  command: string,
  args: string[],
  options?: ExecOptions,
): Promise<output>;
export declare function outputSync(
  command: string,
  args: string[],
  options?: ExecOptions,
): output;
export declare function exec(
  command: string,
  args: string[],
  options?: ExecOptions,
): Promise<number>;
export declare function execSync(
  command: string,
  args: string[],
  options?: ExecOptions,
): number;
export declare class DisposableTempDir {
  #private;
  constructor();
  get path(): string;
  [Symbol.dispose](): void;
  [Symbol.asyncDispose](): Promise<void>;
}
