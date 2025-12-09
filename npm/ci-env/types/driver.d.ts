/**
 * The CI provider.
 */
export type CiDriver =
  | "local"
  | "github"
  | "gitlab"
  | "bitbucket"
  | "azdo"
  | "jenkins"
  | "travisci"
  | "appveyor"
  | "circleci"
  | "codeship"
  | "drone"
  | "gitea";
/**
 * The CI provider.
 */
export declare const CI_DRIVER: CiDriver;
/**
 * Determines if the current environment is a CI environment.
 */
export declare const CI: boolean;
export declare function prependPath(path: string): void;
export declare function setVar(
  key: string,
  value: string,
  output?: boolean,
  secret?: boolean,
): void;
export declare function setInteractive(enable: boolean): void;
export declare function isInteractive(): boolean;
