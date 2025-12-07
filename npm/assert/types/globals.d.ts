export declare const globals: typeof globalThis & Record<string, any> & {
  Deno?: {
    build: {
      os: string;
    };
  };
  process?: typeof process;
};
export declare const WINDOWS: boolean;
